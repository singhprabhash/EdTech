"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  aboutNavigation,
  type AboutPath,
} from "../../../content/aeetds-about-navigation";

export default function AboutSubNavigation({
  currentPath,
}: {
  currentPath: AboutPath;
}) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    function exposeActive() {
      if (cancelled) return;
      const scroller = track.current;
      const active = scroller?.querySelector<HTMLAnchorElement>(
        '[aria-current="page"]',
      );
      if (!scroller || !active) return;
      const box = scroller.getBoundingClientRect();
      const link = active.getBoundingClientRect();
      if (link.left < box.left || link.right > box.right) {
        scroller.scrollLeft += link.left - box.left - 8;
      }
    }
    exposeActive();
    document.fonts?.ready.then(exposeActive);
    const resize =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(exposeActive);
    if (track.current) resize?.observe(track.current);
    return () => {
      cancelled = true;
      resize?.disconnect();
    };
  }, [currentPath]);
  return (
    <nav
      aria-label="About section"
      className="about-subnavigation bg-white shadow-sm"
    >
      <div className="aeetds-container">
        <div ref={track} className="about-subnavigation-track">
          <ul className="flex w-max min-w-full items-center gap-1 py-2">
            {aboutNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  prefetch={false}
                  href={item.href}
                  aria-current={item.href === currentPath ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-title-sm transition-colors ${item.href === currentPath ? "bg-surface-container font-bold text-primary shadow-sm" : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"}`}
                >
                  {item.href === currentPath && (
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
