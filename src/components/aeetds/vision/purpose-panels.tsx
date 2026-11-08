import {
  visionStatement,
  missionStatement,
} from "../../../content/aeetds-vision";
import { Icon } from "../ui";

export default function VisionMissionPanels() {
  return (
    <section
      className="vision-section bg-background"
      aria-label="Vision and Mission"
    >
      <div className="aeetds-container vision-purpose-panels grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article
          className="vision-purpose-panel vision-purpose-panel-light"
          aria-labelledby="our-vision-title"
        >
          <div className="vision-panel-heading flex items-center justify-between gap-3">
            <span className="vision-panel-label bg-primary-dark text-tertiary-fixed-dim">
              OUR VISION
            </span>
            <span className="vision-panel-icon">
              <Icon name="lightbulb" className="text-[28px]" />
            </span>
          </div>
          <h2
            id="our-vision-title"
            className="font-headline-md text-headline-md text-primary"
          >
            A future built on knowledge, enterprise and sustainability
          </h2>
          <blockquote className="vision-panel-quote">
            <Icon name="format_quote" className="vision-quote-mark" />
            <p>{visionStatement}</p>
          </blockquote>
        </article>
        <article
          className="vision-purpose-panel vision-purpose-panel-dark"
          aria-labelledby="our-mission-title"
        >
          <div className="vision-panel-heading flex items-center justify-between gap-3">
            <span className="vision-panel-label bg-tertiary-fixed text-primary">
              OUR MISSION
            </span>
            <span className="vision-panel-icon">
              <Icon name="hub" className="text-[28px]" />
            </span>
          </div>
          <h2
            id="our-mission-title"
            className="font-headline-md text-headline-md"
          >
            Connecting research with real-world impact
          </h2>
          <blockquote className="vision-panel-quote">
            <Icon name="format_quote" className="vision-quote-mark" />
            <p>{missionStatement}</p>
          </blockquote>
        </article>
      </div>
    </section>
  );
}
