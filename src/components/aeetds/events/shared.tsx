import Link from "next/link";
import type { Conference, EventTheme } from "../../../content/aeetds-events";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
import EventImage from "./event-image";
export function EventMetadata({
  conference,
  compact = false,
}: {
  conference: Conference;
  compact?: boolean;
}) {
  const fields = [
    { label: "Dates", icon: "calendar_month", value: conference.dates },
    {
      label: "Venue",
      icon: "location_on",
      value: compact ? conference.shortVenue : conference.venue,
    },
    { label: "Mode", icon: "connected_tv", value: conference.mode },
    ...(!compact
      ? [
          {
            label: "Host institution",
            icon: "account_balance",
            value: conference.host,
          },
        ]
      : []),
  ];
  return (
    <dl
      className={`events-metadata ${compact ? "events-metadata-compact" : ""}`}
    >
      {fields.map((field) => (
        <div key={field.label}>
          <dt>
            <Icon
              name={field.icon}
              className="shrink-0 text-[18px] text-secondary"
            />
            <span>{field.label}</span>
          </dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
export function ThemeGrid({
  themes,
  title,
  eyebrow = "SCIENTIFIC PROGRAMME",
  suggested = false,
}: {
  themes: readonly EventTheme[];
  title: string;
  eyebrow?: string;
  suggested?: boolean;
}) {
  return (
    <section
      className="events-section bg-background"
      aria-labelledby="event-themes-title"
    >
      <div className="aeetds-container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id="event-themes-title" className="events-heading mb-4">
          {title}
        </h2>
        {suggested && (
          <p className="mb-6 max-w-3xl text-on-surface-variant">
            Suggested themes from the Society&apos;s conference outline. Final
            sub-themes and programme details are to be announced.
          </p>
        )}
        <ul className="events-theme-grid">
          {themes.map((theme, index) => (
            <li key={theme.title} className="events-theme-card">
              <div className="mb-4 flex items-start justify-between gap-3">
                <span className="events-icon">
                  <Icon name={theme.icon} />
                </span>
                <span className="font-label-mono-isbn text-[11px] text-on-surface-variant">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">
                {theme.title}
              </h3>
              {theme.description && (
                <p className="mt-3 text-body-sm leading-relaxed text-on-surface-variant">
                  {theme.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export function ArchiveCard({ conference }: { conference: Conference }) {
  return (
    <li className="events-archive-card">
      <Link
        prefetch={false}
        href={`/events/${conference.slug}`}
        aria-label={`View ${conference.shortName} conference details`}
        className="events-archive-image-link"
      >
        <EventImage photo={conference.photos[0]} />
        <span className="events-image-tag">{conference.shortName}</span>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-6">
        <Eyebrow>{conference.category} CONFERENCE · COMPLETED</Eyebrow>
        <h3 className="mb-4 font-headline-sm text-headline-sm text-primary">
          <Link
            prefetch={false}
            href={`/events/${conference.slug}`}
            className="events-title-link"
          >
            {conference.title}
            {conference.subtitle && (
              <>: {conference.subtitle.replace(/\.$/, "")}</>
            )}
          </Link>
        </h3>
        <EventMetadata conference={conference} compact />
        <p className="mt-4 text-body-sm text-on-surface-variant">
          {conference.organiser}.
        </p>
        {conference.stats && (
          <p className="mt-3 text-body-sm font-semibold text-secondary">
            361 delegates from 24 states.
          </p>
        )}
        <Link
          prefetch={false}
          href={`/events/${conference.slug}`}
          className="events-inline-link mt-auto pt-5"
        >
          Explore Conference Archive
          <Icon name="arrow_forward" className="shrink-0 text-[18px]" />
        </Link>
      </div>
    </li>
  );
}
export function SecretariatCTA({
  title = "Collaborate with AEETDS",
  text = "Institutions interested in collaborating with AEETDS on conferences, training or research can write to the Secretary.",
  subject = "AEETDS Conference Enquiry",
  upcoming = false,
}: {
  title?: string;
  text?: string;
  subject?: string;
  upcoming?: boolean;
}) {
  const contact = `mailto:${society.email}?subject=${encodeURIComponent(subject)}`;
  return (
    <section
      className="events-section bg-surface-container-low"
      aria-labelledby="event-cta-title"
    >
      <div className="aeetds-container">
        <div className="events-contact-panel events-dark">
          <div className="min-w-0 max-w-3xl">
            <Eyebrow dark icon="handshake">
              SOCIETY SECRETARIAT
            </Eyebrow>
            <h2 id="event-cta-title" className="events-heading mb-4 text-white">
              {title}
            </h2>
            <p className="font-body-lg text-body-lg leading-relaxed text-surface-variant">
              {text}
            </p>
            <div className="events-actions mt-6">
              {upcoming && (
                <>
                  <Action
                    href={`mailto:${society.email}?subject=${encodeURIComponent("CRAFNS-2026 Registration Enquiry")}`}
                    icon="how_to_reg"
                  >
                    Conference Registration Enquiry
                  </Action>
                  <Action
                    href={`mailto:${society.email}?subject=${encodeURIComponent("CRAFNS-2026 Abstract Submission Enquiry")}`}
                    tone="light"
                    icon="article"
                  >
                    Submit Abstract Enquiry
                  </Action>
                </>
              )}
              <Action
                href={contact}
                tone={upcoming ? "light" : "blue"}
                icon="mail"
              >
                {subject === "AEETDS Training Programme"
                  ? "Write to the Secretary"
                  : "Contact Secretariat"}
              </Action>
            </div>
            {upcoming && (
              <p className="mt-4 text-body-sm text-surface-variant">
                Online registration and abstract submission are not yet
                available. These actions open an email enquiry to the
                Secretariat.
              </p>
            )}
          </div>
          <div className="events-secretariat">
            <Icon
              name="account_balance"
              className="mb-3 text-tertiary-fixed-dim"
            />
            <h3 className="mb-2 text-title-sm">AEETDS, Lucknow</h3>
            <a href={`mailto:${society.email}`} className="events-email-link">
              {society.email}
            </a>
            <p className="mt-3 text-body-sm text-surface-variant">
              {society.location}
            </p>
            <p className="mt-2 text-[11px] text-surface-variant">
              REG NO: {society.registration}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function ProceedingsAvailability({
  conference,
}: {
  conference: Conference;
}) {
  return (
    <section
      id="proceedings-archive"
      className="events-section bg-white"
      aria-labelledby="event-proceedings-title"
    >
      <div className="aeetds-container">
        <div className="events-proceedings-panel">
          <span className="events-icon">
            <Icon name="menu_book" />
          </span>
          <div className="min-w-0 flex-1">
            <Eyebrow>CONFERENCE PUBLICATIONS</Eyebrow>
            <h2 id="event-proceedings-title" className="events-heading mb-3">
              {conference.shortName} · Proceedings &amp; Book of Abstracts
            </h2>
            <p className="max-w-3xl text-on-surface-variant">
              The publication file and official bibliographic details are not
              currently available on this website. Please contact the
              Secretariat about {conference.shortName} conference materials.
            </p>
          </div>
          <Action
            href={`mailto:${society.email}?subject=${encodeURIComponent(`${conference.shortName} Conference Materials`)}`}
            tone="navy"
            icon="mail"
          >
            Enquire About Materials
          </Action>
        </div>
      </div>
    </section>
  );
}
