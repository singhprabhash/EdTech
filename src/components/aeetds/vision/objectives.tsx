import { objectives } from "../../../content/aeetds-vision";
import { Eyebrow, Icon } from "../ui";

export default function ObjectivesSection() {
  return (
    <section
      className="vision-section bg-background"
      aria-labelledby="objectives-title"
    >
      <div className="aeetds-container">
        <div className="vision-section-heading mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <Eyebrow>OUR OBJECTIVES</Eyebrow>
            <h2
              id="objectives-title"
              className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
            >
              Objectives
            </h2>
          </div>
          <p className="max-w-md text-body-md text-on-surface-variant italic">
            The objectives of the Society include, among others, to:
          </p>
        </div>
        <ol
          aria-label="Society objectives"
          className="vision-objective-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {objectives.map((objective, index) => (
            <li key={objective.text} className="vision-objective-card min-w-0">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span aria-hidden="true" className="vision-objective-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="vision-objective-icon">
                  <Icon name={objective.icon} className="text-[22px]" />
                </span>
              </div>
              <p className="text-body-md leading-relaxed text-on-surface">
                {objective.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
