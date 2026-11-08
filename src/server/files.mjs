import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { hash } from "./database.mjs";
const execute = promisify(execFile);
export const fileRules = {
  photo: { extensions: ["jpg", "jpeg", "png"], max: 1048576 },
  studentProof: { extensions: ["pdf", "jpg", "jpeg"], max: 2097152 },
  receipt: { extensions: ["pdf", "jpg", "jpeg", "png"], max: 2097152 },
  asset: { extensions: ["pdf", "jpg", "jpeg", "png", "docx"], max: 10485760 },
};
export function sniffFile(bytes, extension) {
  if (
    extension === "pdf" &&
    bytes.subarray(0, 5).toString() === "%PDF-" &&
    bytes.subarray(-2048).includes(Buffer.from("%%EOF"))
  )
    return "application/pdf";
  if (
    ["jpg", "jpeg"].includes(extension) &&
    bytes.length > 10 &&
    bytes[0] === 255 &&
    bytes[1] === 216 &&
    bytes[2] === 255 &&
    bytes[bytes.length - 2] === 255 &&
    bytes[bytes.length - 1] === 217
  )
    return "image/jpeg";
  if (
    extension === "png" &&
    bytes.length >= 33 &&
    bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    bytes.subarray(12, 16).toString() === "IHDR" &&
    bytes.readUInt32BE(16) > 0 &&
    bytes.readUInt32BE(20) > 0
  )
    return "image/png";
  if (
    extension === "docx" &&
    bytes.length > 100 &&
    bytes.readUInt32LE(0) === 0x04034b50
  ) {
    // Inspect the ZIP central directory without extracting executable or compressed content.
    let eocd = -1;
    for (let p = bytes.length - 22; p >= Math.max(0, bytes.length - 65557); p--)
      if (bytes.readUInt32LE(p) === 0x06054b50) {
        eocd = p;
        break;
      }
    if (eocd < 0) return null;
    const entries = bytes.readUInt16LE(eocd + 10);
    let cursor = bytes.readUInt32LE(eocd + 16),
      total = 0;
    const names = [];
    if (entries > 1000) return null;
    for (let i = 0; i < entries; i++) {
      if (
        cursor + 46 > bytes.length ||
        bytes.readUInt32LE(cursor) !== 0x02014b50
      )
        return null;
      const compressed = bytes.readUInt32LE(cursor + 20),
        expanded = bytes.readUInt32LE(cursor + 24),
        length = bytes.readUInt16LE(cursor + 28),
        extra = bytes.readUInt16LE(cursor + 30),
        comment = bytes.readUInt16LE(cursor + 32);
      const name = bytes.subarray(cursor + 46, cursor + 46 + length).toString();
      if (
        name.includes("..") ||
        name.startsWith("/") ||
        name.includes("\\") ||
        expanded > Math.max(compressed, 1) * 150
      )
        return null;
      total += expanded;
      names.push(name);
      cursor += 46 + length + extra + comment;
    }
    if (
      total > 100 * 1048576 ||
      !names.includes("[Content_Types].xml") ||
      !names.includes("word/document.xml") ||
      names.some((name) => /vbaProject|\.exe$|\.js$/i.test(name))
    )
      return null;
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }
  return null;
}
export async function scanUpload(filename, config) {
  if (!config.scanner) throw new Error("SCANNER_UNAVAILABLE");
  await execute(config.scanner, ["--no-summary", filename], {
    timeout: 30000,
    maxBuffer: 16384,
  });
}
export async function storeUpload(
  storage,
  file,
  kind,
  config,
  scanner = scanUpload,
) {
  const rule = fileRules[kind];
  if (!rule) throw new Error("Invalid file field");
  const ext = file.name.toLowerCase().split(".").pop();
  if (!rule.extensions.includes(ext) || file.size === 0 || file.size > rule.max)
    throw new Error("Invalid file size or extension");
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = sniffFile(bytes, ext);
  if (!mime || mime !== file.type)
    throw new Error("File content does not match its type");
  const id = randomUUID(),
    key = id + "." + ext;
  const quarantine = path.join(storage.directory, "quarantine");
  const uploads = path.join(storage.directory, "uploads");
  await fs.mkdir(quarantine, { recursive: true, mode: 0o700 });
  await fs.mkdir(uploads, { recursive: true, mode: 0o700 });
  const temp = path.join(quarantine, key);
  const handle = await fs.open(temp, "wx", 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await scanner(temp, config);
    await fs.rename(temp, path.join(uploads, key));
    const directory = await fs.open(uploads, "r");
    try {
      await directory.sync();
    } finally {
      await directory.close();
    }
    return {
      id,
      storage_key: key,
      kind,
      mime,
      size: bytes.length,
      sha256: hash(bytes),
    };
  } catch {
    await fs.rm(temp, { force: true });
    throw new Error(
      "Receipt or document could not pass the required safety scan. Please try again or contact the Secretary.",
    );
  }
}
export function privateFilePath(storage, key) {
  if (!/^[a-f0-9-]{36}\.(pdf|jpe?g|png|docx)$/.test(key))
    throw new Error("Invalid storage key");
  return path.join(storage.directory, "uploads", key);
}
export async function removeUploads(storage, files) {
  await Promise.all(
    files.map((file) =>
      fs.rm(privateFilePath(storage, file.storage_key), { force: true }),
    ),
  );
}
