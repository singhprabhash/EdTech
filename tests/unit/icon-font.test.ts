import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import manifest from "../../src/config/icon-font-manifest.json";
it("retains the archived font and verifies the smaller exact-glyph derivative", () => {
  const hash = (file: string) =>
    createHash("sha256").update(readFileSync(file)).digest("hex");
  expect(hash(manifest.source)).toBe(manifest.sourceSha256);
  expect(hash("public/fonts/material-symbols-site.woff2")).toBe(
    manifest.outputSha256,
  );
  expect(manifest.subsetBytes).toBeLessThan(manifest.originalBytes / 5);
});
it("includes all literal production icon names and canonical icon fields", () => {
  for (const entry of readdirSync("src", {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!entry.isFile() || !entry.name.match(/\.(tsx?|json)$/)) continue;
    const file = `${entry.parentPath}/${entry.name}`;
    if (file.endsWith("icon-font-manifest.json")) continue;
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(
      /(?:<Icon\b[^>]*\bname=|\bicon:\s*)["']([a-z0-9_]+)["']/g,
    ))
      expect(manifest.icons, `${file}: ${match[1]}`).toContain(match[1]);
  }
});
