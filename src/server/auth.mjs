import { boundedRequest } from "./body.mjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { configuration, sameOrigin, clientAddress } from "./config.mjs";
import { database, consumeLimit, privateKey } from "./database.mjs";
export const COOKIE = "aeetds_admin";
const TTL = 8 * 60 * 60 * 1000;
export class AdminError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function hashPassword(password) {
  if (
    typeof password !== "string" ||
    password.length < 14 ||
    password.length > 256
  )
    throw new AdminError("Use a password of 14–256 characters.");
  const salt = randomBytes(16).toString("hex");
  return `scrypt$16384$8$1$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}
function validHash(value) {
  return /^scrypt\$16384\$8\$1\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(value);
}
export function adminConfigured(config = configuration()) {
  return Boolean(
    config.origin && config.storage && validHash(config.adminHash),
  );
}
function ready(config) {
  if (!adminConfigured(config))
    throw new AdminError("Administration is not configured.", 503);
}
function tokenKey(token, config) {
  return privateKey(config.storage, `session:${config.adminHash}:${token}`);
}
function cookie(token, config, maxAge = TTL / 1000) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${config.localHttp && config.origin?.startsWith("http://") ? "" : "; Secure"}`;
}
export function requireOrigin(request, config = configuration()) {
  if (!sameOrigin(request, config))
    throw new AdminError("Request origin is not permitted.", 403);
}
export function session(request, config = configuration(), now = Date.now()) {
  if (!adminConfigured(config)) return null;
  const tokens = (request.headers.get("cookie") || "")
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${COOKIE}=`));
  if (tokens.length !== 1) return null;
  const token = tokens[0].slice(COOKIE.length + 1);
  if (!/^[a-f0-9]{64}$/.test(token)) return null;
  const db = database(config.storage);
  const key = tokenKey(token, config);
  const record = db
    .prepare("SELECT expires_at FROM sessions WHERE token_hash=?")
    .get(key);
  if (!record || record.expires_at <= now) {
    db.prepare("DELETE FROM sessions WHERE token_hash=?").run(key);
    return null;
  }
  return { key, expiresAt: record.expires_at };
}
export function requireAdmin(request, config = configuration()) {
  ready(config);
  const current = session(request, config);
  if (!current) throw new AdminError("Sign in to continue.", 401);
  return current;
}
export function login(
  request,
  password,
  config = configuration(),
  now = Date.now(),
) {
  ready(config);
  requireOrigin(request, config);
  const db = database(config.storage);
  const personal = consumeLimit(
    db,
    config.storage,
    `admin-login:${clientAddress(request, config)}`,
    5,
    900000,
    now,
  );
  const global = consumeLimit(
    db,
    config.storage,
    "admin-login:global",
    30,
    900000,
    now,
  );
  if (!personal || !global)
    throw new AdminError(
      "Too many sign-in attempts. Try again after 15 minutes.",
      429,
    );
  const parts = config.adminHash.split("$");
  const input =
    typeof password === "string" && password.length <= 256 ? password : "";
  const result = scryptSync(input, parts[4], 64);
  if (!timingSafeEqual(result, Buffer.from(parts[5], "hex")))
    throw new AdminError("Sign-in details are incorrect.", 401);
  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessions WHERE expires_at<=?").run(now);
  db.prepare("INSERT INTO sessions VALUES(?,?)").run(
    tokenKey(token, config),
    now + TTL,
  );
  db.prepare("INSERT INTO audit(event,created_at) VALUES(?,?)").run(
    "admin.login",
    new Date(now).toISOString(),
  );
  return cookie(token, config);
}
export function logout(request, config = configuration()) {
  requireOrigin(request, config);
  const current = requireAdmin(request, config);
  database(config.storage)
    .prepare("DELETE FROM sessions WHERE token_hash=?")
    .run(current.key);
  return cookie("", config, 0);
}
export function adminResponse(body, status = 200, extra = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
      ...extra,
    },
  });
}
export async function boundedJSON(request, maximum = 200000) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new AdminError("JSON content is required.", 415);
  try {
    const bounded = await boundedRequest(request, maximum);
    return await bounded.json();
  } catch {
    throw new AdminError(
      "The request is invalid, too large or took too long.",
      413,
    );
  }
}
