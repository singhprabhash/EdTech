// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, expect, it } from "vitest";
import {
  database,
  persistSubmission,
  closeDatabases,
} from "../../src/server/database.mjs";
import { createBackup, restoreBackup } from "../../src/server/backup.mjs";
import { storeUpload } from "../../src/server/files.mjs";
const dirs: string[] = [];
afterEach(() => {
  closeDatabases();
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
it("backs up and restores both transactional records and associated immutable private files", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "aeetds-backup-test-"));
  dirs.push(root);
  const storage = {
    directory: path.join(root, "live"),
    secret: "test-secret-not-used-in-production",
  };
  const db = database(storage);
  const pdf = Buffer.from("%PDF-1.4\nbackup fixture\n%%EOF");
  const file = await storeUpload(
    storage,
    new File([pdf], "receipt.pdf", { type: "application/pdf" }),
    "receipt",
    {},
    async () => {},
  );
  const original = persistSubmission(db, {
    requestId: "one",
    fingerprint: "fp",
    type: "CONF-REG",
    values: { email: "person@example.test" },
    files: [file],
  });
  const backup = await createBackup(storage, path.join(root, "backups"));
  const snapshot = path.join(root, "backups", backup.name);
  const target = path.join(root, "restored");
  expect(await restoreBackup(snapshot, target)).toEqual({ files: 1 });
  const restored = new DatabaseSync(path.join(target, "aeetds.sqlite"), {
    readOnly: true,
  });
  try {
    expect(
      restored.prepare("SELECT reference FROM submissions").get()!.reference,
    ).toBe(original.record.reference);
    expect(restored.prepare("SELECT COUNT(*) n FROM outbox").get()!.n).toBe(2);
  } finally {
    restored.close();
  }
  expect(readFileSync(path.join(target, "uploads", file.storage_key))).toEqual(
    pdf,
  );
  await expect(restoreBackup(snapshot, target)).rejects.toThrow(
    /must not exist/,
  );
  writeFileSync(path.join(snapshot, "uploads", file.storage_key), "tampered");
  await expect(
    restoreBackup(snapshot, path.join(root, "bad-restore")),
  ).rejects.toThrow(/checksum/);
});
it("refuses backups inside live data or the public checkout", async () => {
  const root = mkdtempSync(path.join(tmpdir(), "aeetds-backup-path-"));
  dirs.push(root);
  const storage = { directory: root, secret: "test" };
  database(storage);
  await expect(
    createBackup(storage, path.join(root, "backups")),
  ).rejects.toThrow(/separate/);
  await expect(
    createBackup(storage, path.join(process.cwd(), "public", "backups")),
  ).rejects.toThrow(/outside/);
});
