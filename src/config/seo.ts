import type { Metadata } from "next";

export const homeTitle =
  "AEETDS Lucknow | Agriculture, Entrepreneur, Environment & Technology Development Society";
export const homeDescription =
  "National scientific society for agriculture, entrepreneurship and environment. Conferences, awards, membership and publications.";

// Only approved, implemented Society content can become indexable. Legacy
// catalogue samples and submission/acknowledgement/private routes stay excluded.
export const publicSocietyRoutes = [
  "/",
  "/about",
  "/about/vision-mission",
  "/about/governance",
  "/about/partners",
  "/membership",
  "/events",
  "/events/crafns-2026",
  "/events/ncfahs-2026",
  "/events/fstat-2025",
  "/events/iacrsaegns-2024",
  "/events/trainings-workshops",
  "/awards",
  "/publications",
  "/submit/guidelines",
  "/contact",
  "/contact/faqs",
  "/policies",
  "/downloads",
] as const;

type SeoEnvironment = Record<string, string | undefined>;

export function seoConfiguration(env: SeoEnvironment = process.env) {
  let origin: URL | undefined;
  let local = false;
  try {
    const candidate = new URL(env.AEETDS_SITE_URL ?? "");
    local = ["localhost", "127.0.0.1", "[::1]"].includes(candidate.hostname);
    const transport =
      candidate.protocol === "https:" ||
      (candidate.protocol === "http:" &&
        local &&
        env.AEETDS_ALLOW_LOCAL_HTTP === "true");
    if (
      transport &&
      !candidate.username &&
      !candidate.password &&
      candidate.pathname === "/" &&
      !candidate.search &&
      !candidate.hash
    ) {
      origin = new URL(candidate.origin);
    }
  } catch {
    // Missing or malformed configuration fails closed: never guess a domain.
  }
  return {
    origin,
    publicRelease:
      env.AEETDS_PUBLIC_RELEASE === "true" &&
      origin?.protocol === "https:" &&
      !local,
  };
}

export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const { origin, publicRelease } = seoConfiguration();
  const index =
    publicRelease && publicSocietyRoutes.some((route) => route === path);
  const canonical = origin ? new URL(path, origin).href : undefined;
  return {
    title,
    description,
    robots: { index, follow: index },
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "AEETDS",
      locale: "en_IN",
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: { card: "summary", title, description },
  };
}

export const rootMetadata: Metadata = {
  ...pageMetadata("/", homeTitle, homeDescription),
  ...(seoConfiguration().origin
    ? { metadataBase: seoConfiguration().origin }
    : {}),
};
