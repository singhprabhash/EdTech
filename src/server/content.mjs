import fs from "node:fs";
import path from "node:path";
import { configuration } from "./config.mjs";
import { database } from "./database.mjs";
import { AdminError } from "./auth.mjs";
export const contentFields = {
  ticker: ["label", "text", "href"],
  events: [
    "slug",
    "shortName",
    "title",
    "subtitle",
    "category",
    "status",
    "dates",
    "startDate",
    "endDate",
    "venue",
    "shortVenue",
    "mode",
    "host",
    "organiser",
    "overview",
  ],
  downloads: ["title", "description", "href"],
  gallery: ["eventSlug", "src", "alt", "caption", "width", "height"],
  awardees: ["year", "groupId", "award", "name", "institution"],
};
const eventSlugs = [
  "crafns-2026",
  "ncfahs-2026",
  "fstat-2025",
  "iacrsaegns-2024",
];
const optional = new Set(["subtitle", "startDate", "endDate", "description"]);
const awardGroups = new Set([
  "lifetime",
  "research",
  "discipline",
  "extension",
  "young",
  "students",
  "women",
  "environment",
]);
const publicRoutes = new Set([
  "/",
  "/about",
  "/about/governance",
  "/about/partners",
  "/about/vision-mission",
  "/membership",
  "/membership/apply",
  "/events",
  ...eventSlugs.map((slug) => `/events/${slug}`),
  "/events/trainings-workshops",
  "/awards",
  "/publications",
  "/submit",
  "/submit/guidelines",
  "/submit/registration",
  "/contact",
  "/contact/faqs",
  "/policies",
  "/books",
  "/subjects",
  "/publish-with-us",
  "/downloads",
]);
const approvedPhones = new Set([
  "918009529170",
  "917408206291",
  "919198666776",
  "8009529170",
  "7408206291",
  "9198666776",
  "917042360966",
  "7042360966",
]);
function text(value, field) {
  if (
    typeof value !== "string" ||
    value.length > (field === "overview" ? 6000 : 1500) ||
    (!optional.has(field) && !value.trim()) ||
    /[<>\u0000-\u0008\u000b-\u001f]/.test(value)
  )
    throw new AdminError(`Invalid ${field}.`);
  for (const address of value.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi) || [])
    if (address.toLowerCase() !== "secretaryaeetds@gmail.com")
      throw new AdminError("Only the Society email may be published.");
  for (const phone of value.match(/(?:\+?\d[\d ()-]{8,}\d)/g) || []) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length >= 10 && !approvedPhones.has(digits))
      throw new AdminError("Only Society phone numbers may be published.");
  }
  return value.trim();
}
function link(value, assetOnly, config) {
  if (
    !/^\/(?!\/)[A-Za-z0-9/_.,-]*(?:#[A-Za-z0-9_-]+)?$/.test(value) ||
    value.includes("..") ||
    value.startsWith("/api/") ||
    value.startsWith("/admin")
  )
    throw new AdminError("Use a safe local public link.");
  if (value.startsWith("/media/")) {
    const id = value.slice(7);
    const asset =
      config.storage &&
      database(config.storage)
        .prepare("SELECT mime FROM assets WHERE id=?")
        .get(id);
    if (!asset || (assetOnly && !asset.mime.startsWith("image/")))
      throw new AdminError("Choose an uploaded public asset.");
  } else if (assetOnly || /\.(pdf|docx|png|jpe?g)$/i.test(value)) {
    const filename = path.join(process.cwd(), "public", value);
    if (
      !value.startsWith("/aeetds/") ||
      !fs.existsSync(filename) ||
      !fs.statSync(filename).isFile()
    )
      throw new AdminError("Choose an approved local asset.");
  } else if (!publicRoutes.has(value.split("#")[0]))
    throw new AdminError("Choose an existing public page.");
  return value;
}
export function validateContent(kind, items, config = configuration()) {
  const fields = contentFields[kind];
  if (
    !Object.hasOwn(contentFields, kind) ||
    !Array.isArray(items) ||
    (kind === "events" && items.length !== 4) ||
    items.length > (kind === "events" ? 4 : 100)
  )
    throw new AdminError("Invalid content collection.");
  const seen = new Set();
  return items.map((item) => {
    if (
      !item ||
      typeof item !== "object" ||
      Array.isArray(item) ||
      Object.keys(item).some((key) => !fields.includes(key))
    )
      throw new AdminError("Unexpected content fields.");
    const clean = {};
    for (const field of fields) {
      if (
        optional.has(field) &&
        (item[field] === undefined || item[field] === "")
      ) {
        clean[field] = "";
        continue;
      }
      if (field === "width" || field === "height") {
        if (
          !Number.isInteger(item[field]) ||
          item[field] < 1 ||
          item[field] > 15000
        )
          throw new AdminError("Invalid image dimensions.");
        clean[field] = item[field];
      } else clean[field] = text(item[field], field);
    }
    if (kind === "ticker" || kind === "downloads")
      clean.href = link(clean.href, false, config);
    if (kind === "events") {
      if (!eventSlugs.includes(clean.slug) || seen.has(clean.slug))
        throw new AdminError("Choose a unique existing conference.");
      seen.add(clean.slug);
      if (
        !["national", "international"].includes(clean.category) ||
        !["upcoming", "completed"].includes(clean.status)
      )
        throw new AdminError("Invalid conference category or status.");
      for (const field of ["startDate", "endDate"])
        if (
          clean[field] &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(clean[field]) ||
            Number.isNaN(Date.parse(clean[field])) ||
            new Date(clean[field]).toISOString().slice(0, 10) !== clean[field])
        )
          throw new AdminError("Use ISO conference dates.");
      if (clean.startDate && clean.endDate && clean.startDate > clean.endDate)
        throw new AdminError("Conference end date must follow its start date.");
    }
    if (kind === "gallery") {
      if (!eventSlugs.includes(clean.eventSlug))
        throw new AdminError("Choose an existing conference.");
      clean.src = link(clean.src, true, config);
    }
    if (
      kind === "awardees" &&
      (!/^20\d{2}$/.test(clean.year) || !awardGroups.has(clean.groupId))
    )
      throw new AdminError("Invalid award year or group.");
    return clean;
  });
}
export function getContent(kind, defaults = [], config = configuration()) {
  if (!contentFields[kind]) throw new AdminError("Unknown collection.", 404);
  if (!config.storage) return { items: defaults, version: 0 };
  const row = database(config.storage)
    .prepare("SELECT json,version FROM content WHERE kind=?")
    .get(kind);
  if (!row) return { items: defaults, version: 0 };
  return {
    items: validateContent(kind, JSON.parse(row.json), config),
    version: row.version,
  };
}
export function getPublicContent(defaults, config = configuration()) {
  return Object.fromEntries(
    Object.keys(contentFields).map((kind) => [
      kind,
      getContent(kind, defaults[kind] || [], config).items,
    ]),
  );
}
export function saveContent(kind, items, version, config = configuration()) {
  if (!config.storage) throw new AdminError("Storage unavailable.", 503);
  if (!Number.isSafeInteger(version) || version < 0)
    throw new AdminError("Invalid content version.");
  const clean = validateContent(kind, items, config),
    db = database(config.storage);
  db.exec("BEGIN IMMEDIATE");
  try {
    const prior = db
      .prepare("SELECT version FROM content WHERE kind=?")
      .get(kind);
    if ((prior?.version || 0) !== version)
      throw new AdminError(
        "This collection changed. Reload before saving.",
        409,
      );
    db.prepare(
      "INSERT INTO content VALUES(?,?,?,?) ON CONFLICT(kind) DO UPDATE SET json=excluded.json,version=excluded.version,updated_at=excluded.updated_at",
    ).run(kind, JSON.stringify(clean), version + 1, new Date().toISOString());
    db.prepare("INSERT INTO audit(event,created_at) VALUES(?,?)").run(
      `content.save:${kind}:v${version + 1}`,
      new Date().toISOString(),
    );
    db.exec("COMMIT");
    return { items: clean, version: version + 1 };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
export function publishedAsset(id, config = configuration()) {
  if (!config.storage || !/^[a-f0-9-]{36}$/.test(id)) return null;
  const db = database(config.storage);
  const referenced = db
    .prepare("SELECT kind,json FROM content")
    .all()
    .some((row) => {
      try {
        return validateContent(row.kind, JSON.parse(row.json), config).some(
          (item) => item.src === `/media/${id}` || item.href === `/media/${id}`,
        );
      } catch {
        return false;
      }
    });
  return referenced
    ? db.prepare("SELECT * FROM assets WHERE id=?").get(id)
    : null;
}
