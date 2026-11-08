import Image from "next/image";
import {
  awardsIntroduction,
  nominationSteps,
  awardFees,
  awardRules,
} from "../../../content/aeetds-awards";
import { eventPhotos } from "../../../content/aeetds-events";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
import { ResourceBreadcrumb, ResourceHero, ResourceCTA } from "./shared";
import { AwardCatalogue, AwardeeDirectory } from "./award-catalogue";
export default function AwardsPageContent() {
  const photo = eventPhotos.ncfahs[2];
  return (
    <div className="aeetds-awards">
      <ResourceBreadcrumb title="Awards & Fellowship" />
      <ResourceHero
        title="Awards & Fellowship"
        eyebrow="SOCIETY AWARDS & RECOGNITION"
        introduction={awardsIntroduction}
        aside={
          <aside className="resource-api-panel">
            <span className="resource-icon">
              <Icon name="fact_check" />
            </span>
            <h2 className="mt-4 mb-3 font-headline-sm text-headline-sm">
              API Evaluation
            </h2>
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              Awards are decided on the basis of the nominee&apos;s Academic
              Performance Indicator (API) score by the Awards Committee.
            </p>
          </aside>
        }
      />
      <section
        className="resource-section bg-white"
        aria-label="AEETDS conference community"
      >
        <div className="aeetds-container">
          <figure className="resource-awards-photo">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
              priority
            />
            <figcaption>
              <Eyebrow dark>AEETDS CONFERENCE COMMUNITY</Eyebrow>
              <p className="font-headline-sm text-headline-sm">
                {photo.caption}
              </p>
              <p className="mt-2 text-body-sm">
                NCFAHS-2026 · This photograph documents the conference, not an
                award ceremony.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>
      <AwardCatalogue />
      <section
        id="nomination"
        className="resource-section bg-white"
        aria-labelledby="nomination-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 02 / NOMINATION PROCESS</Eyebrow>
          <h2 id="nomination-title" className="resource-heading mb-6">
            How to Nominate
          </h2>
          <ol className="resource-process resource-nomination-process">
            {nominationSteps.map((text, index) => (
              <li key={text}>
                <span className="resource-step-number">{index + 1}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="resource-notice mt-6">
            <h3 className="mb-2 text-title-sm">No payment at nomination</h3>
            <p>
              Pay the award contribution fee only after written confirmation of
              your award by email. The nomination deadline and current fee
              validity are awaiting confirmation.
            </p>
          </div>
          <div className="resource-actions mt-6">
            <Action
              href={`mailto:${society.email}?subject=Award%20Nomination%20Form%20Request`}
              tone="navy"
              icon="mail"
            >
              Request the Nomination Form
            </Action>
            <Action href="/submit/registration" tone="light">
              Registration &amp; Payment
            </Action>
          </div>
        </div>
      </section>
      <section
        className="resource-section bg-background"
        aria-labelledby="award-fees-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 03 / CONTRIBUTION FEES</Eyebrow>
          <h2 id="award-fees-title" className="resource-heading mb-4">
            Award Contribution Fees
          </h2>
          <div className="resource-notice mb-5">
            <strong>Pending confirmation of current validity.</strong>
            <p className="mt-2">
              The figures below are from the official content document. AEETDS
              must confirm that they are current before payment. Do not pay at
              nomination.
            </p>
          </div>
          <div className="resource-table-frame">
            <table
              className="resource-fee-table"
              aria-label="Award contribution fees pending confirmation"
            >
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Offline</th>
                  <th scope="col">Online</th>
                </tr>
              </thead>
              <tbody>
                {awardFees.map((row) => (
                  <tr key={row.category}>
                    <th scope="row">{row.category}</th>
                    <td>{row.offline}</td>
                    <td>{row.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section
        className="resource-section bg-white"
        aria-labelledby="award-rules-title"
      >
        <div className="aeetds-container">
          <Eyebrow>SECTION 04 / AWARD RULES</Eyebrow>
          <h2 id="award-rules-title" className="resource-heading mb-6">
            Official Award Rules &amp; Regulations
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {awardRules.map((rule, index) => (
              <li key={rule.title} className="resource-rule-card">
                <span className="resource-badge">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 mb-3 text-title-sm">{rule.title}</h3>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {rule.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <AwardeeDirectory />
      <ResourceCTA
        title="Recognising Excellence Across Agricultural Sciences"
        text="For the prescribed nomination form, current deadlines and official award guidance, contact the Society Secretariat."
        subject="AEETDS Award Nomination Enquiry"
      />
    </div>
  );
}
