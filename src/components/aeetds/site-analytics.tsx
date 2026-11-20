"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { publicPageview } from "../../domain/analytics";

export default function SiteAnalytics({ paths }: { paths: readonly string[] }) {
  const publicPaths = new Set(paths);
  const pathname = usePathname();
  if (!pathname || !publicPaths.has(pathname)) return null;
  return (
    <Analytics
      beforeSend={(event) => publicPageview(event, publicPaths)}
      debug={false}
    />
  );
}
