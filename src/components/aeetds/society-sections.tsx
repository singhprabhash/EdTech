import Link from "next/link";
import {
  collaborators,
  initiatives,
  society,
  welcome,
} from "../../content/aeetds";
import { Eyebrow, Icon } from "./ui";

export function WelcomeSection() {
  return (
    <section
      className="aeetds-section bg-background"
      aria-labelledby="welcome-title"
    >
      <div className="aeetds-container grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Eyebrow>ABOUT THE SOCIETY</Eyebrow>
          <h2
            id="welcome-title"
            className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
          >
            Welcome to AEETDS
          </h2>
          <div className="space-y-4 text-body-md leading-relaxed">
            {welcome.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <Link
            prefetch={false}
            href="/about"
            className="inline-flex min-h-11 items-center gap-2 self-start text-title-sm font-semibold text-secondary hover:underline"
          >
            <span className="underline decoration-secondary/30 underline-offset-4">
              Read More About Us
            </span>
            <Icon name="arrow_forward" className="text-[18px]" />
          </Link>
        </div>
        <aside
          aria-labelledby="credential-title"
          className="relative flex min-w-0 flex-col gap-6 overflow-hidden rounded-2xl bg-white p-6 shadow-xl sm:p-8 lg:col-span-5"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-surface-container-high/40"
          />
          <div className="relative flex items-center gap-3 border-b border-surface-container pb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-container">
              <Icon name="balance" className="text-tertiary-fixed-dim" />
            </div>
            <div>
              <h3
                id="credential-title"
                className="text-title-sm font-bold text-primary"
              >
                Statutory Charter
              </h3>
              <p className="text-body-sm text-on-surface-variant">
                Societies Registration Act XXI of 1860
              </p>
            </div>
          </div>
          <dl className="relative space-y-4">
            {[
              {
                label: "OFFICIAL REGISTRATION NUMBER",
                value: society.registration,
              },
              { label: "HEADQUARTERS", value: society.location },
              {
                label: "SOCIETY",
                value: "Non-profit scientific and educational society",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2 rounded bg-surface-container-low p-3.5"
              >
                <dt className="font-label-mono-isbn text-[11px] text-on-surface-variant">
                  {item.label}
                </dt>
                <dd className="text-body-md font-medium text-primary">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

export function WhatWeDoSection() {
  return (
    <section
      className="aeetds-section bg-surface-container-low"
      aria-labelledby="initiatives-title"
    >
      <div className="aeetds-container flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow icon="hub">SOCIETAL INITIATIVES</Eyebrow>
            <h2
              id="initiatives-title"
              className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
            >
              What We Do
            </h2>
          </div>
          <p className="max-w-lg text-body-md text-on-surface-variant">
            Scientific exchange, research, farm entrepreneurship and skill
            development for the welfare of farmers and society.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {initiatives.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col justify-between rounded-xl bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded bg-surface-container text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon name={item.icon} className="text-[26px]" />
                </div>
                <h3 className="mb-2 font-headline-sm text-headline-sm text-primary">
                  {item.title}
                </h3>
                <p className="text-body-md leading-relaxed text-on-surface-variant">
                  {item.text}
                </p>
              </div>
              <Link
                prefetch={false}
                href={item.href}
                className="mt-4 inline-flex min-h-11 items-center gap-1 self-start pt-4 text-title-sm text-secondary hover:underline"
              >
                {item.link}
                <Icon name="arrow_forward" className="text-[16px]" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatisticsSection() {
  const metrics = [
    {
      label: "INTERNATIONAL REACH",
      value: "2",
      description: "International conferences organised",
      detail: "Third in preparation",
    },
    {
      label: "NATIONAL CONFERENCES",
      value: "1",
      description: "National conference organised at ICAR-CAFRI, Jhansi",
      detail: "NCFAHS-2026",
    },
    {
      label: "INSTITUTIONAL TIES",
      value: "8+",
      description: "Collaborating institutions",
      detail: "Research, education and publishing",
    },
  ];
  return (
    <section
      className="aeetds-section bg-primary-dark text-white"
      aria-labelledby="statistics-title"
    >
      <div className="aeetds-container flex flex-col gap-10">
        <div>
          <Eyebrow dark icon="analytics">
            SOCIETY IN NUMBERS
          </Eyebrow>
          <h2
            id="statistics-title"
            className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg"
          >
            AEETDS at a Glance
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {metrics.map((item) => (
            <div
              key={item.label}
              className="flex flex-col justify-between rounded-xl bg-primary-container p-6"
            >
              <p className="font-label-mono-isbn text-[11px] tracking-wider text-tertiary-fixed-dim">
                {item.label}
              </p>
              <p className="my-4 font-headline-lg text-[64px] leading-none">
                {item.value}
              </p>
              <p className="text-body-md text-surface-variant">
                {item.description}
              </p>
              <p className="mt-2 text-body-sm text-primary-fixed-dim">
                {item.detail}
              </p>
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-xl bg-primary-dark p-6 md:col-span-3 lg:col-span-1">
            <Eyebrow dark icon="groups">
              NCFAHS-2026
            </Eyebrow>
            <div className="my-3">
              <p className="font-headline-sm text-headline-sm">361 Delegates</p>
              <p className="mt-2 text-body-sm text-white">
                Representing 24 states, hosted at NCFAHS-2026, ICAR-CAFRI,
                Jhansi.
              </p>
            </div>
            <p className="border-t border-white/30 pt-3 text-[11px] text-white">
              15–16 July 2026 • Conference attendance
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CollaboratorsSection() {
  return (
    <section
      className="aeetds-section bg-background"
      aria-labelledby="collaborators-title"
    >
      <div className="aeetds-container flex flex-col gap-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center">
            <Eyebrow icon="account_balance">
              ACADEMIC &amp; RESEARCH ALLIANCES
            </Eyebrow>
          </div>
          <h2
            id="collaborators-title"
            className="font-headline-lg text-headline-lg-mobile text-primary sm:text-headline-lg"
          >
            Our Collaborators
          </h2>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Working together through conferences, scientific exchange and
            publications.
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collaborators.map((item) => (
            <li
              key={item.name}
              className="flex items-start gap-3.5 rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${item.category === "PUBLISHING PARTNER" ? "bg-primary text-white" : "bg-surface-container text-secondary"}`}
              >
                <Icon name={item.icon} className="text-[20px]" />
              </div>
              <div className="min-w-0">
                <p className="font-label-mono-isbn text-[10px] tracking-wider text-secondary">
                  {item.category}
                </p>
                <h3 className="mt-1 text-title-sm leading-snug font-semibold text-primary">
                  {item.name}
                </h3>
                <p className="mt-1 text-[12px] text-on-surface-variant">
                  {item.location}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
