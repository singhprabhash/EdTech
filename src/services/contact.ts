import {
  postSubmission,
  type SubmissionSecurity,
} from "./submission-transport";
import type { ContactErrors, ContactValues } from "../domain/contact";
export type ContactReceipt = { reference: string };
export type ContactResult =
  | { status: "unavailable"; message: string }
  | { status: "rejected"; message: string; fieldErrors?: ContactErrors }
  | { status: "accepted"; receipt: ContactReceipt };
export function isContactReceipt(value: unknown): value is ContactReceipt {
  return Boolean(
    value &&
    typeof value === "object" &&
    "reference" in value &&
    typeof value.reference === "string" &&
    /^AEETDS\/ENQUIRY\/\d{4}\/\d+$/.test(value.reference),
  );
}
export async function submitContact(
  values: ContactValues,
  security?: SubmissionSecurity,
): Promise<ContactResult> {
  if (security?.enabled)
    return (await postSubmission(
      "ENQUIRY",
      values,
      {},
      security,
    )) as ContactResult;
  return {
    status: "unavailable",
    message:
      "Your enquiry has not been sent. Online contact submission is awaiting integration. Your message remains in this page; you can email the Secretary directly.",
  };
}
