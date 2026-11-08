import { society } from "../../content/aeetds";
import { Action, Icon } from "./ui";
import HeroSlideshow from "./hero-slideshow";

export default function HeroSection() {
  return (
    <section
      className="aeetds-section aeetds-hero bg-background"
      aria-labelledby="aeetds-headline"
    >
      <div className="aeetds-container grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          <div className="inline-flex items-center gap-2 self-start rounded bg-surface-container-high px-3 py-2 text-[11px] font-semibold tracking-wide text-primary">
            <Icon
              name="verified"
              className="shrink-0 text-[16px] text-secondary"
            />
            <span>
              ESTABLISHED UNDER SOCIETIES REGISTRATION ACT XXI OF 1860
            </span>
          </div>
          <h1
            id="aeetds-headline"
            className="font-headline-lg text-headline-lg-mobile tracking-tight text-primary sm:text-headline-lg"
          >
            {society.headline}
          </h1>
          <p className="max-w-2xl text-body-md leading-relaxed text-on-surface-variant">
            {society.introduction}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Action href="/membership/apply" icon="badge">
              Become a Member
            </Action>
            <Action href="/events" tone="light" icon="event_upcoming">
              Upcoming Conference
            </Action>
            <Action href="/submit/abstract" tone="text">
              Submit Abstract
              <Icon name="arrow_forward" className="text-[18px]" />
            </Action>
          </div>
          <div className="mt-4 flex flex-wrap justify-between gap-3 rounded bg-surface-container-low p-4 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-2">
              <Icon
                name="domain"
                className="shrink-0 text-[20px] text-secondary"
              />
              Secretariat: Lucknow, Uttar Pradesh
            </span>
            <span className="flex items-center gap-2">
              <Icon
                name="menu_book"
                className="shrink-0 text-[20px] text-secondary"
              />
              Publishing Partner: EdTech Publications
            </span>
            <span className="flex items-center gap-2">
              <Icon
                name="verified_user"
                className="shrink-0 text-[20px] text-secondary"
              />
              Reg. {society.registration}
            </span>
          </div>
        </div>
        <HeroSlideshow />
      </div>
    </section>
  );
}
