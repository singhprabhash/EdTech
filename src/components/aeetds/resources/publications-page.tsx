import { pastConferences } from "../../../content/aeetds-events";
import {
  publicationsIntroduction,
  abstractsCopy,
  editedVolumesCopy,
  chapterSteps,
  chapterPublication,
  magazineCopy,
  journalCopy,
} from "../../../content/aeetds-publications";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
import { ResourceBreadcrumb, ResourceHero, ResourceCTA } from "./shared";
export default function PublicationsPageContent() {
  return (
    <div className="aeetds-publications">
      <ResourceBreadcrumb title="Publications" />
      <ResourceHero
        title="Publications"
        eyebrow="PROCEEDINGS & SCHOLARLY VOLUMES"
        introduction={publicationsIntroduction}
        aside={
          <aside className="resource-publication-hero">
            <span className="resource-icon">
              <Icon name="auto_stories" />
            </span>
            <p className="mt-4 text-label-md text-secondary">
              PUBLISHING PARTNER
            </p>
            <h2 className="mt-2 font-headline-md text-headline-md">
              EdTech Publications, Lucknow
            </h2>
            <p className="mt-4 text-body-sm text-on-surface-variant">
              Conference proceedings and edited scholarly volumes.
            </p>
          </aside>
        }
      />
      <section
        className="resource-section bg-white"
        aria-labelledby="abstract-books-title"
      >
        <div className="aeetds-container">
          <Eyebrow>CONFERENCE PUBLICATIONS</Eyebrow>
          <h2 id="abstract-books-title" className="resource-heading mb-4">
            Books of Abstracts
          </h2>
          <p className="mb-6 max-w-4xl text-on-surface-variant">
            {abstractsCopy}
          </p>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {pastConferences.map((conference) => (
              <li key={conference.slug} className="resource-publication-card">
                <span className="resource-icon mb-4">
                  <Icon name="menu_book" />
                </span>
                <p className="mb-2 text-label-md text-secondary">
                  {conference.shortName}
                </p>
                <h3 className="mb-4 font-headline-sm text-headline-sm">
                  {conference.title}
                </h3>
                <p className="resource-pending">
                  Publication PDF and ISBN pending availability
                </p>
                <p className="mt-4 text-body-sm text-on-surface-variant">
                  No publication file or confirmed ISBN has been supplied for
                  this listing.
                </p>
                <div className="mt-auto pt-5">
                  <Action
                    href={`/events/${conference.slug}`}
                    tone="light"
                    icon="arrow_forward"
                  >
                    View Conference
                  </Action>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="resource-section bg-background"
        aria-labelledby="edited-volumes-title"
      >
        <div className="aeetds-container grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Eyebrow>EDITED SCHOLARLY VOLUMES</Eyebrow>
            <h2 id="edited-volumes-title" className="resource-heading mb-5">
              Edited Volumes
            </h2>
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {editedVolumesCopy}
            </p>
          </div>
          <aside className="resource-dark rounded-xl bg-primary-dark p-6 text-white lg:col-span-5">
            <Eyebrow dark>AUTHOR REQUIREMENTS</Eyebrow>
            <h3 className="mb-4 font-headline-md text-headline-md">
              Original, Technically Sound Chapters
            </h3>
            <ul className="space-y-4 text-surface-variant">
              <li>Similarity must be below 10%.</li>
              <li>
                No publication fee for chapters accepted for Society volumes.
              </li>
              <li>Acceptance follows editorial screening and review.</li>
            </ul>
          </aside>
        </div>
      </section>
      <section
        className="resource-section bg-white"
        aria-labelledby="chapter-call-title"
      >
        <div className="aeetds-container">
          <Eyebrow>AUTHOR PARTICIPATION</Eyebrow>
          <h2 id="chapter-call-title" className="resource-heading mb-6">
            Call for Book Chapters
          </h2>
          <ol className="resource-process">
            {chapterSteps.map((text, index) => (
              <li key={text}>
                <span className="resource-step-number">{index + 1}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-on-surface-variant">{chapterPublication}</p>
          <div className="resource-notice mt-5">
            The online Book Chapter Submission form is not yet available.
            Contact the Secretary for submission guidance; no chapter can be
            uploaded through this page.
          </div>
          <div className="resource-actions mt-6">
            <Action
              href={`mailto:${society.email}?subject=Book%20Chapter%20Submission%20Enquiry`}
              tone="navy"
              icon="mail"
            >
              Enquire About Chapter Submission
            </Action>
            <Action href="/submit/guidelines" tone="light">
              Submission Guidelines
            </Action>
            <Action href="/submit/registration" tone="light">
              Registration &amp; Payment
            </Action>
          </div>
        </div>
      </section>
      <section
        className="resource-section bg-background"
        aria-labelledby="future-publications-title"
      >
        <div className="aeetds-container">
          <Eyebrow>FUTURE PUBLICATIONS</Eyebrow>
          <h2 id="future-publications-title" className="resource-heading mb-6">
            Magazine &amp; Journal
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <article className="resource-future-publication">
              <span className="resource-pending">Forthcoming</span>
              <h3 className="mt-4 mb-4 font-headline-md text-headline-md">
                AEETDS Magazine
              </h3>
              <p className="leading-relaxed text-on-surface-variant">
                {magazineCopy}
              </p>
            </article>
            <article className="resource-future-publication">
              <span className="resource-pending">Planned</span>
              <h3 className="mt-4 mb-4 font-headline-md text-headline-md">
                AEETDS Journal
              </h3>
              <p className="leading-relaxed text-on-surface-variant">
                {journalCopy}
              </p>
              <p className="mt-4 text-body-sm font-semibold text-primary">
                The journal has not launched and is not accepting submissions.
              </p>
            </article>
          </div>
        </div>
      </section>
      <ResourceCTA
        title="Discuss a Society Publication"
        text="For official conference publication availability and book chapter guidance, write to the Society Secretariat."
        subject="AEETDS Publications Enquiry"
      >
        <Action href="/events" tone="light">
          Conference Archives
        </Action>
      </ResourceCTA>
    </div>
  );
}
