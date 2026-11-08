export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { publicSocietyRoutes, seoConfiguration } from "../config/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const { origin, publicRelease } = seoConfiguration();
  if (!publicRelease || !origin) return [];
  return publicSocietyRoutes.map((path) => ({
    url: new URL(path, origin).href,
  }));
}
