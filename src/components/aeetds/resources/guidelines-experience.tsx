"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  guidelinesSections,
  abstractSpecifications,
  summarySpecifications,
  oralSpecifications,
  posterSpecifications,
  posterMounting,
  authorChecklist,
} from "../../../content/aeetds-submission";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
import { SpecificationTable, ResourceCTA } from "./shared";
export default function GuidelinesExperience() {
  const content = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLElement>(null);
  const [offsets, setOffsets] = useState({ header: 150, dock: 70 });
  const [active, setActive] = useState("abstract");
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const header = document.querySelector(".aeetds-header");
    const observer = new ResizeObserver(() =>
      setOffsets((previous) => ({
        header: header
          ? Math.ceil(header.getBoundingClientRect().height)
          : previous.header,
        dock: dock.current
          ? Math.ceil(dock.current.getBoundingClientRect().height)
          : previous.dock,
      })),
    );
    if (header) observer.observe(header);
    if (dock.current) observer.observe(dock.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        const ordered = [...visible].sort(
          (a, b) =>
            a.getBoundingClientRect().top - b.getBoundingClientRect().top,
        );
        const atReadingEdge = ordered.filter(
          (element) =>
            element.getBoundingClientRect().top <=
            offsets.header + offsets.dock + 32,
        );
        const current = atReadingEdge.at(-1) ?? ordered[0];
        if (current) setActive(current.id);
      },
      {
        rootMargin: `-${offsets.header + offsets.dock + 16}px 0px -45% 0px`,
        threshold: 0,
      },
    );
    content.current
      ?.querySelectorAll("[data-guideline-section]")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [offsets]);
  return (
    <div
      ref={content}
      className="resource-guidelines-content"
      style={
        {
          "--resource-header-offset": `${offsets.header}px`,
          "--resource-dock-offset": `${offsets.dock}px`,
        } as CSSProperties
      }
    >
      <nav
        ref={dock}
        aria-label="Guidelines sections"
        className="resource-guidelines-dock"
      >
        <div className="aeetds-container">
          <div className="resource-guidelines-track">
            {guidelinesSections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                aria-current={active === item.id ? "location" : undefined}
              >
                <Icon name={item.icon} className="shrink-0 text-[18px]" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>
      <section
        id="abstract"
        data-guideline-section
        className="resource-section bg-white"
        aria-labelledby="abstract-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 01 / ABSTRACT SUBMISSION</Eyebrow>
          <h2 id="abstract-title" className="resource-heading mb-6">
            Abstract Specifications
          </h2>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <SpecificationTable
                rows={abstractSpecifications}
                label="Abstract requirements"
              />
            </div>
            <aside className="resource-guideline-note resource-dark lg:col-span-4">
              <Icon
                name="description"
                className="mb-4 text-[32px] text-tertiary-fixed-dim"
              />
              <h3 className="mb-4 font-headline-sm text-headline-sm">
                Prepare a Word Document
              </h3>
              <p className="text-surface-variant">
                Mention your theme and include author names, affiliations and
                the corresponding email.
              </p>
              <p className="mt-5 border-t border-white/15 pt-4 text-body-sm text-surface-variant">
                Required file name:
              </p>
              <p className="mt-2 break-all font-semibold">
                FirstAuthorSurname_Theme.docx
              </p>
            </aside>
          </div>
        </div>
      </section>
      <section
        id="extended-summary"
        data-guideline-section
        className="resource-section bg-background"
        aria-labelledby="summary-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 02 / EXTENDED SUMMARY</Eyebrow>
          <h2 id="summary-title" className="resource-heading mb-5">
            Extended Summary Guidelines
          </h2>
          <div className="resource-summary-layout">
            <div className="resource-summary-structure">
              <h3 className="mb-4 text-title-sm">Required Structure</h3>
              <ol className="space-y-3">
                {[
                  "Introduction & objectives — no heading",
                  "METHODOLOGY",
                  "RESULTS",
                  "CONCLUSION",
                  "REFERENCES — maximum two",
                ].map((text, index) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="resource-step-number">{index + 1}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="resource-summary-rules">
              <ul className="space-y-4">
                {summarySpecifications.map((text) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon
                      name="check_circle"
                      className="shrink-0 text-[20px] text-secondary"
                    />
                    <p>{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section
        id="oral"
        data-guideline-section
        className="resource-section bg-white"
        aria-labelledby="oral-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 03 / ORAL PRESENTATION</Eyebrow>
          <h2 id="oral-title" className="resource-heading mb-6">
            Oral Presentation Guidelines
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {oralSpecifications.map((item, index) => (
              <article key={item.title} className="resource-rule-card">
                <span className="resource-icon">
                  <Icon
                    name={
                      [
                        "timer",
                        "slideshow",
                        "account_balance",
                        "format_size",
                        "contrast",
                      ][index]
                    }
                  />
                </span>
                <h3 className="mt-4 mb-3 text-title-sm">{item.title}</h3>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
          <div className="resource-notice mt-6">
            Presentation timing follows the conference brochure. The typical
            7–12 minutes includes discussion; session chairs enforce the time.
          </div>
        </div>
      </section>
      <section
        id="poster"
        data-guideline-section
        className="resource-section bg-background"
        aria-labelledby="poster-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 04 / POSTER PRESENTATION</Eyebrow>
          <h2 id="poster-title" className="resource-heading mb-4">
            Poster Presentation Schematic
          </h2>
          <p className="mb-6 max-w-3xl text-on-surface-variant">
            Single sheet, portrait orientation: 90 cm wide × 120 cm high. The
            diagram is illustrative, not an official downloadable template.
          </p>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <PosterSchematic />
              <div className="resource-notice mt-5">
                <h3 className="mb-2 flex items-center gap-2 text-title-sm">
                  <Icon name="push_pin" className="shrink-0 text-[20px]" />
                  Mounting Instructions
                </h3>
                <p>{posterMounting}</p>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-6">
              <SpecificationTable
                rows={posterSpecifications}
                label="Poster requirements"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        id="checklist"
        data-guideline-section
        className="resource-section bg-white"
        aria-labelledby="checklist-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 05 / AUTHOR PREPARATION</Eyebrow>
          <h2 id="checklist-title" className="resource-heading mb-4">
            Submission Readiness Checklist
          </h2>
          <p className="mb-6 max-w-3xl text-on-surface-variant">
            Use this client-side preparation aid to review the instructions. It
            does not upload, submit or validate an actual manuscript.
          </p>
          <AuthorChecklist />
        </div>
      </section>
      <ResourceCTA
        title="Prepare Your Submission for Editorial Evaluation"
        text="For abstract, extended summary and manuscript submission guidance, contact the Secretariat. Online abstract and chapter upload forms are not yet available."
        subject="AEETDS Submission Guidelines Enquiry"
      >
        <Action href="/submit/registration" tone="light">
          Registration &amp; Payment
        </Action>
        <Action href="/publications" tone="light">
          Publications
        </Action>
      </ResourceCTA>
    </div>
  );
}
export function PosterSchematic() {
  return (
    <figure className="resource-poster-figure">
      <figcaption className="mb-4 text-body-sm font-semibold text-primary">
        Illustrative layout · 90 × 120 cm · Not a downloadable template
      </figcaption>
      <div
        className="resource-poster"
        role="img"
        aria-label="Illustrative portrait poster with logos top-left, Abstract ID and presenter photo top-right, title and author details, a two-column body and references footer"
      >
        <div className="resource-poster-top">
          <div className="flex flex-wrap items-center gap-2">
            <Image src="/aeetds/logo.png" alt="" width={40} height={37} />
            <span className="resource-poster-placeholder">Host logo</span>
          </div>
          <div className="text-right">
            <p>Abstract ID</p>
            <div className="resource-poster-placeholder mt-1">
              Presenter photo
            </div>
          </div>
        </div>
        <div className="resource-poster-title">
          <p>POSTER TITLE</p>
          <p className="mt-2 text-[13px] font-normal">
            <u>Presenter name</u> · Corresponding author*
          </p>
          <p className="mt-1 text-[12px] font-normal">
            Affiliations · Presenter email
          </p>
        </div>
        <div className="resource-poster-columns">
          <div>
            <section>
              <h3>INTRODUCTION</h3>
              <p>Introduction and research context</p>
            </section>
            <section>
              <h3>MATERIALS AND METHODS</h3>
              <p>Methods and study design</p>
            </section>
          </div>
          <div>
            <section>
              <h3>RESULTS AND DISCUSSION</h3>
              <div className="resource-poster-graph">
                Illustration / graph area
              </div>
            </section>
            <section>
              <h3>CONCLUSIONS</h3>
              <p>Key conclusions</p>
            </section>
          </div>
        </div>
        <div className="resource-poster-footer">
          REFERENCES &amp; ACKNOWLEDGEMENTS
        </div>
      </div>
    </figure>
  );
}
export function AuthorChecklist() {
  const [checked, setChecked] = useState<readonly boolean[]>(
    authorChecklist.map(() => false),
  );
  const count = checked.filter(Boolean).length;
  return (
    <div className="resource-checklist">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-surface-container pb-5">
        <div>
          <h3 className="mb-2 text-title-md">
            Author Pre-Flight Compliance Verification
          </h3>
          <p role="status" className="text-body-sm text-on-surface-variant">
            {count} of {authorChecklist.length} complete
          </p>
        </div>
        <button
          type="button"
          className="resource-text-button"
          onClick={() => setChecked(authorChecklist.map(() => false))}
        >
          Reset checklist
        </button>
      </div>
      <progress
        max={authorChecklist.length}
        value={count}
        aria-label="Preparation checklist progress"
      />
      <div className="mt-6 space-y-4">
        {authorChecklist.map((text, index) => (
          <label key={text} className="resource-checklist-item">
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={(event) =>
                setChecked((previous) =>
                  previous.map((value, item) =>
                    item === index ? event.target.checked : value,
                  ),
                )
              }
            />
            <span>{text}</span>
          </label>
        ))}
      </div>
      <p className="mt-6 text-body-sm text-on-surface-variant">
        {count === authorChecklist.length
          ? "Checklist complete. This is a preparation aid only; no manuscript has been submitted or validated."
          : "Check the applicable instructions before contacting the Secretariat or using an available submission form."}
      </p>
      <a
        className="resource-email mt-3 text-secondary"
        href={`mailto:${society.email}`}
      >
        {society.email}
      </a>
    </div>
  );
}
