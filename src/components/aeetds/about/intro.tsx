import Link from "next/link";
import { society } from "../../../content/aeetds";
import { aboutIntroduction } from "../../../content/aeetds-about";
import { Eyebrow, Icon } from "../ui";

export default function AboutPageIntro() {
  return (
    <>
      <div className="bg-surface-container-low/80 shadow-sm">
        <div className="aeetds-container flex flex-wrap items-center justify-between gap-3 py-3 text-body-sm">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-on-surface-variant">
              <li>
                <Link
                  prefetch={false}
                  href="/"
                  className="inline-flex min-h-11 items-center gap-1 hover:text-secondary"
                >
                  <Icon name="home" className="text-[15px]" />
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-outline">
                /
              </li>
              <li aria-current="page" className="font-semibold text-primary">
                About the Society
              </li>
            </ol>
          </nav>
          <span className="hidden items-center gap-1.5 rounded-full bg-surface-container-highest px-2.5 py-1 font-label-mono-isbn text-[11px] text-primary sm:inline-flex">
            <Icon name="verified" className="text-[13px] text-secondary" />
            {society.registration}
          </span>
        </div>
      </div>
      <section
        className="about-section relative overflow-hidden bg-white"
        aria-labelledby="about-title"
      >
        <div className="aeetds-container">
          <div className="flex max-w-4xl flex-col gap-3">
            <Eyebrow>
              <span
                aria-hidden="true"
                className="inline-block h-0.5 w-8 bg-secondary"
              />
              Institutional Identity &amp; Charter
            </Eyebrow>
            <h1
              id="about-title"
              className="about-page-title font-headline-lg text-primary"
            >
              About the Society
            </h1>
            <p className="max-w-3xl font-body-lg text-body-lg text-on-surface-variant italic">
              {aboutIntroduction}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
