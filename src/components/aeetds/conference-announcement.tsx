"use client";

import Link from "next/link";
import { useState } from "react";
import { crafnsConference, crafnsForms } from "../../content/aeetds-events";

export default function ConferenceAnnouncement() {
  const [paused, setPaused] = useState(false);
  const message = `Announcement & Registration: 3rd Conference (${crafnsConference.shortName}) — ${crafnsConference.dates} · ${crafnsConference.shortVenue} · Register now`;
  return (
    <section
      aria-label="Conference registration announcement"
      className="aeetds-ticker aeetds-conference-announcement py-1"
      data-paused={paused}
    >
      <div className="aeetds-container flex items-center gap-3">
        <div className="aeetds-ticker-window min-w-0 flex-1">
          <div className="aeetds-ticker-track">
            <div className="aeetds-ticker-items">
              <Link
                prefetch={false}
                href={crafnsForms.registration}
                className="inline-flex min-h-11 items-center py-1 hover:underline"
              >
                {message}
              </Link>
            </div>
            <div
              className="aeetds-ticker-items aeetds-ticker-copy"
              aria-hidden="true"
              inert
            >
              <span className="inline-flex min-h-11 items-center py-1">
                {message}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="aeetds-ticker-toggle sr-only focus:not-sr-only focus:relative focus:h-11 focus:shrink-0 focus:px-2"
          aria-label={
            paused
              ? "Play conference announcement"
              : "Pause conference announcement"
          }
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}
