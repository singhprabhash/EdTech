import Image from "next/image";
import {
  membershipIntroduction,
  membershipCategories,
  membershipBenefits,
  membershipAudiences,
  membershipProcess,
} from "../../../content/aeetds-membership";
import { slides } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
import MembershipBreadcrumb from "./breadcrumb";

export default function MembershipOverview() {
  const image = slides[3];
  return (
    <>
      <MembershipBreadcrumb />
      <section
        className="membership-section bg-background"
        aria-labelledby="membership-title"
      >
        <div className="aeetds-container grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Eyebrow icon="badge">MEMBERSHIP</Eyebrow>
            <h1
              id="membership-title"
              className="membership-display mb-5 text-primary"
            >
              Become a Member of AEETDS
            </h1>
            <p className="max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
              {membershipIntroduction}
            </p>
            <div className="membership-actions mt-6">
              <Action href="/membership/apply" tone="navy" icon="arrow_forward">
                Apply for Membership
              </Action>
              <Action href="#categories" tone="light" icon="expand_more">
                Explore Membership Categories
              </Action>
            </div>
          </div>
          <figure className="membership-photo min-w-0 lg:col-span-5">
            <Image
              src={image.image}
              alt={image.alt}
              width={1000}
              height={750}
              className="aspect-[4/3] w-full rounded object-cover"
            />
            <figcaption className="mt-4 flex items-start gap-2 text-body-sm text-primary">
              <Icon name="groups" className="shrink-0 text-secondary" />
              <span>
                {image.caption}
                <span className="mt-1 block text-[11px] text-on-surface-variant">
                  {image.label}
                </span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>
      <MembershipCategoryGrid />
      <section
        className="membership-section bg-white"
        aria-labelledby="membership-benefits-title"
      >
        <div className="aeetds-container">
          <Eyebrow>MEMBERSHIP BENEFITS</Eyebrow>
          <h2
            id="membership-benefits-title"
            className="membership-heading mb-6"
          >
            A Community for Knowledge &amp; Collaboration
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {membershipBenefits.map((benefit) => (
              <li key={benefit.text} className="membership-benefit">
                <span className="membership-icon">
                  <Icon name={benefit.icon} />
                </span>
                <p>{benefit.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="membership-section bg-background"
        aria-labelledby="membership-audience-title"
      >
        <div className="aeetds-container">
          <Eyebrow>COMMUNITY SCOPE</Eyebrow>
          <h2
            id="membership-audience-title"
            className="membership-heading mb-6"
          >
            Who Should Join AEETDS?
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {membershipAudiences.map((audience) => (
              <li
                key={audience.name}
                className="flex items-center gap-3 rounded bg-surface-container-low p-4"
              >
                <Icon
                  name={audience.icon}
                  className="shrink-0 text-secondary"
                />
                <span className="font-semibold">{audience.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section
        className="membership-section bg-white"
        aria-labelledby="membership-process-title"
      >
        <div className="aeetds-container">
          <Eyebrow>APPLICATION PROCESS</Eyebrow>
          <h2 id="membership-process-title" className="membership-heading mb-6">
            How to Apply
          </h2>
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {membershipProcess.map((text, index) => (
              <li key={text} className="membership-process-card">
                <span className="membership-step-number">{index + 1}</span>
                <h3 className="mt-4 mb-2 text-title-sm">
                  {
                    [
                      "Complete the form",
                      "Payment and receipt",
                      "Acknowledgement",
                      "Verification and certificate",
                    ][index]
                  }
                </h3>
                <p className="text-on-surface-variant">{text}</p>
              </li>
            ))}
          </ol>
          <div className="membership-note mt-6">
            <p>
              Membership fees and bank details are awaiting confirmation. Online
              submission is not yet connected; no payment can be made through
              this website.
            </p>
          </div>
          <div className="mt-6">
            <Action href="/membership/apply" tone="navy">
              Apply for Membership
            </Action>
          </div>
        </div>
      </section>
      <section
        className="membership-section membership-dark bg-primary-dark text-white"
        aria-labelledby="membership-cta-title"
      >
        <div className="aeetds-container flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow dark>JOIN THE AEETDS COMMUNITY</Eyebrow>
            <h2
              id="membership-cta-title"
              className="membership-heading text-white"
            >
              Connect through Science, Enterprise &amp; Environment
            </h2>
          </div>
          <Action href="/membership/apply" icon="arrow_forward">
            Apply for Membership
          </Action>
        </div>
      </section>
    </>
  );
}
export function MembershipCategoryGrid() {
  return (
    <section
      id="categories"
      className="membership-section bg-surface-container-low/40"
      aria-labelledby="membership-categories-title"
    >
      <div className="aeetds-container">
        <Eyebrow>MEMBERSHIP CATEGORIES</Eyebrow>
        <h2
          id="membership-categories-title"
          className="membership-heading mb-3"
        >
          Find Your Membership Category
        </h2>
        <p className="mb-6 max-w-3xl text-on-surface-variant">
          Fee amounts and any admission fee are awaiting confirmation. Honorary
          membership is by invitation only.
        </p>
        <ul
          aria-label="Membership categories"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {membershipCategories.map((category) => (
            <li
              key={category.value}
              className={`membership-category ${category.value === "Honorary" ? "membership-category-honorary" : ""}`}
            >
              <span className="membership-icon">
                <Icon name={category.icon} />
              </span>
              <h3 className="mt-4 mb-2 font-headline-md text-headline-md">
                {category.name}
              </h3>
              <p className="text-on-surface-variant">{category.eligibility}</p>
              <dl className="my-5 space-y-3 border-y border-surface-container py-4">
                <div>
                  <dt className="text-label-md text-on-surface-variant">
                    FEE (INDIA)
                  </dt>
                  <dd className="mt-1 font-semibold">{category.india}</dd>
                </div>
                <div>
                  <dt className="text-label-md text-on-surface-variant">
                    FEE (FOREIGN)
                  </dt>
                  <dd className="mt-1 font-semibold">{category.foreign}</dd>
                </div>
              </dl>
              <div className="mt-auto">
                {category.value === "Honorary" ? (
                  <p className="flex min-h-11 items-center gap-2 font-semibold">
                    <Icon name="mail" className="text-secondary" />
                    Invitation only
                  </p>
                ) : (
                  <Action
                    href={`/membership/apply?category=${category.value}`}
                    tone="light"
                  >
                    Apply as {category.name}
                  </Action>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
