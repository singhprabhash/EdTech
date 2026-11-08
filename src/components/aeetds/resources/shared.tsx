import Link from "next/link";
import type { ReactNode } from "react";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
export function ResourceBreadcrumb({
  title,
  parent,
}: {
  title: string;
  parent?: { label: string; href: string };
}) {
  return (
    <div className="bg-surface-container-low">
      <nav
        aria-label="Breadcrumb"
        className="aeetds-container py-3 text-body-sm text-on-surface-variant"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              prefetch={false}
              href="/"
              className="inline-flex min-h-11 items-center gap-1"
            >
              <Icon name="home" className="text-[16px]" />
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {parent && (
            <>
              <li>
                <Link
                  prefetch={false}
                  href={parent.href}
                  className="inline-flex min-h-11 items-center"
                >
                  {parent.label}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li aria-current="page" className="font-semibold text-primary">
            {title}
          </li>
        </ol>
      </nav>
    </div>
  );
}
export function ResourceHero({
  title,
  eyebrow,
  introduction,
  aside,
}: {
  title: string;
  eyebrow: string;
  introduction: string;
  aside?: ReactNode;
}) {
  return (
    <section
      className="resource-section bg-background"
      aria-labelledby="resource-page-title"
    >
      <div
        className={`aeetds-container ${aside ? "grid grid-cols-1 items-center gap-8 lg:grid-cols-12" : ""}`}
      >
        <div className={aside ? "min-w-0 lg:col-span-8" : "min-w-0 max-w-4xl"}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 id="resource-page-title" className="resource-page-title mb-5">
            {title}
          </h1>
          <p className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            {introduction}
          </p>
        </div>
        {aside && <div className="min-w-0 lg:col-span-4">{aside}</div>}
      </div>
    </section>
  );
}
export function ResourceCTA({
  title,
  text,
  subject,
  children,
}: {
  title: string;
  text: string;
  subject: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="resource-section bg-surface-container-low"
      aria-labelledby="resource-contact-title"
    >
      <div className="aeetds-container">
        <div className="resource-contact resource-dark">
          <div className="min-w-0 max-w-3xl">
            <Eyebrow dark>AEETDS SECRETARIAT</Eyebrow>
            <h2
              id="resource-contact-title"
              className="resource-heading mb-4 text-white"
            >
              {title}
            </h2>
            <p className="font-body-lg text-body-lg leading-relaxed text-surface-variant">
              {text}
            </p>
            <div className="resource-actions mt-6">
              <Action
                href={`mailto:${society.email}?subject=${encodeURIComponent(subject)}`}
                icon="mail"
              >
                Contact the Secretary
              </Action>
              {children}
            </div>
          </div>
          <div className="resource-contact-note">
            <Icon
              name="account_balance"
              className="mb-3 text-tertiary-fixed-dim"
            />
            <p className="text-title-sm">AEETDS, Lucknow</p>
            <a href={`mailto:${society.email}`} className="resource-email">
              {society.email}
            </a>
            <p className="mt-2 text-body-sm text-surface-variant">
              {society.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
export function SpecificationTable({
  rows,
  label,
}: {
  rows: readonly { label: string; value: string }[];
  label: string;
}) {
  return (
    <div className="resource-table-frame">
      <table className="resource-spec-table" aria-label={label}>
        <thead>
          <tr>
            <th scope="col">Specification</th>
            <th scope="col">Requirement</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
