import { SubmissionAvailability } from "../submission-security";
import Image from "next/image";
import {
  registrationIntroduction,
  registrationFeeRows,
  registrationInclusions,
  sponsorshipTiers,
  sponsorshipBenefits,
  advertisementFormats,
  registrationSteps,
  paymentPolicies,
} from "../../../content/aeetds-submission";
import { eventPhotos } from "../../../content/aeetds-events";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";
import RegistrationForm from "../registration/form";
import { ResourceBreadcrumb, ResourceHero, ResourceCTA } from "./shared";
export function PaymentDetailsPanel() {
  return (
    <section
      id="payment-information"
      className="resource-section bg-background"
      aria-labelledby="payment-details-title"
    >
      <div className="aeetds-container">
        <Eyebrow>PAYMENT INFORMATION</Eyebrow>
        <h2 id="payment-details-title" className="resource-heading mb-5">
          Payment Details &amp; Bank Transfer
        </h2>
        <div className="resource-notice mb-6">
          <strong>Bank instructions are pending Society verification.</strong>
          <p className="mt-2">
            The official content requires verification against the bank passbook
            before publication. Transfer coordinates are withheld until that
            verification is confirmed. Do not make a payment using this preview.
          </p>
        </div>
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <div className="resource-payment-pending lg:col-span-8">
            <h3 className="mb-5 flex items-center gap-2 text-title-md">
              <Icon
                name="account_balance"
                className="shrink-0 text-secondary"
              />
              Bank Payment Instructions
            </h3>
            <dl>
              {[
                "Account name",
                "Bank and branch",
                "Account number",
                "IFSC",
              ].map((label) => (
                <div key={label} className="resource-payment-row">
                  <dt>{label}</dt>
                  <dd>Withheld pending verification</dd>
                </div>
              ))}
            </dl>
            <a
              className="resource-inline-link mt-5"
              href={`mailto:${society.email}?subject=Verified%20Registration%20Payment%20Instructions`}
            >
              Request Verified Instructions
              <Icon name="arrow_forward" className="text-[18px]" />
            </a>
          </div>
          <aside className="resource-qr-pending lg:col-span-4">
            <Icon name="lock" className="mb-4 text-[40px] text-secondary" />
            <h3 className="mb-3 font-headline-sm text-headline-sm">
              UPI / QR Unavailable
            </h3>
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              No approved UPI identifier or QR image has been provided. There is
              no online payment gateway on this page.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
export default function RegistrationPageContent() {
  const photo = eventPhotos.ncfahs[0];
  return (
    <div className="aeetds-registration">
      <ResourceBreadcrumb
        title="Registration & Payment"
        parent={{ label: "Submit / Register", href: "/submit" }}
      />
      <ResourceHero
        title="Registration & Payment"
        eyebrow="CRAFNS-2026 / CONFERENCE PARTICIPATION"
        introduction={registrationIntroduction}
        aside={
          <aside className="resource-api-panel">
            <span className="resource-icon">
              <Icon name="event_note" />
            </span>
            <h2 className="mt-4 mb-3 text-title-sm">
              Registration Availability
            </h2>
            <p className="text-body-sm leading-relaxed text-on-surface-variant">
              CRAFNS-2026 registration fees will be announced by AEETDS. Bank
              instructions await official verification.{" "}
              <SubmissionAvailability
                upload
                available="You can submit an existing official receipt using the registration form."
                unavailable="Online submission is not yet available."
              />
            </p>
            <a
              className="resource-inline-link mt-4"
              href="#registration-process"
            >
              View Registration Process
              <Icon name="arrow_downward" className="text-[18px]" />
            </a>
          </aside>
        }
      />
      <section
        id="registration-fees"
        className="resource-section bg-white"
        aria-labelledby="registration-fees-title"
      >
        <div className="aeetds-container">
          <Eyebrow>PARTICIPATION CATEGORIES</Eyebrow>
          <h2 id="registration-fees-title" className="resource-heading mb-5">
            Participation Fee Comparison Matrix
          </h2>
          <div className="resource-table-frame">
            <table
              className="resource-fee-table"
              aria-label="CRAFNS-2026 registration fees"
            >
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Offline</th>
                  <th scope="col">Online</th>
                </tr>
              </thead>
              <tbody>
                {registrationFeeRows.map((row) => (
                  <tr key={row.category}>
                    <th scope="row">{row.category}</th>
                    <td>{row.offline}</td>
                    <td>{row.online}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="resource-notice mt-5">
            <strong>
              CRAFNS-2026 registration fees will be announced by AEETDS.
            </strong>
            <p className="mt-2">
              No current fee amount is confirmed. Historical 2025 fees are not
              used as 2026 prices.
            </p>
          </div>
        </div>
      </section>
      <section
        className="resource-section bg-background"
        aria-labelledby="registration-includes-title"
      >
        <div className="aeetds-container">
          <Eyebrow>CONFERENCE PARTICIPATION</Eyebrow>
          <h2
            id="registration-includes-title"
            className="resource-heading mb-6"
          >
            What Registration Includes
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {registrationInclusions.map((item) => (
              <li key={item.title} className="resource-rule-card">
                <span className="resource-icon">
                  <Icon name={item.icon} />
                </span>
                <h3 className="mt-4 mb-3 text-title-sm">{item.title}</h3>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
          <figure className="resource-registration-photo mt-6">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="100vw"
            />
            <figcaption>NCFAHS-2026 · {photo.caption}</figcaption>
          </figure>
        </div>
      </section>
      <section
        className="resource-section bg-white"
        aria-labelledby="sponsorship-title"
      >
        <div className="aeetds-container">
          <Eyebrow>INSTITUTIONAL SUPPORT</Eyebrow>
          <h2 id="sponsorship-title" className="resource-heading mb-5">
            Sponsorship &amp; Souvenir Advertisement
          </h2>
          <ul className="resource-sponsorship-grid">
            {sponsorshipTiers.map((tier, index) => (
              <li key={tier}>
                <Icon
                  name={
                    [
                      "diamond",
                      "workspace_premium",
                      "military_tech",
                      "stars",
                      "handshake",
                    ][index]
                  }
                  className="mb-3 text-secondary"
                />
                <h3 className="mb-3 font-headline-sm text-headline-sm">
                  {tier} Sponsor
                </h3>
                <p className="text-body-sm text-on-surface-variant">
                  Contribution
                </p>
                <p className="mt-1 font-semibold">To be announced</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="resource-rule-card">
              <h3 className="mb-4 text-title-md">Sponsorship Benefits</h3>
              <ul className="list-inside list-disc space-y-3 text-on-surface-variant">
                {sponsorshipBenefits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-body-sm text-on-surface-variant">
                Specific contributions and complimentary registrations by tier
                are to be announced.
              </p>
            </div>
            <div className="resource-rule-card">
              <h3 className="mb-4 text-title-md">
                Souvenir Advertisement Formats
              </h3>
              <ul className="list-inside list-disc space-y-3 text-on-surface-variant">
                {advertisementFormats.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <PaymentDetailsPanel />
      <section
        id="registration-process"
        className="resource-section bg-white"
        aria-labelledby="registration-process-title"
      >
        <div className="aeetds-container">
          <Eyebrow>REGISTRATION WORKFLOW</Eyebrow>
          <h2 id="registration-process-title" className="resource-heading mb-6">
            How to Complete Your Registration
          </h2>
          <ol className="resource-process">
            {registrationSteps.map((text, index) => (
              <li key={text}>
                <span className="resource-step-number">{index + 1}</span>
                <p>{text}</p>
              </li>
            ))}
          </ol>
          <div className="resource-notice mt-6">
            The workflow above applies when fees, payment instructions and
            submission are officially available. The form below is currently a
            preparation interface only.
          </div>
        </div>
      </section>
      <section
        className="resource-section bg-background"
        aria-labelledby="delegate-form-title"
      >
        <div className="aeetds-container">
          <div className="mx-auto mb-6 max-w-4xl">
            <Eyebrow>REGISTRATION APPLICATION</Eyebrow>
            <h2 id="delegate-form-title" className="resource-heading">
              Delegate Details &amp; Payment Reference
            </h2>
          </div>
          <RegistrationForm />
        </div>
      </section>
      <section
        className="resource-section bg-white"
        aria-labelledby="payment-policies-title"
      >
        <div className="aeetds-container">
          <Eyebrow>IMPORTANT INFORMATION</Eyebrow>
          <h2 id="payment-policies-title" className="resource-heading mb-6">
            Important Payment Policies
          </h2>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paymentPolicies.map((text, index) => (
              <li key={text} className="resource-rule-card">
                <span className="resource-icon">
                  <Icon
                    name={
                      ["policy", "swap_horiz", "mark_email_read", "article"][
                        index
                      ]
                    }
                  />
                </span>
                <p className="mt-4 leading-relaxed text-on-surface-variant">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ResourceCTA
        title="Questions About Registration or Payment?"
        text="For current fees, verified payment instructions and registration guidance, contact the Society Secretariat."
        subject="CRAFNS-2026 Registration and Payment Enquiry"
      >
        <Action href="/submit/guidelines" tone="light">
          Submission Guidelines
        </Action>
      </ResourceCTA>
    </div>
  );
}
