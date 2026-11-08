export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { seoConfiguration } from "../config/seo";

export default function robots(): MetadataRoute.Robots {
  const { origin, publicRelease } = seoConfiguration();
  if (publicRelease && origin) {
    return {
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/membership/apply",
          "/membership/acknowledgement",
          "/submit/registration",
          "/books",
          "/subjects",
          "/publish-with-us",
        ],
      },
      sitemap: new URL("/sitemap.xml", origin).href,
    };
  }
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
      // Exact HTML exception requested for this canonical-content route.
      // Preview no-index metadata remains in place until site release.
      allow: [
        "/about/vision-mission$",
        "/_next/static/",
        "/_next/image",
        "/fonts/",
        "/aeetds/",
        "/reference-assets/material-symbols-outlined.woff2",
      ],
    },
  };
}
