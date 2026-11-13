import { afterEach, describe, expect, it, vi } from "vitest";
import {
  homeTitle,
  pageMetadata,
  publicSocietyRoutes,
  seoConfiguration,
} from "../../src/config/seo";
import robots from "../../src/app/robots";
import sitemap from "../../src/app/sitemap";
import {
  crafnsConference,
  pastConferences,
} from "../../src/content/aeetds-events";
import {
  eventSchema,
  organizationSchema,
  serializeStructuredData,
} from "../../src/components/aeetds/seo/structured-data";

afterEach(() => vi.unstubAllEnvs());
function release() {
  vi.stubEnv("AEETDS_SITE_URL", "https://www.aeetds.com");
  vi.stubEnv("AEETDS_PUBLIC_RELEASE", "true");
}
describe("Society SEO publication boundary", () => {
  it("rejects malformed, credentialed and non-origin site URLs", () => {
    for (const url of [
      "",
      "https://",
      "http://www.aeetds.com",
      "https://user:secret@www.aeetds.com",
      "https://www.aeetds.com/staging",
      "https://www.aeetds.com/?preview=1",
      "javascript:alert(1)",
    ]) {
      expect(
        seoConfiguration({
          AEETDS_SITE_URL: url,
          AEETDS_PUBLIC_RELEASE: "true",
        }).origin,
      ).toBeUndefined();
    }
  });
  it("allows explicitly opted-in local HTTP for tests without publishing", () => {
    expect(
      seoConfiguration({ AEETDS_SITE_URL: "http://localhost:3000" }).origin,
    ).toBeUndefined();
    const local = seoConfiguration({
      AEETDS_SITE_URL: "http://localhost:3000",
      AEETDS_ALLOW_LOCAL_HTTP: "true",
      AEETDS_PUBLIC_RELEASE: "true",
    });
    expect(local.origin?.href).toBe("http://localhost:3000/");
    expect(local.publicRelease).toBe(false);
    expect(
      seoConfiguration({
        AEETDS_SITE_URL: "https://localhost",
        AEETDS_PUBLIC_RELEASE: "true",
      }).publicRelease,
    ).toBe(false);
  });
  it("retains preview robots behavior and an empty sitemap by default", () => {
    vi.stubEnv("AEETDS_SITE_URL", "");
    vi.stubEnv("AEETDS_PUBLIC_RELEASE", "false");
    expect(pageMetadata("/", homeTitle, "Description").robots).toEqual({
      index: false,
      follow: false,
    });
    expect(sitemap()).toEqual([]);
    expect(robots().rules).toMatchObject({
      disallow: "/",
      allow: expect.arrayContaining([
        "/about/vision-mission$",
        "/_next/static/",
      ]),
    });
  });
  it("requires explicit release and includes only implemented approved content", () => {
    release();
    for (const path of publicSocietyRoutes) {
      const metadata = pageMetadata(
        path,
        `Title ${path}`,
        `Description ${path}`,
      );
      expect(metadata.robots).toEqual({ index: true, follow: true });
      expect(metadata.alternates?.canonical).toBe(
        new URL(path, "https://www.aeetds.com").href,
      );
      expect(metadata.openGraph).toMatchObject({
        title: `Title ${path}`,
        description: `Description ${path}`,
      });
      expect(metadata.twitter).toMatchObject({
        card: "summary",
        title: `Title ${path}`,
      });
    }
    for (const path of [
      "/books",
      "/books/sample",
      "/subjects",
      "/publish-with-us",
      "/membership/apply",
      "/membership/acknowledgement",
      "/submit/registration",
      "/admin",
      "/api/submissions",
    ]) {
      expect(pageMetadata(path, "Private", "Excluded").robots).toEqual({
        index: false,
        follow: false,
      });
      expect(sitemap().some((entry) => entry.url.endsWith(path))).toBe(false);
    }
    expect(sitemap()).toHaveLength(publicSocietyRoutes.length);
    expect(robots().sitemap).toBe("https://www.aeetds.com/sitemap.xml");
  });
  it("does not publish without a valid origin despite a release flag", () => {
    vi.stubEnv("AEETDS_PUBLIC_RELEASE", "true");
    vi.stubEnv("AEETDS_SITE_URL", "http://www.aeetds.com");
    expect(sitemap()).toEqual([]);
  });
});
describe("verified Society structured data", () => {
  it("includes four official phones and no invented address", () => {
    expect(organizationSchema()).toMatchObject({
      "@type": "Organization",
      email: "secretaryaeetds@gmail.com",
    });
    expect(organizationSchema().telephone).toHaveLength(4);
    expect(organizationSchema()).not.toHaveProperty("address");
  });
  it("uses canonical dates and venue for conferences with confirmed dates", () => {
    for (const conference of [...pastConferences, crafnsConference]) {
      expect(eventSchema(conference)).toMatchObject({
        "@type": "Event",
        startDate: conference.startDate,
        endDate: conference.endDate,
        location: { name: conference.venue },
      });
      expect(eventSchema(conference)).not.toHaveProperty("offers");
    }
    expect(
      eventSchema({ ...crafnsConference, startDate: undefined }),
    ).toBeNull();
  });
  it("escapes script breakout sequences without changing JSON values", () => {
    const data = { name: "</script><script>alert(1)</script>&" };
    const json = serializeStructuredData(data);
    expect(json).not.toContain("<");
    expect(JSON.parse(json)).toEqual(data);
  });
});
