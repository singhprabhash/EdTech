"use client";
import Link from "next/link";
import { useSiteContent } from "../site-content";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { calendarConferences } from "../../../content/aeetds-events";
import {
  calendarCells,
  calendarDate,
  conferencesOnDate,
  shiftMonth,
  type CalendarMonth,
} from "../../../domain/event-calendar";
import { Eyebrow, Icon } from "../ui";
const week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function monthLabel(month: CalendarMonth) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(month.year, month.month, 1)));
}
export default function EventCalendar() {
  const live = useSiteContent().events;
  const events = live?.length
    ? live.map((item) => ({
        ...item,
        slug: item.slug!,
        shortName: item.shortName!,
        title: item.title!,
        dates: item.dates!,
        shortVenue: item.shortVenue!,
        startDate: item.startDate,
        endDate: item.endDate,
      }))
    : calendarConferences;
  const [month, setMonth] = useState<CalendarMonth>({ year: 2026, month: 6 });
  const [selected, setSelected] = useState("2026-07-15");
  const focusRequested = useRef(false);
  const buttons = useRef<Record<number, HTMLButtonElement | null>>({});
  const cells = calendarCells(month);
  const inMonth = selected.startsWith(calendarDate(month, 1).slice(0, 7));
  const tabDay = inMonth ? Number(selected.slice(-2)) : 1;
  const matches = conferencesOnDate(selected, events);
  useEffect(() => {
    if (focusRequested.current) {
      buttons.current[Number(selected.slice(-2))]?.focus();
      focusRequested.current = false;
    }
  }, [selected, month]);
  function navigate(offset: number) {
    const next = shiftMonth(month, offset);
    setMonth(next);
    setSelected(calendarDate(next, 1));
  }
  function dayKey(event: KeyboardEvent<HTMLButtonElement>, day: number) {
    const offsets: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    const date = new Date(
      Date.UTC(month.year, month.month, day + offsets[event.key]),
    );
    focusRequested.current = true;
    setMonth({ year: date.getUTCFullYear(), month: date.getUTCMonth() });
    setSelected(date.toISOString().slice(0, 10));
  }
  return (
    <section
      className="events-section bg-white"
      aria-labelledby="event-calendar-title"
    >
      <div className="aeetds-container">
        <div className="mb-6">
          <Eyebrow>ACADEMIC ENGAGEMENTS</Eyebrow>
          <h2 id="event-calendar-title" className="events-heading">
            Academic Calendar &amp; Schedule
          </h2>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="events-calendar lg:col-span-7">
            <div className="events-calendar-header">
              <button
                type="button"
                aria-label="Previous month"
                className="events-calendar-control"
                onClick={() => navigate(-1)}
              >
                <Icon name="chevron_left" />
              </button>
              <h3
                aria-live="polite"
                className="font-headline-sm text-headline-sm"
              >
                {monthLabel(month)}
              </h3>
              <button
                type="button"
                aria-label="Next month"
                className="events-calendar-control"
                onClick={() => navigate(1)}
              >
                <Icon name="chevron_right" />
              </button>
            </div>
            <table
              aria-label={`${monthLabel(month)} calendar`}
              className="events-calendar-table"
            >
              <thead>
                <tr>
                  {week.map((day) => (
                    <th key={day} scope="col" abbr={day}>
                      <span aria-hidden="true">{day.slice(0, 3)}</span>
                      <span className="sr-only">{day}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: cells.length / 7 }, (_, row) => (
                  <tr key={row}>
                    {cells.slice(row * 7, row * 7 + 7).map((day, column) => (
                      <td key={column}>
                        {day && (
                          <button
                            type="button"
                            ref={(element) => {
                              buttons.current[day] = element;
                            }}
                            tabIndex={day === tabDay ? 0 : -1}
                            aria-pressed={calendarDate(month, day) === selected}
                            aria-label={`${day} ${monthLabel(month)}${conferencesOnDate(calendarDate(month, day), events).length ? " — confirmed conference" : ""}`}
                            onClick={() =>
                              setSelected(calendarDate(month, day))
                            }
                            onKeyDown={(event) => dayKey(event, day)}
                          >
                            {day}
                            {conferencesOnDate(calendarDate(month, day), events)
                              .length > 0 && (
                              <span
                                className="events-date-marker"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="events-calendar-note">
              <span className="events-date-dot" aria-hidden="true" />
              Confirmed conference dates only. Starts with the latest confirmed
              conference month.
            </p>
          </div>
          <aside
            className="events-calendar-details lg:col-span-5"
            aria-labelledby="selected-event-date"
          >
            <h3
              id="selected-event-date"
              className="mb-4 font-headline-sm text-headline-sm"
            >
              {new Intl.DateTimeFormat("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(`${selected}T00:00:00Z`))}
            </h3>
            <div aria-live="polite">
              {matches.length ? (
                matches.map((item) => (
                  <article key={item.slug} className="events-calendar-event">
                    <p className="mb-2 text-label-md text-secondary">
                      CONFIRMED CONFERENCE · {item.shortName}
                    </p>
                    <h4 className="mb-3 text-title-sm">{item.title}</h4>
                    <p className="text-body-sm text-on-surface-variant">
                      {item.dates} · {item.shortVenue}
                    </p>
                    <Link
                      prefetch={false}
                      href={`/events/${item.slug}`}
                      className="events-inline-link mt-3"
                    >
                      View Conference Details
                      <Icon name="arrow_forward" className="text-[18px]" />
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-on-surface-variant">
                  No confirmed conference is listed for this date.
                </p>
              )}
            </div>
            <div className="events-calendar-undated">
              <Eyebrow>CRAFNS-2026</Eyebrow>
              <h3 className="mb-2 text-title-sm">Dates to be announced</h3>
              <p className="text-body-sm text-on-surface-variant">
                The upcoming conference has no confirmed dates, so it is not
                placed on the calendar.
              </p>
              <Link
                prefetch={false}
                href="/events/crafns-2026"
                className="events-inline-link mt-3"
              >
                Upcoming Conference
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
