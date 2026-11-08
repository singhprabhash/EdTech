"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
export default function SubmitNavigation() {
  const path = usePathname();
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
      if (link.left < box.left || link.right > box.right)
        scroller.scrollLeft += link.left - box.left - 8;
    }
    exposeActive();
    document.fonts?.ready.then(exposeActive);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(exposeActive);
    if (track.current) observer?.observe(track.current);
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [path]);
  return (
    <nav
      aria-label="Submit and Register"
      className="resource-submit-navigation"
    >
      <div className="aeetds-container">
        <div ref={track} className="resource-submit-track">
          {[
            { label: "Submission Guidelines", href: "/submit/guidelines" },
            { label: "Registration & Payment", href: "/submit/registration" },
          ].map((item) => (
            <Link
              prefetch={false}
              key={item.href}
              href={item.href}
              aria-current={path === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
