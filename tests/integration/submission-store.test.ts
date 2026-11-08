// @vitest-environment node
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, expect, it } from "vitest";
import {
  closeDatabases,
  database,
  persistSubmission,
  consumeLimit,
} from "../../src/server/database.mjs";
const dirs: string[] = [];
afterEach(() => {
  closeDatabases();
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function setup() {
  const directory = mkdtempSync(path.join(tmpdir(), "aeetds-store-"));
  dirs.push(directory);
  const storage = {
    directory,
    secret: "test-only-secret-long-enough-not-production",
  };
  return { db: database(storage), storage };
}
it("persists before acknowledgement, allocates unique sequential references and queues mail atomically", () => {
  const { db } = setup();
  for (let i = 0; i < 20; i++) {
    const result = persistSubmission(db, {
      requestId: `request-${i}`,
      fingerprint: `fp-${i}`,
      type: "ENQUIRY",
      values: { email: "person@example.test" },
      now: new Date("2026-11-08"),
    });
    expect(result.record.reference).toBe(`AEETDS/ENQUIRY/2026/${i + 1}`);
  }
  expect(db.prepare("SELECT COUNT(*) n FROM outbox").get()!.n).toBe(40);
  expect(db.prepare("SELECT COUNT(*) n FROM submissions").get()!.n).toBe(20);
});
it("retry returns original reference without duplicate mail and rejects changed payload", () => {
  const { db } = setup();
  const input = {
    requestId: "one",
    fingerprint: "same",
    type: "ENQUIRY",
    values: { email: "person@example.test" },
  };
  const first = persistSubmission(db, input);
  expect(persistSubmission(db, input)).toMatchObject({
    created: false,
    record: { reference: first.record.reference },
  });
  expect(() =>
    persistSubmission(db, { ...input, fingerprint: "changed" }),
  ).toThrow("IDEMPOTENCY_CONFLICT");
  expect(db.prepare("SELECT COUNT(*) n FROM outbox").get()!.n).toBe(2);
});
it("rolls back a file association failure and does not consume a reference", () => {
  const { db } = setup();
  const input = {
    requestId: "bad",
    fingerprint: "fp",
    type: "MEMBERSHIP",
    values: {},
  };
  expect(() =>
    persistSubmission(db, {
      ...input,
      files: [
        {
          id: "file",
          storage_key: "duplicate-key",
          kind: "receipt",
          mime: "application/pdf",
          size: 4,
          sha256: "hash",
        },
        {
          id: "file",
          storage_key: "duplicate-key",
          kind: "receipt",
          mime: "application/pdf",
          size: 4,
          sha256: "hash",
        },
      ],
    }),
  ).toThrow();
  expect(db.prepare("SELECT COUNT(*) n FROM submissions").get()!.n).toBe(0);
  expect(
    persistSubmission(db, { ...input, files: [] }).record.reference,
  ).toMatch(/\/1$/);
});
it("shares durable rate limits and expires windows without storing raw addresses", () => {
  const { db, storage } = setup();
  expect(consumeLimit(db, storage, "ip:192.0.2.1", 1, 1000, 100)).toBe(true);
  expect(consumeLimit(db, storage, "ip:192.0.2.1", 1, 1000, 200)).toBe(false);
  expect(consumeLimit(db, storage, "ip:192.0.2.1", 1, 1000, 1200)).toBe(true);
  expect(db.prepare("SELECT bucket FROM limits").get()!.bucket).not.toContain(
    "192.0.2",
  );
});
