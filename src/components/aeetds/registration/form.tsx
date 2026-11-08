"use client";
import {
  useSubmissionSecurity,
  SubmissionSecurityFields,
} from "../submission-security";
import { useEffect, useRef, useState } from "react";
import {
  emptyRegistrationValues,
  registrationCategories,
  validateRegistration,
  validateRegistrationReceipt,
  type RegistrationErrors,
  type RegistrationValues,
} from "../../../domain/registration";
import {
  submitRegistration,
  isRegistrationReceipt,
  type RegistrationReceipt,
} from "../../../services/registration";
import { registrationPolicyAcknowledgement } from "../../../content/aeetds-submission";
import { Icon } from "../ui";
import RegistrationField, { type RegistrationTextKey } from "./form-field";
export default function RegistrationForm() {
  const securityState = useSubmissionSecurity(true);
  const [values, setValues] = useState<RegistrationValues>({
    ...emptyRegistrationValues,
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState<RegistrationReceipt | null>(null);
  const summary = useRef<HTMLDivElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const upload = useRef<HTMLInputElement>(null);
  const lock = useRef(false);
  useEffect(() => {
    if (attempt) summary.current?.focus();
  }, [attempt]);
  useEffect(() => {
    if (message) feedback.current?.focus();
  }, [message]);
  function update(name: RegistrationTextKey, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
      ...(name === "country" ? { otherCountry: undefined } : {}),
      ...(name === "accommodation"
        ? { arrivalDate: undefined, departureDate: undefined }
        : {}),
      ...(name === "member" ? { membershipNumber: undefined } : {}),
      ...(name === "presentation"
        ? { paperTitle: undefined, abstractReference: undefined }
        : {}),
      ...(name === "category" ? { mode: undefined } : {}),
    }));
    setMessage("");
  }
  function showErrors(next: RegistrationErrors) {
    setErrors(next);
    if (Object.values(next).some(Boolean)) setAttempt((value) => value + 1);
  }
  async function submit() {
    if (lock.current || accepted) return;
    const validation = validateRegistration(values, receipt);
    showErrors(validation);
    if (Object.keys(validation).length || !receipt) return;
    lock.current = true;
    setLoading(true);
    setMessage("");
    try {
      const result = await submitRegistration(
        {
          values: {
            ...values,
            membershipNumber:
              values.member === "Yes" ? values.membershipNumber : "",
            otherCountry:
              values.country === "Other country" ? values.otherCountry : "",
            arrivalDate:
              values.accommodation === "Yes" ? values.arrivalDate : "",
            departureDate:
              values.accommodation === "Yes" ? values.departureDate : "",
            paperTitle:
              values.presentation !== "Attending only" ? values.paperTitle : "",
            abstractReference:
              values.presentation !== "Attending only"
                ? values.abstractReference
                : "",
          },
          receipt,
        },
        securityState.security,
      );
      if (result.status === "accepted") {
        if (isRegistrationReceipt(result.receipt)) {
          setAccepted(result.receipt);
          setMessage(
            "Your registration application has been received. Payment verification is a separate step; submission alone does not confirm payment or email receipt delivery.",
          );
        } else
          setMessage(
            "The submission response could not be verified. No confirmed receipt is available. Contact the Secretary before trying again.",
          );
      } else {
        setMessage(result.message);
        if (result.status === "rejected" && result.fieldErrors)
          showErrors(result.fieldErrors);
      }
    } catch {
      setMessage(
        "Submission could not be confirmed. Your entered details and receipt are still available. Please try again or contact the Secretary.",
      );
    } finally {
      securityState.reset();
      lock.current = false;
      setLoading(false);
    }
  }
  const props = { values, errors, update };
  const shownErrors = Object.entries(errors).filter(([, error]) =>
    Boolean(error),
  );
  return (
    <form
      id="registration-form"
      noValidate
      aria-labelledby="registration-form-title"
      aria-busy={loading}
      className="registration-form"
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <div className="mb-6 border-b border-surface-container pb-5">
        <h3
          id="registration-form-title"
          className="font-headline-md text-headline-md"
        >
          Conference Registration Form
        </h3>
        <p className="mt-2 text-body-sm text-on-surface-variant">
          Fields marked * are required. Entries and selected files remain only
          in this page and are cleared when you leave or reload.
        </p>
      </div>
      <div className="resource-notice mb-6">
        <strong>
          {securityState.security.enabled
            ? "Online registration submission is available."
            : "Online submission is not yet available."}
        </strong>
        <p className="mt-2">
          {securityState.security.enabled ? (
            "Submit an existing official receipt with your details. Application receipt does not confirm payment; bank instructions and current fees still require official confirmation."
          ) : (
            <>
              You can prepare this form, but it will not send a registration or
              upload your receipt. Do not make a payment using this preview;
              fees and bank instructions await official confirmation.
            </>
          )}
        </p>
      </div>
      {shownErrors.length > 0 && (
        <div
          ref={summary}
          role="alert"
          aria-label="Registration form errors"
          tabIndex={-1}
          className="registration-error-summary mb-6"
        >
          <h4 className="mb-2 font-semibold">Please correct the following:</h4>
          <ul>
            {shownErrors.map(([key, error]) => (
              <li key={key}>
                <a href={`#registration-${key}`}>{error}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <fieldset disabled={loading || Boolean(accepted)} className="min-w-0">
        <legend className="sr-only">Registration details</legend>
        <div className="registration-form-section">
          <h4 className="registration-group-title">
            <span>A</span>Participant Details
          </h4>
          <div className="registration-fields-grid">
            <RegistrationField
              {...props}
              name="fullName"
              label="Full name (as on certificate)"
              required
              autoComplete="name"
            />
            <RegistrationField
              {...props}
              name="designation"
              label="Designation"
              required
              autoComplete="organization-title"
            />
            <div className="md:col-span-2">
              <RegistrationField
                {...props}
                name="institution"
                label="Institution / organisation"
                required
                autoComplete="organization"
              />
            </div>
            <RegistrationField
              {...props}
              name="mobile"
              label="Mobile (WhatsApp)"
              type="tel"
              required
              autoComplete="tel"
            />
            <RegistrationField
              {...props}
              name="email"
              label="Email"
              type="email"
              required
              autoComplete="email"
            />
            <RegistrationField
              {...props}
              name="country"
              label="Country / region"
              options={["India", "Other country"]}
              required
            />
            {values.country === "Other country" && (
              <RegistrationField
                {...props}
                name="otherCountry"
                label="Other country / region"
                required
              />
            )}
            <RegistrationField
              {...props}
              name="state"
              label="State / province / region"
              required
              autoComplete="address-level1"
            />
          </div>
        </div>
        <div className="registration-form-section">
          <h4 className="registration-group-title">
            <span>B</span>Category &amp; Participation
          </h4>
          <div className="registration-fields-grid">
            <RegistrationField
              {...props}
              name="category"
              label="Participant category"
              options={registrationCategories}
              required
            />
            <RegistrationField
              {...props}
              name="mode"
              label="Participation mode"
              options={["Offline", "Online"]}
              required
            />
            {["Corporate / Industry", "Accompanying Person"].includes(
              values.category,
            ) && (
              <p className="resource-notice md:col-span-2">
                Online participation is not applicable to this category.
              </p>
            )}
            <RegistrationField
              {...props}
              name="member"
              label="AEETDS member? (optional)"
              options={["Yes", "No"]}
            />
            {values.member === "Yes" && (
              <RegistrationField
                {...props}
                name="membershipNumber"
                label="Membership number (optional)"
              />
            )}
            <RegistrationField
              {...props}
              name="presentation"
              label="Presenting?"
              options={["Oral", "Poster", "Attending only"]}
              required
            />
          </div>
        </div>
        {values.presentation && values.presentation !== "Attending only" && (
          <div className="registration-form-section">
            <h4 className="registration-group-title">
              <span>C</span>Paper Details
            </h4>
            <div className="registration-fields-grid">
              <RegistrationField
                {...props}
                name="paperTitle"
                label="Paper title (optional)"
              />
              <RegistrationField
                {...props}
                name="abstractReference"
                label="Abstract reference number (if submitted)"
              />
            </div>
          </div>
        )}
        <div className="registration-form-section">
          <h4 className="registration-group-title">
            <span>D</span>Accommodation &amp; Preferences
          </h4>
          <div className="registration-fields-grid">
            <RegistrationField
              {...props}
              name="accommodation"
              label="Accommodation required? (optional)"
              options={["Yes", "No"]}
            />
            <RegistrationField
              {...props}
              name="diet"
              label="Dietary preference (optional)"
              options={["Veg", "Non-veg"]}
            />
            {values.accommodation === "Yes" && (
              <>
                <RegistrationField
                  {...props}
                  name="arrivalDate"
                  label="Arrival date (optional)"
                  type="date"
                />
                <RegistrationField
                  {...props}
                  name="departureDate"
                  label="Departure date (optional)"
                  type="date"
                />
                <p className="text-body-sm text-on-surface-variant md:col-span-2">
                  Accommodation is on payment and subject to availability.
                  Conference dates are not yet announced; dates may be left
                  unspecified. If providing dates, enter both arrival and
                  departure.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="registration-form-section">
          <h4 className="registration-group-title">
            <span>E</span>Payment Reference
          </h4>
          <p className="resource-notice mb-5">
            Enter payment information only from an existing official receipt.
            This section does not quote a fee, take a payment or verify a
            transfer.
          </p>
          <div className="registration-fields-grid">
            <RegistrationField
              {...props}
              name="amountPaid"
              label="Amount paid (as on receipt)"
              required
            />
            <RegistrationField
              {...props}
              name="utr"
              label="Payment transaction (UTR) number"
              required
            />
            <RegistrationField
              {...props}
              name="paymentDate"
              label="Payment date"
              type="date"
              required
            />
            <div className="registration-field md:col-span-2">
              <label htmlFor="registration-receipt">Payment receipt *</label>
              <p
                id="registration-receipt-help"
                className="mb-3 text-body-sm text-on-surface-variant"
              >
                PDF, JPG or PNG · Maximum 2 MB · Selected files are not uploaded
                while submission is unavailable.
              </p>
              <input
                ref={upload}
                id="registration-receipt"
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                aria-invalid={errors.receipt ? true : undefined}
                aria-describedby={`registration-receipt-help${errors.receipt ? " registration-receipt-error" : ""}${receipt ? " registration-selected-receipt" : ""}`}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    const error = validateRegistrationReceipt(file);
                    setReceipt(error ? null : file);
                    setErrors((previous) => ({ ...previous, receipt: error }));
                    setMessage("");
                  }
                  event.target.value = "";
                }}
              />
              {receipt && (
                <div className="mt-3">
                  <p
                    id="registration-selected-receipt"
                    className="resource-file-name"
                  >
                    <Icon
                      name="description"
                      className="shrink-0 text-[18px] text-secondary"
                    />
                    <span>{receipt.name}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="resource-text-button"
                      onClick={() => upload.current?.click()}
                    >
                      Replace receipt
                    </button>
                    <button
                      type="button"
                      className="resource-text-button"
                      onClick={() => {
                        setReceipt(null);
                        setErrors((previous) => ({
                          ...previous,
                          receipt: undefined,
                        }));
                      }}
                    >
                      Remove receipt
                    </button>
                  </div>
                </div>
              )}
              {errors.receipt && (
                <p
                  id="registration-receipt-error"
                  className="registration-error"
                >
                  {errors.receipt}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="resource-policy-ack">
          <label htmlFor="registration-policy">
            <input
              id="registration-policy"
              type="checkbox"
              required
              checked={values.policy}
              aria-invalid={errors.policy ? true : undefined}
              aria-describedby={
                errors.policy ? "registration-policy-error" : undefined
              }
              onChange={(event) => {
                setValues((previous) => ({
                  ...previous,
                  policy: event.target.checked,
                }));
                setErrors((previous) => ({ ...previous, policy: undefined }));
              }}
            />
            <span>{registrationPolicyAcknowledgement} *</span>
          </label>
          {errors.policy && (
            <p id="registration-policy-error" className="registration-error">
              {errors.policy}
            </p>
          )}
        </div>
      </fieldset>
      {message && (
        <div
          ref={feedback}
          tabIndex={-1}
          role="alert"
          aria-label="Registration submission status"
          className="resource-notice mt-5"
        >
          <p>{message}</p>
          {accepted && (
            <p className="mt-3 font-semibold">
              Application reference: {accepted.reference}
            </p>
          )}
        </div>
      )}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-surface-container pt-6">
        <p className="max-w-md text-body-sm text-on-surface-variant">
          {securityState.security.enabled
            ? "Receipt of an application does not confirm payment or email delivery."
            : "Submission is pending integration. No payment or email delivery is confirmed by this form."}
        </p>
        <button
          type="submit"
          disabled={loading || Boolean(accepted)}
          className="resource-button resource-button-navy"
        >
          {loading
            ? "Submitting…"
            : accepted
              ? "Application received"
              : "Submit Registration"}
          <Icon
            name={loading ? "hourglass_top" : "arrow_forward"}
            className="shrink-0 text-[18px]"
          />
        </button>
      </div>
      <SubmissionSecurityFields state={securityState} />
    </form>
  );
}
