import BrochureDownload from "./brochure-download";
import {
  eventsIntroduction,
  crafnsConference,
  crafnsForms,
  pastConferences,
  eventPhotos,
} from "../../../content/aeetds-events";
import { Action, Eyebrow, Icon } from "../ui";
import EventBreadcrumb from "./breadcrumb";
import EventImage from "./event-image";
import { ArchiveCard, EventMetadata, SecretariatCTA } from "./shared";
import EventCalendar from "./calendar";
import { TrainingTeaser } from "./training";
export default function EventsLanding({
  eventRecords,
}: {
  eventRecords?: readonly import("../../../content/aeetds-events").Conference[];
} = {}) {
  const currentCrafns =
    eventRecords?.find((event) => event.slug === "crafns-2026") ??
    crafnsConference;
  const currentPast =
    eventRecords?.filter((event) => event.status === "completed") ??
    pastConferences;
  return (
    <>
      <EventBreadcrumb />
      <section
        className="events-section bg-background"
        aria-labelledby="events-title"
      >
        <div className="aeetds-container grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Eyebrow>SCIENTIFIC EXCHANGE &amp; COLLABORATION</Eyebrow>
            <h1 id="events-title" className="events-page-title mb-5">
              Conferences &amp; Events
            </h1>
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {eventsIntroduction}
            </p>
            <div className="events-actions mt-6">
              <Action href="/events/crafns-2026" tone="navy" icon="event">
                Upcoming Conference
              </Action>
              <Action href="#past-conferences" tone="light" icon="history">
                Past Conferences
              </Action>
            </div>
          </div>
          <figure className="min-w-0 lg:col-span-5">
            <EventImage photo={eventPhotos.ncfahs[0]} priority />
            <figcaption className="mt-3 text-body-sm text-on-surface-variant">
              NCFAHS-2026 · {eventPhotos.ncfahs[0].caption}
            </figcaption>
          </figure>
        </div>
      </section>
      <section
        className="events-section bg-white"
        aria-labelledby="featured-event-title"
      >
        <div className="aeetds-container">
          <Eyebrow>UPCOMING CONFERENCE</Eyebrow>
          <h2 id="featured-event-title" className="events-heading mb-6">
            Featured Upcoming Assembly
          </h2>
          <article className="events-featured">
            <div className="events-featured-main">
              <p className="events-label mb-4">
                <Icon name="event_upcoming" className="text-[18px]" />
                CRAFNS-2026 · HYBRID
              </p>
              <h3 className="mb-4 font-headline-md text-headline-md text-primary">
                {currentCrafns.title}
              </h3>
              <p className="mb-5 text-on-surface-variant">
                {currentCrafns.subtitle}
              </p>
              <EventMetadata conference={currentCrafns} showHost={false} />
              <div className="events-actions mt-6">
                <BrochureDownload />
                <Action
                  href="/events/crafns-2026"
                  tone="navy"
                  icon="arrow_forward"
                >
                  View Conference Details
                </Action>
                <Action href={crafnsForms.registration} tone="light">
                  Registration
                </Action>
                <Action href={crafnsForms.abstractSubmission} tone="light">
                  Abstract Submission
                </Action>
              </div>
              <p className="mt-4 text-body-sm text-on-surface-variant">
                Registration and abstract submission open in Google Forms.
              </p>
            </div>
            <aside className="events-featured-aside events-dark">
              <Icon
                name="public"
                className="mb-5 text-[40px] text-tertiary-fixed-dim"
              />
              <Eyebrow dark>3RD INTERNATIONAL CONFERENCE</Eyebrow>
              <h3 className="mb-4 font-headline-md text-headline-md">
                CRAFNS-2026
              </h3>
              <p className="text-surface-variant">
                Climate-resilient food and nutritional security.
              </p>
            </aside>
          </article>
        </div>
      </section>
      <section
        id="past-conferences"
        className="events-section bg-background"
        aria-labelledby="past-conferences-title"
      >
        <div className="aeetds-container">
          <Eyebrow>CONFERENCE ARCHIVE</Eyebrow>
          <h2 id="past-conferences-title" className="events-heading mb-6">
            Past Conferences &amp; Symposia
          </h2>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {currentPast.map((conference) => (
              <ArchiveCard key={conference.slug} conference={conference} />
            ))}
          </ul>
        </div>
      </section>
      <EventCalendar />
      <TrainingTeaser />
      <SecretariatCTA />
    </>
  );
}
