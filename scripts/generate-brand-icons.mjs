import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

// Deterministic format conversion of the actual seal; no recoloring or cropping.
const source = await readFile(
  new URL("../public/aeetds/logo.png", import.meta.url),
);
const sizes = [16, 32, 48];
const frames = await Promise.all(
  sizes.map((size) =>
    sharp(source)
      .resize(size, size, { fit: "contain", background: "#ffffff" })
      .ensureAlpha()
      .png()
      .toBuffer(),
  ),
);
const header = Buffer.alloc(6 + frames.length * 16);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (let i = 0; i < frames.length; i++) {
  const entry = 6 + i * 16;
  header[entry] = sizes[i];
  header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frames[i].length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frames[i].length;
}
const outputs = {
  "favicon.ico": Buffer.concat([header, ...frames]),
  "icon.png": await sharp(source)
    .resize(192, 192, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer(),
  "apple-icon.png": await sharp(source)
    .resize(180, 180, { fit: "contain", background: "#ffffff" })
    .png()
    .toBuffer(),
};
for (const [name, bytes] of Object.entries(outputs))
  await writeFile(new URL(`../src/app/${name}`, import.meta.url), bytes);
await writeFile(
  new URL("../public/aeetds/brand-icons.provenance.json", import.meta.url),
  JSON.stringify(
    {
      source: "logo.png",
      sourceSha256: createHash("sha256").update(source).digest("hex"),
      method:
        "Aspect-preserving resize, white padding; original seal retained. ICO embeds 16/32/48px PNG frames; app PNG 192px; Apple PNG 180px.",
      outputs: Object.fromEntries(
        Object.entries(outputs).map(([name, bytes]) => [
          name,
          createHash("sha256").update(bytes).digest("hex"),
        ]),
      ),
    },
    null,
    2,
  ) + "\n",
);
