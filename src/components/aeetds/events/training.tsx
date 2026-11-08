import { society } from "../../../content/aeetds";
import {
  trainingPillars,
  trainingIntroduction,
  trainingOfficialCopy,
  trainingInvitation,
  type EventTheme,
} from "../../../content/aeetds-events";
import { Action, Eyebrow, Icon } from "../ui";
import EventBreadcrumb from "./breadcrumb";
import { SecretariatCTA } from "./shared";
export function TrainingPillarCard({
  pillar,
  index,
  compact = false,
}: {
  pillar: EventTheme;
  index: number;
  compact?: boolean;
}) {
  return (
    <li
      className={`events-training-card ${compact ? "events-training-card-compact" : ""}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="events-icon">
          <Icon name={pillar.icon} />
        </span>
        {!compact && (
          <span className="font-label-mono-isbn text-[11px] text-on-surface-variant">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3
        className={
          compact ? "text-title-sm" : "font-headline-sm text-headline-sm"
        }
      >
        {pillar.title}
      </h3>
      {!compact && (
        <>
          <p className="mt-3 text-body-sm leading-relaxed text-on-surface-variant">
            Contact the Secretary to discuss this training area.
          </p>
          <a
            className="events-inline-link mt-4"
            href={`mailto:${society.email}?subject=${encodeURIComponent(`Training Enquiry: ${pillar.title}`)}`}
          >
            Enquire About Training
            <Icon name="arrow_forward" className="text-[18px]" />
          </a>
        </>
      )}
    </li>
  );
}
export function TrainingTeaser() {
  return (
    <section
      className="events-section bg-background"
      aria-labelledby="training-teaser-title"
    >
      <div className="aeetds-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 max-w-3xl">
            <Eyebrow>SKILL DEVELOPMENT</Eyebrow>
            <h2 id="training-teaser-title" className="events-heading mb-3">
              Training Programmes &amp; Workshops
            </h2>
            <p className="text-on-surface-variant">{trainingIntroduction}</p>
          </div>
          <Action
            href="/events/trainings-workshops"
            tone="navy"
            icon="arrow_forward"
          >
            Explore Training Programmes
          </Action>
        </div>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trainingPillars.map((pillar, index) => (
            <TrainingPillarCard
              key={pillar.title}
              pillar={pillar}
              index={index}
              compact
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
export default function TrainingsWorkshopsPage() {
  return (
    <>
      <EventBreadcrumb current="Trainings & Workshops" />
      <section
        className="events-section bg-background"
        aria-labelledby="training-title"
      >
        <div className="aeetds-container grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Eyebrow>TRAININGS &amp; WORKSHOPS</Eyebrow>
            <h1 id="training-title" className="events-page-title mb-5">
              Training Programmes &amp; Workshops
            </h1>
            <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {trainingIntroduction}
            </p>
            <div className="events-actions mt-6">
              <Action href="#training-pillars" tone="navy" icon="school">
                Explore Training Areas
              </Action>
              <Action
                href={`mailto:${society.email}?subject=AEETDS%20Training%20Programme`}
                tone="light"
                icon="mail"
              >
                Request a Training Programme
              </Action>
            </div>
          </div>
          <div className="events-training-visual lg:col-span-5">
            <span className="events-icon mb-5">
              <Icon name="agriculture" className="text-[32px]" />
            </span>
            <Eyebrow>KNOWLEDGE &amp; PRACTICAL SKILLS</Eyebrow>
            <h2 className="mb-4 font-headline-md text-headline-md">
              Agriculture, Entrepreneurship &amp; Research
            </h2>
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              Training photographs are not currently available.
            </p>
            <p className="mt-5 border-t border-surface-container pt-4 text-body-sm text-on-surface-variant">
              Contact the Secretary to discuss hosting a programme with the
              Society.
            </p>
          </div>
        </div>
      </section>
      <section
        id="training-pillars"
        className="events-section bg-white"
        aria-labelledby="training-pillars-title"
      >
        <div className="aeetds-container">
          <Eyebrow>TRAINING AREAS</Eyebrow>
          <h2 id="training-pillars-title" className="events-heading mb-4">
            The Nine Training Pillars
          </h2>
          <p className="mb-6 max-w-4xl text-on-surface-variant">
            {trainingOfficialCopy}
          </p>
          <ul className="events-theme-grid">
            {trainingPillars.map((pillar, index) => (
              <TrainingPillarCard
                key={pillar.title}
                pillar={pillar}
                index={index}
              />
            ))}
          </ul>
        </div>
      </section>
      <SecretariatCTA
        title="Interested in Hosting a Training Programme?"
        text={trainingInvitation}
        subject="AEETDS Training Programme"
      />
    </>
  );
}
