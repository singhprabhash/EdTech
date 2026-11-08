import { society } from "../../../content/aeetds";
import { Action, Eyebrow } from "../ui";

export default function VisionMissionCTA() {
  return (
    <section
      className="vision-section bg-primary-container text-white"
      aria-labelledby="vision-cta-title"
    >
      <div className="aeetds-container">
        <div className="vision-invitation flex flex-col items-center justify-between gap-8 rounded-2xl bg-primary-dark p-6 sm:p-10 xl:flex-row">
          <div className="min-w-0 max-w-2xl text-center xl:text-left">
            <div className="mb-3 flex justify-center xl:justify-start">
              <Eyebrow dark>JOIN THE SOCIETY</Eyebrow>
            </div>
            <h2
              id="vision-cta-title"
              className="mb-2 font-headline-lg text-headline-lg-mobile sm:text-headline-lg"
            >
              Be Part of a More Sustainable Agricultural Future
            </h2>
            <p className="text-[16px] leading-relaxed text-surface-variant">
              Join AEETDS in advancing agricultural knowledge, enterprise
              development and environmental responsibility.
            </p>
          </div>
          <div className="vision-cta-actions flex w-full min-w-0 flex-col gap-4 sm:w-auto sm:flex-row xl:shrink-0">
            <Action
              href={`mailto:${society.email}?subject=${encodeURIComponent("AEETDS membership enquiry")}`}
            >
              Become a Member<span className="sr-only"> by email</span>
            </Action>
            <Action href={`mailto:${society.email}`} tone="light">
              Contact AEETDS<span className="sr-only"> by email</span>
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}
