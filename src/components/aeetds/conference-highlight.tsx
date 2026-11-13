import BrochureDownload from "./events/brochure-download";
import { conference } from "../../content/aeetds";
import { Action, Icon } from "./ui";

export default function ConferenceHighlight() {
  return (
    <section
      id="upcoming-conference"
      className="aeetds-section bg-surface-container-low"
      aria-labelledby="conference-title"
    >
      <div className="aeetds-container">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-md sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-primary via-secondary to-tertiary-fixed-dim"
          />
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:gap-12">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="inline-flex items-center gap-2 self-start rounded bg-surface-container px-3 py-2 text-label-md font-semibold text-secondary">
                <Icon name="podium" className="shrink-0 text-[16px]" />
                <span>FEATURED EVENT • HYBRID MODE (OFFLINE &amp; ONLINE)</span>
              </div>
              <h2
                id="conference-title"
                className="font-headline-md text-headline-md text-primary"
              >
                {conference.title}
              </h2>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {conference.description}
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                {[
                  { icon: "psychology_alt", label: "Peer-Reviewed Papers" },
                  { icon: "public", label: "International Keynotes" },
                  { icon: "menu_book", label: "ISBN Proceedings" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2.5 rounded bg-surface-container-low p-3"
                  >
                    <Icon
                      name={item.icon}
                      className="shrink-0 text-[20px] text-secondary"
                    />
                    <span className="text-body-sm font-semibold">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Programme areas; review, keynote and proceedings details are
                subject to the official conference notice.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <BrochureDownload />
                <Action href="/events" tone="navy" icon="article">
                  View Details
                </Action>
                <Action href="/submit/registration" icon="how_to_reg">
                  Register Now
                </Action>
                <Action href="/submit/abstract" tone="light" icon="upload_file">
                  Submit Abstract
                </Action>
              </div>
            </div>
            <aside
              aria-label="Conference schedule"
              className="flex w-full shrink-0 flex-col gap-5 rounded-xl bg-surface-container p-6 shadow-sm lg:w-80 xl:w-96"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-title-sm font-semibold text-primary">
                  Session Logistics
                </h3>
                <span className="rounded bg-tertiary-fixed px-2 py-1 text-[11px] font-bold text-on-tertiary-fixed">
                  HYBRID
                </span>
              </div>
              <div className="rounded bg-white p-4 text-center">
                <p className="font-label-mono-isbn text-[11px] tracking-wider text-secondary">
                  Conference Dates
                </p>
                <p className="mt-2 font-headline-sm text-headline-sm text-primary">
                  {conference.dates}
                </p>
              </div>
              <div className="rounded bg-white p-4">
                <p className="font-label-mono-isbn text-[11px] tracking-wider text-secondary">
                  Venue
                </p>
                <p className="mt-2 text-body-sm leading-relaxed text-on-surface">
                  {conference.venue}
                </p>
              </div>
              <p className="flex items-start gap-2 rounded bg-surface-container-high p-3 text-body-sm text-on-surface-variant">
                <Icon
                  name="info"
                  className="mt-0.5 shrink-0 text-[18px] text-secondary"
                />
                Contact the Society Secretariat for the latest schedule and
                registration information.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
