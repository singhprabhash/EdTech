"use client";
import {
  useSubmissionSecurity,
  SubmissionSecurityFields,
} from "../submission-security";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  emptyMembershipDocuments,
  emptyMembershipValues,
  membershipSteps,
  stepFields,
  validateDocument,
  validateMembershipStep,
  type DocumentKind,
  type MembershipDocuments,
  type MembershipErrors,
  type MembershipValues,
} from "../../../domain/membership";
import {
  integrationNotice,
  membershipDeclaration,
} from "../../../content/aeetds-membership";
import {
  isMembershipReceipt,
  submitMembership,
} from "../../../services/membership";
import { useMembershipReceipt } from "./receipt-context";
import {
  MembershipDetailsStep,
  ApplicantDetailsStep,
  MembershipDocumentsStep,
  MembershipPaymentStep,
} from "./form-steps";
import MembershipReview from "./review";
import type { TextFieldName } from "./form-fields";
import { Icon } from "../ui";
import { society } from "../../../content/aeetds";

export default function MembershipApplicationForm({
  initialCategory = "",
}: {
  initialCategory?: string;
}) {
  const securityState = useSubmissionSecurity(true);
  const [values, setValues] = useState<MembershipValues>({
    ...emptyMembershipValues,
    category: initialCategory,
  });
  const [documents, setDocuments] = useState<MembershipDocuments>({
    ...emptyMembershipDocuments,
  });
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState<MembershipErrors>({});
  const [message, setMessage] = useState("");
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const errorSummary = useRef<HTMLDivElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);
  const submissionLock = useRef(false);
  const { setReceipt } = useMembershipReceipt();
  const router = useRouter();
  useEffect(() => {
    if (navigated.current) heading.current?.focus();
  }, [step]);
  useEffect(() => {
    if (validationAttempt > 0) errorSummary.current?.focus();
  }, [validationAttempt]);
  useEffect(() => {
    if (message) feedback.current?.focus();
  }, [message]);
  function goTo(next: number) {
    navigated.current = true;
    setErrors({});
    setMessage("");
    setStep(next);
    setFurthest((previous) => Math.max(previous, next));
  }
  function update(name: TextFieldName, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: undefined }));
    setMessage("");
    if (name === "category" && value !== "Student")
      setDocuments((previous) => ({ ...previous, studentProof: null }));
  }
  function selectFile(kind: DocumentKind, file: File) {
    const error = validateDocument(kind, file);
    setErrors((previous) => ({ ...previous, [kind]: error }));
    setDocuments((previous) => ({ ...previous, [kind]: error ? null : file }));
    setMessage("");
  }
  function removeFile(kind: DocumentKind) {
    setDocuments((previous) => ({ ...previous, [kind]: null }));
    setErrors((previous) => ({ ...previous, [kind]: undefined }));
  }
  function showErrors(validation: MembershipErrors) {
    setErrors(validation);
    if (Object.values(validation).some(Boolean))
      setValidationAttempt((previous) => previous + 1);
  }
  function next() {
    const validation = validateMembershipStep(step, values, documents);
    showErrors(validation);
    if (!Object.keys(validation).length) goTo(step + 1);
  }
  async function submit() {
    if (submissionLock.current) return;
    const allErrors = Object.assign(
      {},
      ...membershipSteps.map((_, index) =>
        validateMembershipStep(index, values, documents),
      ),
    ) as MembershipErrors;
    if (Object.keys(allErrors).length) {
      const invalidStep = stepFields.findIndex((fields) =>
        fields.some((field) => allErrors[field]),
      );
      goTo(Math.max(0, invalidStep));
      showErrors(allErrors);
      return;
    }
    submissionLock.current = true;
    setSubmitting(true);
    setMessage("");
    setReceipt(null);
    try {
      const result = await submitMembership(
        {
          values: { ...values },
          documents: {
            ...documents,
            studentProof:
              values.category === "Student" ? documents.studentProof : null,
          },
        },
        securityState.security,
      );
      if (result.status === "accepted") {
        if (!isMembershipReceipt(result.receipt)) {
          setMessage(
            "The submission response could not be verified. No acknowledgement is available. Please contact the Secretary before trying again.",
          );
          return;
        }
        setReceipt(result.receipt);
        router.push("/membership/acknowledgement");
      } else {
        setMessage(result.message);
        if (result.status === "rejected" && result.fieldErrors) {
          const invalidStep = stepFields.findIndex((fields) =>
            fields.some((field) => result.fieldErrors?.[field]),
          );
          if (invalidStep >= 0) {
            goTo(invalidStep);
            showErrors(result.fieldErrors);
            setMessage(result.message);
          }
        }
      }
    } catch {
      setMessage(
        "Submission could not be confirmed. Your entries are still available. Please try again or contact the Secretary.",
      );
    } finally {
      securityState.reset();
      submissionLock.current = false;
      setSubmitting(false);
    }
  }
  const fieldProps = { values, errors, update };
  const uploadProps = { documents, selectFile, removeFile };
  const visibleErrors = Object.entries(errors).filter(([, error]) =>
    Boolean(error),
  );
  return (
    <>
      <div className="membership-progress">
        <div className="aeetds-container">
          <p className="mb-4 text-label-md text-on-surface-variant">
            APPLICATION PROGRESS · STEP {step + 1} OF {membershipSteps.length}
          </p>
          <ol aria-label="Application progress" className="membership-stepper">
            {membershipSteps.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? "step" : undefined}
              >
                <button
                  type="button"
                  disabled={index > furthest || submitting}
                  onClick={() => {
                    if (index < step) goTo(index);
                    else if (index > step) {
                      for (let current = 0; current < index; current++) {
                        const validation = validateMembershipStep(
                          current,
                          values,
                          documents,
                        );
                        if (Object.keys(validation).length) {
                          goTo(current);
                          showErrors(validation);
                          return;
                        }
                      }
                      goTo(index);
                    }
                  }}
                >
                  <span className="membership-step-marker">
                    {index < step ? (
                      <Icon name="check" className="text-[18px]" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="membership-section">
        <div className="aeetds-container grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <form
            noValidate
            aria-labelledby="membership-form-step-title"
            aria-busy={submitting}
            className="membership-form-card lg:col-span-8"
            onSubmit={(event) => {
              event.preventDefault();
              if (step < 4) next();
              else void submit();
            }}
          >
            <p className="mb-2 text-label-md text-secondary">
              STEP {step + 1} / {membershipSteps.length}
            </p>
            <h2
              ref={heading}
              tabIndex={-1}
              id="membership-form-step-title"
              className="mb-2 font-headline-md text-headline-md"
            >
              {membershipSteps[step]}
            </h2>
            <p className="mb-6 text-body-sm text-on-surface-variant">
              All fields marked * are required.
            </p>
            {visibleErrors.length > 0 && (
              <div
                ref={errorSummary}
                role="alert"
                tabIndex={-1}
                className="membership-error-summary mb-6"
              >
                <p className="font-semibold">
                  Please correct the following before continuing:
                </p>
                <ul className="mt-2 list-inside list-disc">
                  {visibleErrors.map(([key, error]) => (
                    <li key={key}>
                      {stepFields[step].includes(
                        key as keyof MembershipErrors,
                      ) ? (
                        <a href={`#membership-${key}`} className="underline">
                          {error}
                        </a>
                      ) : (
                        error
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <fieldset disabled={submitting} className="min-w-0">
              <legend className="sr-only">{membershipSteps[step]}</legend>
              {step === 0 && <MembershipDetailsStep {...fieldProps} />}
              {step === 1 && <ApplicantDetailsStep {...fieldProps} />}
              {step === 2 && (
                <MembershipDocumentsStep {...fieldProps} {...uploadProps} />
              )}
              {step === 3 && (
                <MembershipPaymentStep {...fieldProps} {...uploadProps} />
              )}
              {step === 4 && (
                <>
                  <MembershipReview
                    values={values}
                    documents={documents}
                    edit={goTo}
                  />
                  <div className="membership-declaration mt-5">
                    <label
                      htmlFor="membership-declaration"
                      className="flex items-start gap-3"
                    >
                      <input
                        id="membership-declaration"
                        type="checkbox"
                        required
                        checked={values.declaration}
                        aria-invalid={errors.declaration ? true : undefined}
                        aria-describedby={
                          errors.declaration
                            ? "membership-declaration-error"
                            : undefined
                        }
                        onChange={(event) => {
                          setValues((previous) => ({
                            ...previous,
                            declaration: event.target.checked,
                          }));
                          setErrors((previous) => ({
                            ...previous,
                            declaration: undefined,
                          }));
                        }}
                      />
                      <span>
                        {membershipDeclaration}{" "}
                        <span aria-hidden="true">*</span>
                      </span>
                    </label>
                    {errors.declaration && (
                      <p
                        id="membership-declaration-error"
                        className="membership-error"
                      >
                        {errors.declaration}
                      </p>
                    )}
                  </div>
                  <p className="mt-4 text-body-sm text-on-surface-variant">
                    {securityState.security.enabled
                      ? "Your application will be stored before a reference is issued. Email delivery may be pending."
                      : "Online submission is pending integration. Submitting this review will not send an application."}
                  </p>
                </>
              )}
            </fieldset>
            {message && (
              <div
                ref={feedback}
                role="alert"
                tabIndex={-1}
                className="membership-note mt-5"
              >
                {message}
              </div>
            )}
            <div className="membership-form-actions mt-7 border-t border-surface-container pt-5">
              {step > 0 && (
                <button
                  type="button"
                  disabled={submitting}
                  className="membership-button membership-button-light"
                  onClick={() => goTo(step - 1)}
                >
                  <Icon name="arrow_back" className="text-[18px]" />
                  Previous
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="membership-button membership-button-navy"
              >
                {submitting
                  ? "Submitting…"
                  : step === 4
                    ? "Submit Application"
                    : "Next"}
                <Icon
                  name={submitting ? "hourglass_top" : "arrow_forward"}
                  className="shrink-0 text-[18px]"
                />
              </button>
            </div>
            <SubmissionSecurityFields state={securityState} />
          </form>
          <aside className="space-y-5 lg:col-span-4">
            <div className="membership-note">
              <h2 className="mb-2 text-title-sm">
                Submission integration pending
              </h2>
              <p>
                {securityState.security.enabled
                  ? "Online submission is available. Your application and documents are saved before a reference is issued. Email acknowledgement may be pending."
                  : integrationNotice}
              </p>
            </div>
            <div className="membership-form-card">
              <h2 className="mb-3 text-title-sm">Before you begin</h2>
              <ul className="list-inside list-disc space-y-3 text-on-surface-variant">
                <li>Photograph: JPG/PNG, maximum 1 MB.</li>
                <li>Student proof, if applicable: PDF/JPG, maximum 2 MB.</li>
                <li>Payment receipt: PDF/JPG, maximum 2 MB.</li>
              </ul>
            </div>
            <div className="membership-dark rounded-xl bg-primary-dark p-6 text-white">
              <h2 className="mb-3 font-headline-sm text-headline-sm">
                Need Assistance?
              </h2>
              <p className="mb-3 text-surface-variant">
                For membership or official payment guidance, contact the Society
                Secretariat.
              </p>
              <a
                className="membership-email-link"
                href={`mailto:${society.email}`}
              >
                {society.email}
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
