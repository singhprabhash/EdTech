import fs from "node:fs/promises";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { database, hash } from "./database.mjs";
import { privateFilePath } from "./files.mjs";
function outsideProject(value) {
  const resolved = path.resolve(value);
  if (
    !path.isAbsolute(value) ||
    resolved === path.parse(resolved).root ||
    resolved === process.cwd() ||
    resolved.startsWith(process.cwd() + path.sep)
  )
    throw new Error("Choose a private absolute path outside the application.");
  return resolved;
}
export async function createBackup(storage, destination) {
  const root = outsideProject(destination);
  if (
    root === storage.directory ||
    root.startsWith(storage.directory + path.sep)
  )
    throw new Error("Backups must be separate from live storage.");
  await fs.mkdir(root, { recursive: true, mode: 0o700 });
  if ((await fs.lstat(root)).isSymbolicLink())
    throw new Error("Backup path cannot be a symlink");
  await fs.chmod(root, 0o700);
  const temporary = await fs.mkdtemp(path.join(root, ".snapshot-"));
  try {
    const dbfile = path.join(temporary, "aeetds.sqlite");
    database(storage).prepare("VACUUM INTO ?").run(dbfile);
    await fs.chmod(dbfile, 0o600);
    const snapshot = new DatabaseSync(dbfile, { readOnly: true });
    let entries;
    try {
      if (
        snapshot.prepare("PRAGMA integrity_check").get().integrity_check !==
        "ok"
      )
        throw new Error("Snapshot is invalid");
      entries = snapshot
        .prepare(
          "SELECT storage_key,size,sha256 FROM files UNION SELECT storage_key,size,sha256 FROM assets",
        )
        .all();
    } finally {
      snapshot.close();
    }
    await fs.mkdir(path.join(temporary, "uploads"), { mode: 0o700 });
    const files = [];
    for (const entry of entries) {
      const bytes = await fs.readFile(
        privateFilePath(storage, entry.storage_key),
      );
      if (bytes.length !== entry.size || hash(bytes) !== entry.sha256)
        throw new Error("Stored file checksum mismatch");
      await fs.writeFile(
        path.join(temporary, "uploads", entry.storage_key),
        bytes,
        { flag: "wx", mode: 0o600 },
      );
      files.push({ ...entry });
    }
    const manifest = {
      version: 1,
      createdAt: new Date().toISOString(),
      databaseSha256: hash(await fs.readFile(dbfile)),
      files,
    };
    await fs.writeFile(
      path.join(temporary, "manifest.json"),
      JSON.stringify(manifest, null, 2),
      { mode: 0o600 },
    );
    const name = `aeetds-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID()}`;
    await fs.rename(temporary, path.join(root, name));
    return { name, files: files.length };
  } catch (error) {
    await fs.rm(temporary, { recursive: true, force: true });
    throw error;
  }
}
export async function restoreBackup(snapshotDirectory, destination) {
  const source = outsideProject(snapshotDirectory),
    target = outsideProject(destination);
  try {
    await fs.lstat(target);
    throw new Error(
      "Restore target must not exist. Stop the application and choose a fresh private directory.",
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const manifest = JSON.parse(
    await fs.readFile(path.join(source, "manifest.json"), "utf8"),
  );
  if (
    manifest.version !== 1 ||
    !Array.isArray(manifest.files) ||
    manifest.files.length > 100000
  )
    throw new Error("Invalid backup manifest");
  const dbbytes = await fs.readFile(path.join(source, "aeetds.sqlite"));
  if (hash(dbbytes) !== manifest.databaseSha256)
    throw new Error("Database checksum mismatch");
  const snapshot = new DatabaseSync(path.join(source, "aeetds.sqlite"), {
    readOnly: true,
  });
  let expected;
  try {
    if (
      snapshot.prepare("PRAGMA integrity_check").get().integrity_check !== "ok"
    )
      throw new Error("Snapshot is invalid");
    expected = snapshot
      .prepare(
        "SELECT storage_key,size,sha256 FROM files UNION SELECT storage_key,size,sha256 FROM assets",
      )
      .all();
  } finally {
    snapshot.close();
  }
  if (JSON.stringify(expected) !== JSON.stringify(manifest.files))
    throw new Error("File manifest does not match the database");
  const staging = target + ".restore-" + randomUUID();
  await fs.mkdir(staging, { mode: 0o700 });
  try {
    await fs.mkdir(path.join(staging, "uploads"), { mode: 0o700 });
    for (const entry of expected) {
      const bytes = await fs.readFile(
        privateFilePath({ directory: source }, entry.storage_key),
      );
      if (bytes.length !== entry.size || hash(bytes) !== entry.sha256)
        throw new Error("File checksum mismatch");
      await fs.writeFile(
        privateFilePath({ directory: staging }, entry.storage_key),
        bytes,
        { mode: 0o600, flag: "wx" },
      );
    }
    await fs.writeFile(path.join(staging, "aeetds.sqlite"), dbbytes, {
      flag: "wx",
      mode: 0o600,
    });
    await fs.rename(staging, target);
    return { files: expected.length };
  } catch (error) {
    await fs.rm(staging, { recursive: true, force: true });
    throw error;
  }
}
