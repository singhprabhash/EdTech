import type { BeforeSendEvent } from "@vercel/analytics/next";

export function publicPageview(
  event: BeforeSendEvent,
  publicPaths: ReadonlySet<string>,
): BeforeSendEvent | null {
  if (event.type !== "pageview") return null;
  try {
    const url = new URL(event.url);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      !publicPaths.has(url.pathname)
    )
      return null;
    url.search = "";
    url.hash = "";
    return { type: "pageview", url: url.href };
  } catch {
    return null;
  }
}
