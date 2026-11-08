import Link from "next/link";
import { visionIntroduction } from "../../../content/aeetds-vision";

export default function VisionMissionPageHeader() {
  return (
    <section
      className="vision-section vision-page-intro bg-surface-container-low"
      aria-labelledby="vision-page-title"
    >
      <div className="aeetds-container">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 text-[12px] text-on-surface-variant"
        >
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link
                prefetch={false}
                href="/"
                className="inline-flex min-h-11 items-center hover:text-secondary"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="mx-1 text-outline">
              /
            </li>
            <li>
              <Link
                prefetch={false}
                href="/about"
                className="inline-flex min-h-11 items-center font-semibold text-secondary hover:underline"
              >
                About
              </Link>
            </li>
            <li aria-hidden="true" className="mx-1 text-outline">
              /
            </li>
            <li aria-current="page" className="text-on-surface">
              Vision, Mission and Objectives
            </li>
          </ol>
        </nav>
        <div className="max-w-4xl">
          <div className="mb-2 inline-flex items-center gap-2 rounded bg-secondary-fixed/50 px-2.5 py-1 font-label-mono-isbn text-[11px] tracking-wider text-on-secondary-fixed-variant">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-secondary"
            />
            OUR PURPOSE &amp; DIRECTION
          </div>
          <h1
            id="vision-page-title"
            className="mb-2 font-headline-lg text-headline-lg-mobile tracking-tight text-primary sm:text-headline-lg"
          >
            Vision, Mission and Objectives
          </h1>
          <p className="max-w-3xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            {visionIntroduction}
          </p>
        </div>
      </div>
    </section>
  );
}
