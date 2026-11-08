import Link from "next/link";
import { news, quickLinks, society } from "../../content/aeetds";
import { Icon } from "./ui";

export default function NewsAndQuickLinksSection() {
  return (
    <section
      className="aeetds-section bg-surface-container-low"
      aria-labelledby="news-title"
    >
      <div className="aeetds-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Icon
                name="newspaper"
                className="shrink-0 text-[22px] text-secondary"
              />
              <h2
                id="news-title"
                className="font-headline-md text-headline-md text-primary"
              >
                Latest News &amp; Updates
              </h2>
            </div>
            <Link
              prefetch={false}
              href="/events"
              className="inline-flex min-h-11 items-center text-title-sm text-secondary hover:underline"
            >
              All Updates →
            </Link>
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:flex-row"
              >
                <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 rounded bg-surface-container p-3 text-center sm:w-28 sm:flex-col">
                  <span className="font-label-mono-isbn text-[11px] text-secondary">
                    {item.badge[0]}
                  </span>
                  <span className="font-headline-md text-headline-md text-primary">
                    {item.badge[1]}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {item.badge[2]}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <span className="mb-1 inline-block rounded bg-surface-container px-2 py-1 text-[10px] font-semibold text-on-surface-variant">
                      {item.category}
                    </span>
                    <h3 className="text-title-md leading-snug font-bold text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">
                      {item.summary}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-surface-container pt-3">
                    <span className="font-label-mono-isbn text-[10px] text-on-surface-variant">
                      {item.note}
                    </span>
                    <Link
                      prefetch={false}
                      href={item.href}
                      className="inline-flex min-h-11 items-center gap-1 text-body-sm font-semibold text-secondary hover:underline"
                    >
                      {item.action}
                      <Icon name="arrow_forward" className="text-[14px]" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <aside
          className="flex min-w-0 flex-col gap-6 lg:col-span-5"
          aria-labelledby="quick-links-title"
        >
          <div className="flex min-h-11 items-center gap-2">
            <Icon
              name="quick_reference"
              className="shrink-0 text-[22px] text-secondary"
            />
            <h2
              id="quick-links-title"
              className="font-headline-md text-headline-md text-primary"
            >
              Quick Links &amp; Actions
            </h2>
          </div>
          <ul className="flex flex-col gap-3.5 rounded-2xl bg-white p-4 shadow-sm sm:p-6">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link
                  prefetch={false}
                  href={item.href}
                  className="group flex w-full items-center justify-between gap-3 rounded-lg bg-surface-container-low p-3.5 text-primary transition-colors hover:bg-secondary hover:text-white"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon
                      name={item.icon}
                      className="shrink-0 text-[20px] text-secondary group-hover:text-white"
                    />
                    <div className="min-w-0">
                      <span className="block text-title-sm font-semibold">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-[11px] text-on-surface-variant group-hover:text-white">
                        {item.description}
                      </span>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="shrink-0 text-[18px]" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="rounded-xl bg-primary-dark p-6 text-white">
            <div className="mb-3 flex items-center gap-2 text-tertiary-fixed-dim">
              <Icon name="support_agent" />
              <span className="font-label-mono-isbn text-[11px]">
                SECRETARIAT HELP DESK
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm">
              Need assistance with your registration or abstract?
            </h3>
            <p className="mt-3 text-body-sm text-surface-variant">
              Reach out directly to the Society Secretariat via email:
            </p>
            <a
              className="mt-4 inline-flex min-h-11 max-w-full items-center gap-2 text-body-sm font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
              href={`mailto:${society.email}`}
            >
              <Icon name="mail" className="shrink-0 text-[18px]" />
              <span className="break-all">{society.email}</span>
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
}
