"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Conference, EventPhoto } from "../../content/aeetds-events";
import type { Awardee } from "../../content/aeetds-awards";
export type DownloadRecord = {
  title: string;
  description: string;
  href: string;
};
export type SiteContent = {
  ticker: readonly { label: string; text: string; href: string }[];
  events: readonly Partial<Conference>[];
  downloads: readonly DownloadRecord[];
  gallery: readonly (EventPhoto & { eventSlug: string })[];
  awardees: readonly Awardee[];
};
const Context = createContext<Partial<SiteContent>>({});
export const useSiteContent = () => useContext(Context);
export function SiteContentProvider({
  initial,
  children,
}: {
  initial: SiteContent;
  children: ReactNode;
}) {
  const [content, setContent] = useState(initial);
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    function refresh() {
      fetch("/api/site-content", { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((value) => {
          if (
            !cancelled &&
            value &&
            ["ticker", "events", "downloads", "gallery", "awardees"].every(
              (key) => Array.isArray(value[key]),
            )
          )
            setContent(value);
        })
        .catch(() => {});
    }
    addEventListener("focus", refresh);
    refresh();
    return () => {
      cancelled = true;
      removeEventListener("focus", refresh);
    };
  }, [pathname]);
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
