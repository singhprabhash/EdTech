import {
  generalBody,
  executiveCouncil,
} from "../../../content/aeetds-governance";
import { Eyebrow, Icon } from "../ui";

function Highlights({ items }: { items: readonly string[] }) {
  return (
    <ul className="governance-highlights">
      {items.map((item) => (
        <li key={item}>
          <Icon
            name="check_circle"
            className="shrink-0 text-[16px] text-secondary"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function GovernanceStructure() {
  return (
    <section
      className="about-section-block bg-background"
      aria-labelledby="governance-structure-title"
    >
      <div className="aeetds-container">
        <div className="mb-6">
          <Eyebrow>SECTION A • GOVERNING BODIES</Eyebrow>
          <h2
            id="governance-structure-title"
            className="font-headline-md text-headline-md text-primary"
          >
            Apex Governing Organs
          </h2>
        </div>
        <div className="governance-organs grid grid-cols-1 gap-4 lg:grid-cols-12">
          <article className="governance-organ min-w-0 lg:col-span-5">
            <div>
              <span className="governance-body-label bg-surface-container text-primary">
                Society members
              </span>
              <h3 className="mt-4 mb-3 flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                <Icon
                  name="groups"
                  className="shrink-0 text-[26px] text-secondary"
                />
                General Body
              </h3>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {generalBody}
              </p>
            </div>
            <div className="mt-6 border-t border-surface-container pt-4">
              <p className="mb-3 font-label-mono-isbn text-[11px] tracking-wider text-primary">
                RESPONSIBILITIES
              </p>
              <Highlights
                items={[
                  "Annual report",
                  "Audited accounts",
                  "Auditor appointment",
                  "Special meetings",
                ]}
              />
            </div>
          </article>
          <figure
            className="governance-flow min-w-0 lg:col-span-2"
            role="img"
            aria-label="Policy decisions are taken by the Executive Council and approved by the General Body"
          >
            <figcaption className="font-label-mono-isbn text-[11px] font-bold tracking-wider text-primary">
              GOVERNANCE FLOW
            </figcaption>
            <span className="governance-flow-icon">
              <Icon name="balance" />
            </span>
            <span aria-hidden="true" className="governance-flow-line" />
            <div className="governance-flow-step">
              <span className="font-label-mono-isbn text-[10px] font-bold text-secondary">
                POLICY DECISIONS
              </span>
              <span className="text-body-sm font-semibold text-primary">
                Executive Council
              </span>
            </div>
            <Icon name="arrow_downward" className="text-secondary" />
            <div className="governance-flow-step">
              <span className="font-label-mono-isbn text-[10px] font-bold text-secondary">
                APPROVAL
              </span>
              <span className="text-body-sm font-semibold text-primary">
                General Body
              </span>
            </div>
            <span aria-hidden="true" className="governance-flow-line" />
            <span className="governance-flow-icon governance-flow-icon-light">
              <Icon name="gavel" />
            </span>
          </figure>
          <article className="governance-organ min-w-0 lg:col-span-5">
            <div>
              <span className="governance-body-label bg-primary text-white">
                Policy &amp; programmes
              </span>
              <h3 className="mt-4 mb-3 flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                <Icon
                  name="account_tree"
                  className="shrink-0 text-[26px] text-secondary"
                />
                Executive Council
              </h3>
              <p className="text-body-md leading-relaxed text-on-surface-variant">
                {executiveCouncil}
              </p>
            </div>
            <div className="mt-6 border-t border-surface-container pt-4">
              <p className="mb-3 font-label-mono-isbn text-[11px] tracking-wider text-primary">
                RESPONSIBILITIES
              </p>
              <Highlights
                items={[
                  "Society programmes",
                  "Affairs and property",
                  "Committees",
                  "Elected office bearers",
                ]}
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
