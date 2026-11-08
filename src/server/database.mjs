import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
import { createHash, createHmac, randomUUID } from "node:crypto";
const pools = new Map();
export function database(storage) {
  if (!storage) throw new Error("Storage unavailable");
  if (pools.has(storage.directory)) return pools.get(storage.directory);
  fs.mkdirSync(storage.directory, { recursive: true, mode: 0o700 });
  if (fs.lstatSync(storage.directory).isSymbolicLink())
    throw new Error("Storage must not be a symlink");
  const actual = fs.realpathSync(storage.directory),
    project = fs.realpathSync(process.cwd());
  if (actual === project || actual.startsWith(project + path.sep))
    throw new Error("Storage must be outside the public application.");
  fs.chmodSync(storage.directory, 0o700);
  const filename = path.join(storage.directory, "aeetds.sqlite");
  const db = new DatabaseSync(filename);
  fs.chmodSync(filename, 0o600);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS counters(type TEXT NOT NULL, year INTEGER NOT NULL, serial INTEGER NOT NULL, PRIMARY KEY(type,year));
 CREATE TABLE IF NOT EXISTS submissions(id TEXT PRIMARY KEY,request_id TEXT NOT NULL UNIQUE,fingerprint TEXT NOT NULL,reference TEXT NOT NULL UNIQUE,type TEXT NOT NULL,values_json TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS files(id TEXT PRIMARY KEY,submission_id TEXT NOT NULL REFERENCES submissions(id),storage_key TEXT NOT NULL UNIQUE,kind TEXT NOT NULL,mime TEXT NOT NULL,size INTEGER NOT NULL,sha256 TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,submission_id TEXT NOT NULL REFERENCES submissions(id),kind TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,next_at INTEGER NOT NULL DEFAULT 0,lease_at INTEGER,last_code TEXT,lease_token TEXT,UNIQUE(submission_id,kind));
 CREATE TABLE IF NOT EXISTS limits(bucket TEXT PRIMARY KEY,started_at INTEGER NOT NULL,count INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS content(kind TEXT PRIMARY KEY,json TEXT NOT NULL,version INTEGER NOT NULL,updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS assets(id TEXT PRIMARY KEY,storage_key TEXT NOT NULL UNIQUE,mime TEXT NOT NULL,size INTEGER NOT NULL,sha256 TEXT NOT NULL,width INTEGER,height INTEGER);
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,event TEXT NOT NULL,created_at TEXT NOT NULL);`);
  if (
    !db
      .prepare("PRAGMA table_info(outbox)")
      .all()
      .some((column) => column.name === "lease_token")
  )
    db.exec("ALTER TABLE outbox ADD COLUMN lease_token TEXT");
  pools.set(storage.directory, db);
  return db;
}
export function closeDatabases() {
  for (const db of pools.values()) db.close();
  pools.clear();
}
export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const privateKey = (storage, value) =>
  createHmac("sha256", storage.secret).update(value).digest("hex");
export function priorSubmission(db, requestId) {
  return db
    .prepare("SELECT * FROM submissions WHERE request_id=?")
    .get(requestId);
}
/**
 * @param {import('node:sqlite').DatabaseSync} db
 * @param {{requestId:string,fingerprint:string,type:string,values:object,files?:Array<{id:string,storage_key:string,kind:string,mime:string,size:number,sha256:string}>,now?:Date}} input
 */
export function persistSubmission(db, input) {
  const {
    requestId,
    fingerprint,
    type,
    values,
    files = [],
    now = new Date(),
  } = input;
  db.exec("BEGIN IMMEDIATE");
  try {
    const previous = priorSubmission(db, requestId);
    if (previous) {
      if (previous.fingerprint !== fingerprint)
        throw new Error("IDEMPOTENCY_CONFLICT");
      db.exec("COMMIT");
      return { record: previous, created: false };
    }
    const year = now.getUTCFullYear();
    db.prepare(
      "INSERT INTO counters(type,year,serial) VALUES(?,?,1) ON CONFLICT(type,year) DO UPDATE SET serial=serial+1",
    ).run(type, year);
    const serial = db
      .prepare("SELECT serial FROM counters WHERE type=? AND year=?")
      .get(type, year).serial;
    const record = {
      id: randomUUID(),
      reference: `AEETDS/${type}/${year}/${serial}`,
      type,
      created_at: now.toISOString(),
      values_json: JSON.stringify(values),
    };
    db.prepare("INSERT INTO submissions VALUES(?,?,?,?,?,?,?)").run(
      record.id,
      requestId,
      fingerprint,
      record.reference,
      type,
      record.values_json,
      record.created_at,
    );
    for (const file of files)
      db.prepare("INSERT INTO files VALUES(?,?,?,?,?,?,?)").run(
        file.id,
        record.id,
        file.storage_key,
        file.kind,
        file.mime,
        file.size,
        file.sha256,
      );
    for (const kind of ["notification", "acknowledgement"])
      db.prepare("INSERT INTO outbox(id,submission_id,kind) VALUES(?,?,?)").run(
        randomUUID(),
        record.id,
        kind,
      );
    db.exec("COMMIT");
    return { record, created: true };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
export function consumeLimit(
  db,
  storage,
  key,
  maximum = 10,
  windowMs = 3600000,
  now = Date.now(),
) {
  const bucket = privateKey(storage, key);
  db.exec("BEGIN IMMEDIATE");
  try {
    const prior = db.prepare("SELECT * FROM limits WHERE bucket=?").get(bucket);
    const fresh = !prior || now - prior.started_at >= windowMs;
    const count = fresh ? 1 : prior.count + 1;
    db.prepare(
      "INSERT INTO limits VALUES(?,?,?) ON CONFLICT(bucket) DO UPDATE SET started_at=excluded.started_at,count=excluded.count",
    ).run(bucket, fresh ? now : prior.started_at, count);
    db.prepare("DELETE FROM limits WHERE started_at<?").run(now - 86400000);
    db.exec("COMMIT");
    return count <= maximum;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
