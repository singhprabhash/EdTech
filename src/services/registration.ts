import {
  postSubmission,
  type SubmissionSecurity,
} from "./submission-transport";
import type {
  RegistrationErrors,
  RegistrationValues,
} from "../domain/registration";
export type RegistrationApplication = {
  values: RegistrationValues;
  receipt: File;
};
export type RegistrationReceipt = { reference: string; submittedAt?: string };
export type RegistrationResult =
  | { status: "unavailable"; message: string }
  | { status: "rejected"; message: string; fieldErrors?: RegistrationErrors }
  | { status: "accepted"; receipt: RegistrationReceipt };
export function isRegistrationReceipt(
  value: unknown,
): value is RegistrationReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Partial<RegistrationReceipt>;
  return (
    typeof receipt.reference === "string" &&
    /^AEETDS\/CONF-REG\/\d{4}\/\d+$/.test(receipt.reference) &&
    (receipt.submittedAt === undefined ||
      (typeof receipt.submittedAt === "string" &&
        Number.isFinite(Date.parse(receipt.submittedAt))))
  );
}
export async function submitRegistration(
  application: RegistrationApplication,
  security?: SubmissionSecurity,
): Promise<RegistrationResult> {
  if (security?.enabled)
    return (await postSubmission(
      "CONF-REG",
      application.values,
      { receipt: application.receipt },
      security,
    )) as RegistrationResult;
  return {
    status: "unavailable",
    message:
      "Your registration has not been sent. Online submission is awaiting integration. Your entered details and selected receipt remain available in this page.",
  };
}
