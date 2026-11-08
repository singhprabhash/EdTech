import { societyMilestones } from "../../../content/aeetds-about";
import { Eyebrow, Icon } from "../ui";

export default function JourneyTimeline() {
  return (
    <section
      className="about-section bg-background"
      aria-labelledby="journey-title"
    >
      <div className="aeetds-container">
        <div className="mb-10 flex flex-col items-start gap-2">
          <Eyebrow>
            <span
              aria-hidden="true"
              className="inline-block h-0.5 w-6 bg-secondary"
            />
            Chronology &amp; Achievements
          </Eyebrow>
          <h2
            id="journey-title"
            className="font-headline-md text-headline-md font-semibold text-primary"
          >
            Our Journey
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Milestones in scientific exchange, national symposia and academic
            partnership
          </p>
        </div>
        <ol
          className="about-journey-list relative mx-auto max-w-5xl"
          aria-label="Society milestones"
        >
          {societyMilestones.map((milestone) => (
            <li className="about-milestone relative" key={milestone.title}>
              <div className="about-milestone-heading flex min-w-0 flex-col">
                <time
                  dateTime={milestone.dateTime}
                  className="about-milestone-date inline-flex items-center gap-2 self-start rounded bg-surface-container-highest px-3 py-1 font-label-mono-isbn text-[12px] font-bold text-primary"
                >
                  {milestone.date}
                </time>
                <h3 className="mt-2 font-headline-sm text-headline-sm font-semibold text-primary">
                  {milestone.title}
                </h3>
              </div>
              <div
                aria-hidden="true"
                className="about-timeline-node flex items-center justify-center text-tertiary-fixed-dim shadow-md"
              >
                <Icon name={milestone.icon} className="text-[18px]" />
              </div>
              <div className="about-milestone-description min-w-0 rounded-xl bg-white p-4 shadow-sm">
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {milestone.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
