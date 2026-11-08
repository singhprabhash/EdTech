"use client";
import { useState } from "react";
import { society } from "../../../content/aeetds";
import { membershipProcess } from "../../../content/aeetds-membership";
import {
  isMembershipReceipt,
  type MembershipReceipt,
} from "../../../services/membership";
import { Action, Eyebrow, Icon } from "../ui";
import { useMembershipReceipt } from "./receipt-context";
export function MembershipAcknowledgement({
  receipt,
}: {
  receipt: MembershipReceipt | null;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const confirmed = receipt && isMembershipReceipt(receipt) ? receipt : null;
  async function copy() {
    try {
      await navigator.clipboard.writeText(confirmed!.reference);
      setCopyStatus("Reference copied.");
    } catch {
      setCopyStatus(
        "Could not copy the reference. Select and copy it manually.",
      );
    }
  }
  return (
    <div className="membership-section">
      <div className="aeetds-container">
        <div>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="membership-form-card membership-ack-card lg:col-span-8">
              <div className="membership-ack-header mb-6">
                <span className="membership-ack-icon">
                  <Icon
                    name={confirmed ? "task_alt" : "info"}
                    className="text-[32px]"
                  />
                </span>
                <Eyebrow>
                  {confirmed
                    ? "MEMBERSHIP APPLICATION"
                    : "ACKNOWLEDGEMENT PREVIEW"}
                </Eyebrow>
                <h1 className="membership-heading mb-4">
                  {confirmed
                    ? "Application Submitted Successfully"
                    : "Application Acknowledgement"}
                </h1>
                <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
                  {confirmed
                    ? "Thank you for applying for membership with AEETDS. Your application has been received and will be reviewed by the Society."
                    : "No submitted application is available in this session. This is a design preview while online submission integration is pending."}
                </p>
              </div>

              {confirmed ? (
                <section
                  aria-labelledby="membership-reference-title"
                  className="membership-reference"
                >
                  <h2
                    id="membership-reference-title"
                    className="text-label-md text-secondary"
                  >
                    APPLICATION REFERENCE NUMBER
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="membership-reference-number">
                      {confirmed.reference}
                    </p>
                    <button
                      type="button"
                      className="membership-button membership-button-light"
                      onClick={() => void copy()}
                    >
                      <Icon name="content_copy" className="text-[18px]" />
                      Copy reference
                    </button>
                  </div>
                  <p role="status" className="mt-2 text-body-sm">
                    {copyStatus}
                  </p>
                  <dl className="mt-3 space-y-2">
                    {confirmed.category && (
                      <div>
                        <dt className="text-body-sm text-on-surface-variant">
                          Membership category
                        </dt>
                        <dd className="font-semibold">{confirmed.category}</dd>
                      </div>
                    )}
                    {confirmed.submittedAt && (
                      <div>
                        <dt className="text-body-sm text-on-surface-variant">
                          Submitted date
                        </dt>
                        <dd>
                          <time dateTime={confirmed.submittedAt}>
                            {new Intl.DateTimeFormat("en-IN", {
                              dateStyle: "long",
                              timeZone: "Asia/Kolkata",
                            }).format(new Date(confirmed.submittedAt))}
                          </time>
                        </dd>
                      </div>
                    )}
                  </dl>
                  <p className="mt-4 text-body-sm">
                    {confirmed.acknowledgementEmail === "sent"
                      ? "The submission service confirmed that your acknowledgement email was sent."
                      : confirmed.acknowledgementEmail === "failed"
                        ? "Your application was received, but the acknowledgement email could not be delivered. Keep your reference and contact the Secretary."
                        : "Your application was received. Acknowledgement email delivery is pending confirmation."}
                  </p>
                </section>
              ) : (
                <div className="membership-note">
                  <h2 className="mb-2 text-title-sm">
                    Submission integration pending
                  </h2>
                  <p>
                    No application has been submitted through this preview. No
                    reference has been generated and no acknowledgement email
                    has been sent.
                  </p>
                  <p className="mt-3">
                    A submitted reference is shown here only after a confirmed
                    response. Returning directly or reloading clears the session
                    receipt.
                  </p>
                </div>
              )}
              <h2 className="mt-7 mb-5 font-headline-sm text-headline-sm">
                What Happens Next
              </h2>
              <p className="mb-5 text-on-surface-variant">
                {confirmed
                  ? "The Society's membership process:"
                  : "After online submission is connected and an application is received, the official process is:"}
              </p>
              <ol className="space-y-5">
                {[
                  membershipProcess[2],
                  "Verification by the Society.",
                  membershipProcess[3],
                ].map((text, index) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="membership-step-number shrink-0">
                      {index + 1}
                    </span>
                    <p>{text}</p>
                  </li>
                ))}
              </ol>
              <div className="membership-actions mt-7">
                <Action href="/membership" tone="navy">
                  Back to Membership Overview
                </Action>
                <Action href="/" tone="light" icon="home">
                  Return to Home
                </Action>
              </div>
            </div>
            <aside className="space-y-5 lg:col-span-4">
              <div className="membership-form-card">
                <Eyebrow>SECRETARIAT SUPPORT</Eyebrow>
                <h2 className="mb-3 font-headline-sm text-headline-sm">
                  Questions about Membership?
                </h2>
                <p className="mb-4 text-on-surface-variant">
                  Contact the Society Secretariat for assistance with your
                  application.
                </p>
                <a
                  className="membership-email-link"
                  href={`mailto:${society.email}`}
                >
                  {society.email}
                </a>
              </div>
              <div className="membership-dark rounded-xl bg-primary-dark p-6 text-white">
                <Icon
                  name="account_balance"
                  className="mb-3 text-tertiary-fixed-dim"
                />
                <h2 className="mb-3 text-title-sm">AEETDS • Lucknow</h2>
                <p className="text-surface-variant">{society.name}</p>
                <p className="mt-4 text-body-sm text-surface-variant">
                  REG NO: {society.registration}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function MembershipAcknowledgementScreen() {
  const { receipt } = useMembershipReceipt();
  return <MembershipAcknowledgement receipt={receipt} />;
}
