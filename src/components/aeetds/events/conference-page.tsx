import BrochureDownload from "./brochure-download";
import Link from "next/link";
import { crafnsForms, type Conference } from "../../../content/aeetds-events";
import { Action, Eyebrow, Icon } from "../ui";
import EventBreadcrumb from "./breadcrumb";
import EventImage from "./event-image";
import EventGallery from "./gallery";
import {
  EventMetadata,
  ThemeGrid,
  ProceedingsAvailability,
  SecretariatCTA,
} from "./shared";

export function ConferenceHero({ conference }: { conference: Conference }) {
  const upcoming = conference.status === "upcoming";
  return (
    <section
      className={`events-section events-conference-hero events-${conference.slug} bg-background`}
      aria-labelledby="conference-page-title"
    >
      <div className="aeetds-container">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <Eyebrow>
              {conference.shortName} ·{" "}
              {upcoming ? "UPCOMING CONFERENCE" : "COMPLETED CONFERENCE"}
            </Eyebrow>
            <h1 id="conference-page-title" className="events-page-title mb-4">
              {conference.title}
            </h1>
            {conference.subtitle && (
              <p className="mb-5 font-body-lg text-body-lg italic leading-relaxed text-on-surface-variant">
                {conference.subtitle}
              </p>
            )}
            <p className="flex items-start gap-2 text-body-sm text-on-surface-variant">
              <Icon
                name="account_balance"
                className="shrink-0 text-[20px] text-secondary"
              />
              <span>{conference.organiser}.</span>
            </p>
          </div>
          <aside
            className={`events-hero-aside ${upcoming ? "" : "events-dark"}`}
          >
            {upcoming ? (
              <>
                <Eyebrow>CONFERENCE PARTICIPATION</Eyebrow>
                <h2 className="mb-4 text-title-sm">
                  CRAFNS-2026 Participation
                </h2>
                <div className="flex flex-col gap-3">
                  <BrochureDownload />
                  <Action
                    href={crafnsForms.registration}
                    tone="navy"
                    icon="how_to_reg"
                  >
                    Registration
                  </Action>
                  <Action href={crafnsForms.abstractSubmission} icon="article">
                    Abstract Submission
                  </Action>
                </div>
                <p className="mt-4 text-body-sm leading-relaxed text-on-surface-variant">
                  Registration and abstract submission open in Google Forms.
                </p>
              </>
            ) : (
              <>
                <Eyebrow dark>CONFERENCE ORGANISATION</Eyebrow>
                <h2 className="mb-4 font-headline-sm text-headline-sm">
                  Collaborating Institutions
                </h2>
                <ul className="space-y-3 text-body-sm leading-relaxed text-surface-variant">
                  {conference.collaborators.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon
                        name="account_balance"
                        className="shrink-0 text-[18px] text-tertiary-fixed-dim"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                {conference.stats && (
                  <dl className="events-stats mt-5">
                    {conference.stats.map((item) => (
                      <div key={item.label}>
                        <dt className="text-body-sm text-surface-variant">
                          {item.label}
                        </dt>
                        <dd className="font-headline-md text-headline-md">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                <Link
                  prefetch={false}
                  href="#conference-gallery"
                  className="events-inline-link mt-5 text-white"
                >
                  <Icon name="photo_library" className="text-[18px]" />
                  Browse Conference Gallery
                </Link>
              </>
            )}
          </aside>
        </div>
        {upcoming && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <EventImage />
            </div>
            <div className="events-upcoming-note events-dark lg:col-span-4">
              <Eyebrow dark>SCIENTIFIC PROGRAMME</Eyebrow>
              <h2 className="mb-4 font-headline-md text-headline-md">
                Eight Suggested Sub-Themes
              </h2>
              <p className="text-surface-variant">
                Crop improvement, horticulture, natural resources, plant health,
                allied sectors, digital agriculture, agroforestry and
                agricultural economics.
              </p>
              <p className="mt-5 border-t border-white/15 pt-4 text-body-sm text-surface-variant">
                Final themes, important dates and conference details are to be
                announced.
              </p>
            </div>
          </div>
        )}
        <div className="events-metadata-panel mt-6">
          <h2 className="mb-4 flex items-center gap-2 text-title-sm">
            <Icon name="event_note" className="text-secondary" />
            Conference Metadata
          </h2>
          <EventMetadata conference={conference} />
          {upcoming && (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded bg-white p-4">
                <dt className="text-label-md text-on-surface-variant">
                  Registration fees
                </dt>
                <dd className="mt-2 font-semibold">To be announced</dd>
              </div>
              <div className="rounded bg-white p-4">
                <dt className="text-label-md text-on-surface-variant">
                  Important dates
                </dt>
                <dd className="mt-2 font-semibold">To be announced</dd>
              </div>
            </dl>
          )}
        </div>
        {!upcoming && conference.slug !== "ncfahs-2026" && (
          <figure className="mt-6">
            <EventImage
              photo={
                conference.slug === "fstat-2025"
                  ? conference.photos[1]
                  : conference.photos[0]
              }
              priority
              className="events-wide-photo"
            />
            <figcaption className="mt-3 text-body-sm text-on-surface-variant">
              {
                (conference.slug === "fstat-2025"
                  ? conference.photos[1]
                  : conference.photos[0]
                ).caption
              }
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
function ConferenceOverview({ conference }: { conference: Conference }) {
  return (
    <section
      className="events-section bg-white"
      aria-labelledby="conference-overview-title"
    >
      <div className="aeetds-container grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow>CONFERENCE OVERVIEW</Eyebrow>
          <h2 id="conference-overview-title" className="events-heading mb-5">
            {conference.status === "upcoming"
              ? "Advancing Climate-Resilient Food & Nutritional Security"
              : conference.slug === "ncfahs-2026"
                ? "Agroforestry, Horticulture & Sustainable Land Use"
                : conference.slug === "fstat-2025"
                  ? "Science and Technology for Agricultural Transformation"
                  : "Climate Change and Agricultural Innovation"}
          </h2>
          <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            {conference.overview}
          </p>
          {conference.slug === "ncfahs-2026" && (
            <p className="mt-5 text-body-md leading-relaxed text-on-surface-variant">
              Delegates took part in oral and poster sessions and visited the
              institute&apos;s agroforestry and horticulture demonstration
              models.
            </p>
          )}
        </div>
        <div className="min-w-0 lg:col-span-5">
          {conference.photos.length ? (
            <figure>
              <EventImage
                photo={
                  conference.slug === "ncfahs-2026"
                    ? conference.photos[0]
                    : conference.photos[
                        conference.slug === "fstat-2025" ? 0 : 1
                      ]
                }
              />
              <figcaption className="mt-3 text-body-sm text-on-surface-variant">
                {
                  (conference.slug === "ncfahs-2026"
                    ? conference.photos[0]
                    : conference.photos[
                        conference.slug === "fstat-2025" ? 0 : 1
                      ]
                  ).caption
                }
              </figcaption>
            </figure>
          ) : (
            <div className="events-overview-note">
              <Icon name="eco" className="mb-4 text-[40px] text-secondary" />
              <h3 className="mb-3 font-headline-sm text-headline-sm">
                Agricultural and Allied Sciences
              </h3>
              <p className="text-on-surface-variant">
                Scientists, academicians, policy makers, industry, students and
                farmers come together to discuss climate-resilient food and
                nutritional security.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
function ConferencePeople({ conference }: { conference: Conference }) {
  if (!conference.people.length) return null;
  return (
    <section
      className="events-section bg-white"
      aria-labelledby="event-people-title"
    >
      <div className="aeetds-container">
        <Eyebrow>CONFERENCE LEADERSHIP</Eyebrow>
        <h2 id="event-people-title" className="events-heading mb-6">
          {conference.slug === "ncfahs-2026"
            ? "Dignitaries and Organisers"
            : conference.slug === "fstat-2025"
              ? "Conference Leadership & Secretariat"
              : "Conference Patron"}
        </h2>
        <ul
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${conference.people.length > 2 ? "lg:grid-cols-4" : ""}`}
        >
          {conference.people.map((person) => (
            <li key={person.name} className="events-person-card">
              <span className="events-icon mb-4">
                <Icon name="person" />
              </span>
              <h3 className="mb-2 font-headline-sm text-headline-sm">
                {person.name}
              </h3>
              <p className="text-body-sm leading-relaxed text-on-surface-variant">
                {person.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
function ProgrammeHighlights({ conference }: { conference: Conference }) {
  return (
    <section
      className="events-section bg-white"
      aria-labelledby="event-highlights-title"
    >
      <div className="aeetds-container">
        <Eyebrow>CONFERENCE PROGRAMME</Eyebrow>
        <h2 id="event-highlights-title" className="events-heading mb-6">
          Programme Highlights
        </h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {conference.highlights?.map((text, index) => (
            <li key={text} className="events-highlight">
              <Icon
                name={
                  [
                    "podium",
                    "forum",
                    "emoji_events",
                    "groups",
                    "military_tech",
                    "menu_book",
                  ][index]
                }
                className="shrink-0 text-[26px] text-secondary"
              />
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
function CollaboratingInstitutions({ conference }: { conference: Conference }) {
  return (
    <section
      className="events-section bg-white"
      aria-labelledby="event-collaborators-title"
    >
      <div className="aeetds-container">
        <Eyebrow>INSTITUTIONAL COLLABORATION</Eyebrow>
        <h2 id="event-collaborators-title" className="events-heading mb-6">
          Collaborating Research Institutions
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {conference.collaborators.map((name) => (
            <li key={name} className="events-person-card">
              <span className="events-icon mb-4">
                <Icon name="account_balance" />
              </span>
              <h3 className="text-title-sm">{name}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default function ConferencePage({
  conference,
}: {
  conference: Conference;
}) {
  return (
    <>
      <EventBreadcrumb current={conference.shortName} />
      <ConferenceHero conference={conference} />
      <ConferenceOverview conference={conference} />
      {conference.slug !== "ncfahs-2026" && (
        <ThemeGrid
          themes={conference.themes}
          title={conference.themesHeading}
          suggested={conference.status === "upcoming"}
        />
      )}
      {conference.slug === "iacrsaegns-2024" && (
        <CollaboratingInstitutions conference={conference} />
      )}
      <ConferencePeople conference={conference} />
      {conference.highlights && <ProgrammeHighlights conference={conference} />}
      <EventGallery
        eventSlug={conference.slug}
        eventName={conference.shortName}
        photos={conference.photos}
        title={
          conference.slug === "fstat-2025"
            ? "Gallery & Documented Proceedings"
            : conference.slug === "iacrsaegns-2024"
              ? "Archival Moments & Proceedings"
              : undefined
        }
      />
      {conference.status === "completed" && (
        <>
          <ProceedingsAvailability conference={conference} />
          <div className="events-section bg-background">
            <div className="aeetds-container events-actions">
              <Action
                href="/events#past-conferences"
                tone="navy"
                icon="arrow_back"
              >
                Back to Past Conferences
              </Action>
              <Action
                href="/events/crafns-2026"
                tone="light"
                icon="arrow_forward"
              >
                Explore CRAFNS-2026
              </Action>
            </div>
          </div>
        </>
      )}{" "}
      {conference.status === "upcoming" && (
        <SecretariatCTA
          title="Be Part of CRAFNS-2026"
          text="For conference registration, abstract submission and official programme information, contact the Society Secretariat."
          upcoming
        />
      )}
    </>
  );
}
