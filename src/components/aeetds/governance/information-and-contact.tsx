import {
  committees,
  governanceIntroduction,
  officeRoles,
} from "../../../content/aeetds-governance";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";

export function GovernanceInformationSection() {
  const framework = governanceIntroduction.slice(
    0,
    governanceIntroduction.indexOf(".") + 1,
  );
  const secretary = officeRoles.find((role) => role.title === "Secretary")!;
  const records = secretary.text.slice(secretary.text.indexOf(". ") + 2);
  const finance = committees.find(
    (committee) => committee.name === "Finance Committee",
  )!;
  return (
    <section
      className="about-section-block bg-background"
      aria-labelledby="governance-information-title"
    >
      <div className="aeetds-container grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <aside className="governance-framework-card lg:col-span-5">
          <Eyebrow dark>GOVERNANCE FRAMEWORK</Eyebrow>
          <h3 className="mb-4 font-headline-sm text-headline-sm">
            Memorandum &amp; Rules
          </h3>
          <p className="text-body-sm leading-relaxed text-surface-variant">
            {framework}
          </p>
          <dl className="mt-6 space-y-3 border-t border-white/15 pt-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <dt className="font-label-mono-isbn text-[11px] text-primary-fixed-dim">
                POLICY DECISIONS
              </dt>
              <dd className="text-body-sm font-semibold">Executive Council</dd>
            </div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <dt className="font-label-mono-isbn text-[11px] text-primary-fixed-dim">
                APPROVAL
              </dt>
              <dd className="text-body-sm font-semibold">General Body</dd>
            </div>
          </dl>
        </aside>
        <div className="min-w-0 lg:col-span-7">
          <Eyebrow>OFFICIAL RESPONSIBILITIES</Eyebrow>
          <h2
            id="governance-information-title"
            className="mb-4 font-headline-md text-headline-md text-primary"
          >
            Governance Information
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <article className="governance-information-card">
              <Icon name="description" className="mb-3 text-secondary" />
              <h3 className="mb-2 text-title-sm text-primary">
                Secretary — Records and minutes
              </h3>
              <p className="text-body-sm leading-relaxed text-on-surface-variant">
                {records}
              </p>
            </article>
            <article className="governance-information-card">
              <Icon
                name="account_balance_wallet"
                className="mb-3 text-secondary"
              />
              <h3 className="mb-2 text-title-sm text-primary">
                Finance Committee
              </h3>
              <p className="text-body-sm leading-relaxed text-on-surface-variant">
                {finance.role}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GovernanceContactCTA() {
  return (
    <section
      className="about-section-block bg-surface-container-low"
      aria-labelledby="governance-contact-title"
    >
      <div className="aeetds-container">
        <div className="governance-contact-panel">
          <div className="flex min-w-0 items-start gap-4">
            <span className="governance-contact-icon">
              <Icon name="account_balance" className="text-secondary" />
            </span>
            <div className="min-w-0">
              <Eyebrow>GOVERNANCE ENQUIRIES</Eyebrow>
              <h2
                id="governance-contact-title"
                className="mb-2 font-headline-sm text-headline-sm text-primary"
              >
                Societies Registration Act XXI of 1860
              </h2>
              <p className="max-w-3xl text-body-sm leading-relaxed text-on-surface-variant">
                For official information about the Memorandum of Association,
                Rules &amp; Regulations, or governance-related enquiries, please
                reach out to the Society Secretariat.
              </p>
            </div>
          </div>
          <div className="governance-contact-actions">
            <Action href={`mailto:${society.email}`} tone="navy" icon="mail">
              Contact Secretariat
            </Action>
            <Action href="/about" tone="light">
              About AEETDS
              <Icon name="arrow_forward" className="text-[18px]" />
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}
