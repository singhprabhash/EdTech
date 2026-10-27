// @vitest-environment node
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { checkContent } from "../../scripts/check-content.mjs";

const directories = [];
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "edtech-content-"));
  directories.push(root);
  return root;
}
afterEach(() =>
  directories
    .splice(0)
    .forEach((root) => rmSync(root, { recursive: true, force: true })),
);

describe("production source content guard", () => {
  it("rejects dead hash links and placeholder text with file evidence", () => {
    const root = fixture();
    writeFileSync(join(root, "page.tsx"), '<a href="#">Lorem ipsum</a>');
    expect(checkContent(root)).toEqual([
      expect.stringContaining("dead hash link"),
      expect.stringContaining("placeholder copy"),
    ]);
  });
  it("allows real destinations, fragment targets and nested production files", () => {
    const root = fixture();
    mkdirSync(join(root, "nested"));
    writeFileSync(
      join(root, "nested", "page.tsx"),
      '<a href="/books">Books</a><a href="#main">Skip</a>',
    );
    expect(checkContent(root)).toEqual([]);
  });
  it("does not silently pass a missing or empty production source directory", () => {
    const root = fixture();
    expect(checkContent(root)).toEqual([
      expect.stringContaining("no production source files"),
    ]);
    expect(checkContent(join(root, "absent"))).toEqual([
      expect.stringContaining("missing source directory"),
    ]);
  });
});
