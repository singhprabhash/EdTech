// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { configuration } from "../../src/server/config.mjs";
import { database, closeDatabases } from "../../src/server/database.mjs";
import {
  hashPassword,
  login,
  logout,
  session,
  requireAdmin,
  boundedJSON,
} from "../../src/server/auth.mjs";
import {
  validateContent,
  saveContent,
  getContent,
  getPublicContent,
  publishedAsset,
} from "../../src/server/content.mjs";
import { GET, POST, PUT } from "../../src/app/api/admin/[...action]/route";
const directories: string[] = [];
const password = "a long unique test password";
const adminHash = hashPassword(password);
function config() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "aeetds-admin-"));
  directories.push(directory);
  return configuration({
    ...process.env,
    AEETDS_SITE_URL: "https://society.example",
    AEETDS_DATA_DIR: directory,
    AEETDS_APP_SECRET: "s".repeat(40),
    AEETDS_ADMIN_PASSWORD_HASH: adminHash,
  });
}
function request(origin = "https://society.example", cookie = "") {
  return new Request("https://society.example/api/admin/login", {
    method: "POST",
    headers: { origin, cookie },
  });
}
afterEach(() => {
  closeDatabases();
  for (const directory of directories.splice(0))
    fs.rmSync(directory, { recursive: true, force: true });
});
describe("durable administrator authorization", () => {
  it("rejects wrong credentials and origins, including absent Origin", () => {
    const c = config();
    expect(() => login(request("https://evil.example"), password, c)).toThrow(
      "origin",
    );
    expect(() =>
      login(new Request("https://society.example"), password, c),
    ).toThrow("origin");
    expect(() => login(request(), "wrong", c)).toThrow("incorrect");
    expect(() => requireAdmin(request(), c)).toThrow("Sign in");
    expect(() => login(request(), password, { ...c, adminHash: "" })).toThrow(
      "not configured",
    );
  });
  it("stores only opaque keyed sessions, expires them, rotates with credentials and logs out", () => {
    const c = config();
    const now = Date.now();
    const cookie = login(request(), password, c, now);
    const header = cookie.split(";")[0];
    expect(cookie).toContain("HttpOnly; SameSite=Strict");
    expect(cookie).toContain("Secure");
    expect(session(request(undefined, header), c, now)).toBeTruthy();
    const stored = database(c.storage)
      .prepare("SELECT token_hash FROM sessions")
      .get() as { token_hash: string };
    expect(header).not.toContain(stored.token_hash);
    expect(
      session(
        request(undefined, header),
        { ...c, adminHash: hashPassword("different long password") },
        now,
      ),
    ).toBeNull();
    expect(
      session(request(undefined, header), c, now + 8 * 3600000),
    ).toBeNull();
    const fresh = login(request(), password, c).split(";")[0];
    expect(() => logout(request("https://evil.example", fresh), c)).toThrow(
      "origin",
    );
    logout(request(undefined, fresh), c);
    expect(session(request(undefined, fresh), c)).toBeNull();
  });
  it("enforces durable per-address brute force limits", () => {
    const c = config();
    for (let i = 0; i < 5; i++)
      expect(() => login(request(), "wrong", c)).toThrow("incorrect");
    expect(() => login(request(), password, c)).toThrow("Too many");
    closeDatabases();
    expect(() => login(request(), password, c)).toThrow("Too many");
  });
  it("enforces a global ceiling even across trusted client addresses", () => {
    const c = { ...config(), trustProxy: true };
    for (let i = 0; i < 30; i++) {
      const r = request();
      r.headers.set("x-forwarded-for", `192.0.2.${i}`);
      expect(() => login(r, "wrong", c)).toThrow("incorrect");
    }
    const r = request();
    r.headers.set("x-forwarded-for", "192.0.2.200");
    expect(() => login(r, password, c)).toThrow("Too many");
  });
  it("bounds streamed JSON even when Content-Length is absent", async () => {
    const r = new Request("https://society.example", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ x: "x".repeat(100) }),
    });
    await expect(boundedJSON(r, 20)).rejects.toThrow("too large");
  });
});
describe("published content boundary", () => {
  it("rejects nonexistent pages, unknown award groups and impossible or reversed conference dates", () => {
    const c = config();
    expect(() =>
      validateContent(
        "ticker",
        [{ label: "NEW", text: "Approved", href: "/missing" }],
        c,
      ),
    ).toThrow("existing public");
    expect(() =>
      validateContent(
        "awardees",
        [
          {
            year: "2026",
            groupId: "unknown",
            award: "Approved",
            name: "Approved",
            institution: "Approved",
          },
        ],
        c,
      ),
    ).toThrow("group");
    const conference = {
      slug: "crafns-2026",
      shortName: "Approved",
      title: "Approved",
      category: "international",
      status: "upcoming",
      dates: "Approved",
      startDate: "2026-02-30",
      endDate: "",
      venue: "Approved",
      shortVenue: "Approved",
      mode: "Approved",
      host: "Approved",
      organiser: "Approved",
      overview: "Approved",
    };
    const conferenceSet = (first: typeof conference) => [
      first,
      ...["ncfahs-2026", "fstat-2025", "iacrsaegns-2024"].map((slug) => ({
        ...conference,
        slug,
        startDate: "",
        endDate: "",
      })),
    ];
    expect(() => validateContent("events", [], c)).toThrow("collection");
    expect(() =>
      validateContent("events", conferenceSet(conference), c),
    ).toThrow("ISO");
    expect(() =>
      validateContent(
        "events",
        conferenceSet({
          ...conference,
          startDate: "2026-03-01",
          endDate: "2026-02-28",
        }),
        c,
      ),
    ).toThrow("end date");
    expect(
      validateContent(
        "ticker",
        [{ label: "NEW", text: "Society +91-7042360966", href: "/contact" }],
        c,
      ),
    ).toHaveLength(1);
  });
  it("validates links, PII and schemas before publication", () => {
    const c = config();
    expect(() =>
      validateContent(
        "ticker",
        [{ label: "NEW", text: "Approved", href: "javascript:alert(1)" }],
        c,
      ),
    ).toThrow("local");
    expect(() =>
      validateContent(
        "ticker",
        [{ label: "NEW", text: "Write private@example.org", href: "/" }],
        c,
      ),
    ).toThrow("Society email");
    expect(() =>
      validateContent(
        "downloads",
        [
          {
            title: "Private file",
            description: "",
            href: "/api/admin/files/abc",
          },
        ],
        c,
      ),
    ).toThrow("local");
    expect(() =>
      validateContent(
        "gallery",
        [
          {
            eventSlug: "fstat-2025",
            src: "/aeetds/unknown.jpg",
            alt: "x",
            caption: "x",
            width: 1,
            height: 1,
          },
        ],
        c,
      ),
    ).toThrow("approved");
    expect(() =>
      validateContent(
        "awardees",
        [
          {
            year: "2026",
            groupId: "test",
            award: "A",
            name: "A",
            institution: "A",
            private: "hidden",
          },
        ],
        c,
      ),
    ).toThrow("Unexpected");
  });
  it("persists only valid published arrays with optimistic concurrency and canonical defaults", () => {
    const c = config();
    const ticker = [{ label: "NEW", text: "Approved", href: "/awards" }];
    expect(
      getPublicContent({ ticker }, { ...c, storage: null }).ticker,
    ).toEqual(ticker);
    expect(getContent("ticker", ticker, c)).toEqual({
      items: ticker,
      version: 0,
    });
    expect(saveContent("ticker", ticker, 0, c).version).toBe(1);
    expect(() => saveContent("ticker", [], 0, c)).toThrow("changed");
    expect(getContent("ticker", [], c).items).toEqual(ticker);
    expect(saveContent("ticker", [], 1, c)).toEqual({ items: [], version: 2 });
  });
  it("exposes uploaded assets only while referenced in validated published collections", () => {
    const c = config(),
      id = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    database(c.storage)
      .prepare(
        "INSERT INTO assets(id,storage_key,mime,size,sha256) VALUES(?,?,?,?,?)",
      )
      .run(id, `${id}.pdf`, "application/pdf", 100, "abc");
    expect(publishedAsset(id, c)).toBeNull();
    saveContent(
      "downloads",
      [{ title: "Approved", description: "", href: `/media/${id}` }],
      0,
      c,
    );
    expect(publishedAsset(id, c)?.id).toBe(id);
    saveContent("downloads", [], 1, c);
    expect(publishedAsset(id, c)).toBeNull();
  });
});
describe("admin HTTP authorization", () => {
  it("fails closed for every private endpoint and forbids unauthenticated mutations", async () => {
    const c = config();
    const old = { ...process.env };
    Object.assign(process.env, {
      AEETDS_SITE_URL: c.origin,
      AEETDS_DATA_DIR: c.storage!.directory,
      AEETDS_APP_SECRET: c.storage!.secret,
      AEETDS_ADMIN_PASSWORD_HASH: c.adminHash,
    });
    try {
      for (const action of [
        ["submissions"],
        ["submissions", "id"],
        ["files", "id"],
        ["content", "ticker"],
      ]) {
        const response = await GET(
          new Request("https://society.example/api/admin"),
          { params: Promise.resolve({ action }) },
        );
        expect(response.status).toBe(401);
        expect(response.headers.get("cache-control")).toBe("private, no-store");
      }
      const cookie = login(request(), password, c).split(";")[0];
      const response = await PUT(
        new Request("https://society.example/api/admin", {
          method: "PUT",
          headers: {
            cookie,
            origin: "https://evil.example",
            "content-type": "application/json",
          },
          body: JSON.stringify({ items: [], version: 0 }),
        }),
        { params: Promise.resolve({ action: ["content", "ticker"] }) },
      );
      expect(response.status).toBe(403);
      const logoutResponse = await POST(
        new Request("https://society.example/api/admin", {
          method: "POST",
          headers: { cookie, origin: "https://society.example" },
        }),
        { params: Promise.resolve({ action: ["logout"] }) },
      );
      expect(logoutResponse.status).toBe(200);
    } finally {
      for (const key of Object.keys(process.env))
        if (!(key in old)) delete process.env[key];
      Object.assign(process.env, old);
    }
  });
});
