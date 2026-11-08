import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow, Icon } from "../ui";

export default function AboutSectionHeader({
  title,
  eyebrow,
  introduction,
  aside,
  breadcrumbLabel,
  eyebrowDetail,
}: {
  title: string;
  eyebrow: string;
  introduction: string;
  aside?: ReactNode;
  breadcrumbLabel?: string;
  eyebrowDetail?: string;
}) {
  return (
    <>
      <div className="bg-surface-container-low/70">
        <div className="aeetds-container">
          <nav
            aria-label="Breadcrumb"
            className="py-2 text-body-sm text-on-surface-variant"
          >
            <ol className="flex flex-wrap items-center gap-2">
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
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  prefetch={false}
                  href="/about"
                  className="inline-flex min-h-11 items-center hover:text-secondary"
                >
                  About
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-primary">
                {breadcrumbLabel ?? title}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <section
        className="about-section-block bg-white"
        aria-labelledby="about-section-title"
      >
        <div className="aeetds-container grid grid-cols-1 items-end gap-6 lg:grid-cols-12">
          <div
            className={
              aside ? "min-w-0 lg:col-span-8" : "min-w-0 lg:col-span-12"
            }
          >
            {eyebrowDetail ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Eyebrow>{eyebrow}</Eyebrow>
                <span className="mb-2 font-label-mono-isbn text-[11px] text-on-surface-variant">
                  {eyebrowDetail}
                </span>
              </div>
            ) : (
              <Eyebrow>{eyebrow}</Eyebrow>
            )}
            <h1
              id="about-section-title"
              className="mb-3 font-headline-lg text-headline-lg-mobile tracking-tight text-primary sm:text-headline-lg"
            >
              {title}
            </h1>
            <p className="max-w-3xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {introduction}
            </p>
          </div>
          {aside && <aside className="min-w-0 lg:col-span-4">{aside}</aside>}
        </div>
      </section>
    </>
  );
}
