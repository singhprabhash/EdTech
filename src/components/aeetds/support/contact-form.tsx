"use client";
import {
  useSubmissionSecurity,
  SubmissionSecurityFields,
} from "../submission-security";
import { useEffect, useRef, useState } from "react";
import {
  contactCategories,
  emptyContactValues,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "../../../domain/contact";
import {
  isContactReceipt,
  submitContact,
  type ContactReceipt,
} from "../../../services/contact";
import { society } from "../../../content/aeetds";
import { Icon } from "../ui";
export default function ContactForm() {
  const securityState = useSubmissionSecurity(false);
  const [values, setValues] = useState({ ...emptyContactValues });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [receipt, setReceipt] = useState<ContactReceipt | null>(null);
  const lock = useRef(false);
  const summary = useRef<HTMLDivElement>(null);
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (attempt) summary.current?.focus();
  }, [attempt]);
  useEffect(() => {
    if (feedback) status.current?.focus();
  }, [feedback]);
  function update(key: keyof ContactValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
    setFeedback("");
  }
  function showErrors(next: ContactErrors) {
    setErrors(next);
    if (Object.values(next).some(Boolean))
      setAttempt((previous) => previous + 1);
  }
  async function submit() {
    if (lock.current || receipt) return;
    const validation = validateContact(values);
    showErrors(validation);
    if (Object.keys(validation).length) return;
    lock.current = true;
    setLoading(true);
    setFeedback("");
    try {
      const cleaned = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value.trim()]),
      ) as ContactValues;
      const result = await submitContact(cleaned, securityState.security);
      if (result.status === "accepted") {
        if (isContactReceipt(result.receipt)) {
          setReceipt(result.receipt);
          setFeedback(
            "Your enquiry has been received. Email acknowledgement delivery is a separate step.",
          );
        } else
          setFeedback(
            "The response could not be verified. No confirmed enquiry receipt is available. Please contact the Secretary by email.",
          );
      } else {
        setFeedback(result.message);
        if (result.status === "rejected" && result.fieldErrors)
          showErrors(result.fieldErrors);
      }
    } catch {
      setFeedback(
        "Your enquiry could not be confirmed. Your message remains available. Please try again or email the Secretary directly.",
      );
    } finally {
      securityState.reset();
      lock.current = false;
      setLoading(false);
    }
  }
  function field(
    key: keyof ContactValues,
    label: string,
    type = "text",
    required = true,
  ) {
    return (
      <div className="support-field">
        <label htmlFor={`contact-${key}`}>
          {label}
          {required ? " *" : " (optional)"}
        </label>
        <input
          id={`contact-${key}`}
          name={key}
          type={type}
          required={required}
          value={values[key]}
          autoComplete={
            key === "fullName"
              ? "name"
              : key === "phone"
                ? "tel"
                : key === "email"
                  ? "email"
                  : undefined
          }
          maxLength={key === "fullName" ? 200 : key === "email" ? 254 : 40}
          onChange={(event) => update(key, event.target.value)}
          aria-invalid={errors[key] ? true : undefined}
          aria-describedby={errors[key] ? `contact-${key}-error` : undefined}
        />
        {errors[key] && (
          <p id={`contact-${key}-error`} className="support-field-error">
            {errors[key]}
          </p>
        )}
      </div>
    );
  }
  return (
    <section
      className="support-form-panel"
      aria-labelledby="contact-form-title"
    >
      <div className="support-form-header">
        <p className="support-label">OFFICIAL COMMUNICATION FORM</p>
        <h2 id="contact-form-title" className="support-section-heading">
          Institutional Inquiry Dossier
        </h2>
        <p>
          Send your questions, suggestions and proposals for collaboration to
          the Secretary&apos;s office.
        </p>
      </div>
      <form
        noValidate
        aria-labelledby="contact-form-title"
        aria-busy={loading}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <p className="support-form-note">
          Fields marked * are required.{" "}
          {securityState.security.enabled ? (
            "Your enquiry will be saved before a reference is issued. Email acknowledgement may be pending."
          ) : (
            <>
              Online submission is not yet available. This form will not send
              your enquiry; you can{" "}
              <a href={`mailto:${society.email}`}>email the Secretary</a>{" "}
              directly. Your entries remain only in this page and are cleared on
              leaving or reloading.
            </>
          )}
        </p>
        {Object.values(errors).some(Boolean) && (
          <div
            ref={summary}
            tabIndex={-1}
            role="alert"
            aria-label="Contact form errors"
            className="support-error-summary"
          >
            <h3>Please correct the following:</h3>
            <ul>
              {Object.entries(errors)
                .filter(([, error]) => error)
                .map(([key, error]) => (
                  <li key={key}>
                    <a href={`#contact-${key}`}>{error}</a>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <fieldset disabled={loading || Boolean(receipt)}>
          <legend className="sr-only">Enquiry details</legend>
          {field("fullName", "Full Name")}
          <div className="support-form-grid">
            {field("email", "Email Address", "email")}
            {field("phone", "Phone Number / WhatsApp", "tel", false)}
          </div>
          <div className="support-field">
            <label htmlFor="contact-subject">
              Subject / Enquiry Category *
            </label>
            <select
              id="contact-subject"
              required
              value={values.subject}
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={
                errors.subject ? "contact-subject-error" : undefined
              }
              onChange={(event) => update("subject", event.target.value)}
            >
              <option value="">Select an enquiry category</option>
              {contactCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {errors.subject && (
              <p id="contact-subject-error" className="support-field-error">
                {errors.subject}
              </p>
            )}
          </div>
          <div className="support-field">
            <div className="support-message-label">
              <label htmlFor="contact-message">Message *</label>
              <span id="contact-message-count">
                {values.message.length.toLocaleString("en-IN")} / 2,000
                characters
              </span>
            </div>
            <textarea
              id="contact-message"
              name="message"
              rows={8}
              required
              maxLength={2000}
              value={values.message}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={`contact-message-count${errors.message ? " contact-message-error" : ""}`}
              onChange={(event) => update("message", event.target.value)}
              placeholder="Please describe your enquiry or proposal."
            />
            {errors.message && (
              <p id="contact-message-error" className="support-field-error">
                {errors.message}
              </p>
            )}
          </div>
          <p className="support-inset">
            For information about personal data, read our{" "}
            <a href="/policies#privacy-policy">Privacy Policy</a>.
          </p>
        </fieldset>
        {feedback && (
          <div
            ref={status}
            tabIndex={-1}
            role="alert"
            aria-label="Contact submission status"
            className="support-form-note"
          >
            <p>{feedback}</p>
            {receipt && (
              <p className="mt-3 font-semibold">
                Enquiry reference: {receipt.reference}
              </p>
            )}
          </div>
        )}
        <div className="support-form-footer">
          <span>
            {securityState.security.enabled
              ? "AEETDS Secretariat"
              : "Online submission pending integration"}
          </span>
          <button
            type="submit"
            disabled={loading || Boolean(receipt)}
            className="support-submit"
          >
            {loading
              ? "Sending…"
              : receipt
                ? "Enquiry received"
                : "Send Message"}
            <Icon
              name={loading ? "hourglass_top" : "send"}
              className="text-[20px]"
            />
          </button>
        </div>
        <SubmissionSecurityFields state={securityState} />
      </form>
    </section>
  );
}
