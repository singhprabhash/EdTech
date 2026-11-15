import Image from "next/image";
import {
  registrationIntroduction,
  registrationFeeRows,
  registrationInclusions,
  sponsorshipOptions,
  bankDetails,
  conferenceDeadlines,
  paymentDocument,
  registrationSteps,
  paymentPolicies,
} from "../../../content/aeetds-payment";
import { crafnsForms, eventPhotos } from "../../../content/aeetds-events";
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
        <p className="mb-6 text-on-surface-variant">
          Pay by bank transfer (NEFT / RTGS / IMPS) or UPI using the Society
          account below.
        </p>
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
              {bankDetails.map((item) => (
                <div key={item.label} className="resource-payment-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-body-sm leading-relaxed">
              After payment, email your transaction ID / UTR number, payment
              screenshot and registration form to {society.email}. Include your
              full name and participant category.
            </p>
          </div>
          <aside className="resource-qr-pending lg:col-span-4">
            <h3 className="mb-3 font-headline-sm text-headline-sm">
              Scan to Pay (UPI)
            </h3>
            <Image
              src="/aeetds/documents/crafns-2026-payment-qr.png"
              alt="Google Pay and PhonePe payment QR codes supplied by AEETDS for 7408206291"
              width={359}
              height={193}
              unoptimized
              className="h-auto w-full max-w-sm bg-white"
            />
            <p className="mt-4 text-body-sm leading-relaxed text-on-surface-variant">
              Google Pay / PhonePe at 7408206291. Payment confirmation is sent
              only after verification by the Society.
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
              Register for CRAFNS-2026 through the official Google Form after
              paying the applicable fee. Confirmation follows payment
              verification by the Society.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <Action href={crafnsForms.registration} icon="how_to_reg">
                Online Registration
              </Action>
              <Action
                href={paymentDocument.href}
                download={paymentDocument.filename}
                tone="light"
                icon="download"
              >
                Download Payment Details
              </Action>
            </div>
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
                  <th scope="col">On or before 30 Nov 2026</th>
                  <th scope="col">
                    Spot
                    <span className="sr-only sm:not-sr-only">
                      {" "}
                      Registration
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrationFeeRows.map((row) => (
                  <tr key={row.category}>
                    <th scope="row">{row.category}</th>
                    <td>{row.early}</td>
                    <td>{row.spot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-body-sm text-on-surface-variant">
            Online participation fees apply to all participant categories.
          </p>
          <h3 className="mt-8 mb-4 text-title-md">Important Dates</h3>
          <dl className="grid gap-3 md:grid-cols-2">
            {conferenceDeadlines.map((item) => (
              <div key={item.label} className="resource-rule-card">
                <dt className="text-on-surface-variant">{item.label}</dt>
                <dd className="mt-2 font-semibold">{item.date}</dd>
              </div>
            ))}
          </dl>
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
            Sponsorship &amp; Exhibition
          </h2>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sponsorshipOptions.map((option) => (
              <li key={option.title} className="resource-rule-card">
                <h3 className="mb-3 font-headline-sm text-headline-sm">
                  {option.title}
                </h3>
                <p className="mb-3 font-semibold text-primary">
                  {option.amount}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  {option.benefits}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-on-surface-variant">
            Customised sponsorship of conference kits, sessions, awards,
            lunch/dinner or the cultural evening is also welcome. Contact the
            Organising Secretaries for details.
          </p>
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
            Complete your registration through the official Google Form and
            upload your receipt there. The local preparation form below does not
            confirm registration or payment.
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
      <div className="aeetds-container events-actions my-6">
        <Action href={crafnsForms.registration}>
          Complete Online Registration
        </Action>
        <Action href={crafnsForms.abstractSubmission} tone="light">
          Abstract Submission
        </Action>
      </div>
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
                      [
                        "policy",
                        "swap_horiz",
                        "article",
                        "mark_email_read",
                        "info",
                      ][index]
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
        text="For payment or registration questions, contact the Society Secretariat."
        subject="CRAFNS-2026 Registration and Payment Enquiry"
      >
        <Action href="/submit/guidelines" tone="light">
          Submission Guidelines
        </Action>
      </ResourceCTA>
    </div>
  );
}
