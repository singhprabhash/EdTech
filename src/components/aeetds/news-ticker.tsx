"use client";

import Link from "next/link";
import { useState } from "react";
import { announcements } from "../../content/aeetds";
import { useSiteContent } from "./site-content";
import { Icon } from "./ui";

export default function NewsTicker() {
  const items = useSiteContent().ticker ?? announcements;
  const [paused, setPaused] = useState(false);
  return (
    <section
      aria-label="Announcements"
      className="aeetds-ticker bg-accent text-on-accent py-2"
      data-paused={paused}
    >
      <div className="aeetds-container flex items-center gap-3">
        <div className="aeetds-ticker-label flex shrink-0 items-center gap-2 rounded bg-primary px-3 py-2 text-[11px] font-bold tracking-wider text-white">
          <span
            className="h-2 w-2 rounded-full bg-tertiary-fixed-dim"
            aria-hidden="true"
          />
          WHAT&apos;S NEW
        </div>
        <div className="aeetds-ticker-window min-w-0 flex-1">
          <div className="aeetds-ticker-track">
            <ul className="aeetds-ticker-items">
              {items.map((item) => (
                <li key={item.text}>
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="inline-flex items-center gap-2 py-1 hover:text-primary-dark"
                  >
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${item.label === "REPORT" ? "bg-primary-container text-white" : "bg-secondary text-white"}`}
                    >
                      {item.label}
                    </span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul
              className="aeetds-ticker-items aeetds-ticker-copy"
              aria-hidden="true"
              inert
            >
              {items.map((item) => (
                <li key={item.text}>
                  <span className="inline-flex items-center gap-2 py-1">
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {item.label}
                    </span>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          className="aeetds-ticker-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded text-primary hover:bg-white"
          aria-label={paused ? "Play announcements" : "Pause announcements"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          <Icon
            name={paused ? "play_arrow" : "pause"}
            className="text-[18px]"
          />
        </button>
      </div>
    </section>
  );
}
