import {
  postSubmission,
  type SubmissionSecurity,
} from "./submission-transport";
import type {
  MembershipCategory,
  MembershipDocuments,
  MembershipErrors,
  MembershipValues,
} from "../domain/membership";
import { publicCategories } from "../domain/membership";
export type MembershipApplication = {
  values: MembershipValues;
  documents: MembershipDocuments;
};
export type MembershipReceipt = {
  reference: string;
  submittedAt?: string;
  category?: MembershipCategory;
  acknowledgementEmail: "sent" | "pending" | "failed";
};
export type MembershipSubmissionResult =
  | { status: "accepted"; receipt: MembershipReceipt }
  | { status: "rejected"; message: string; fieldErrors?: MembershipErrors }
  | { status: "unavailable"; message: string };
export function isMembershipReceipt(
  value: unknown,
): value is MembershipReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Partial<MembershipReceipt>;
  return (
    typeof receipt.reference === "string" &&
    /^AEETDS\/MEMBERSHIP\/\d{4}\/[1-9]\d*$/.test(receipt.reference) &&
    ["sent", "pending", "failed"].includes(
      receipt.acknowledgementEmail ?? "",
    ) &&
    (receipt.category === undefined ||
      publicCategories.includes(receipt.category)) &&
    (receipt.submittedAt === undefined ||
      (typeof receipt.submittedAt === "string" &&
        Number.isFinite(Date.parse(receipt.submittedAt))))
  );
}
// Integration boundary: replace with a validated server-backed adapter only after
// private persistence, mail delivery and spam protection are configured.
export async function submitMembership(
  application: MembershipApplication,
  security?: SubmissionSecurity,
): Promise<MembershipSubmissionResult> {
  if (security?.enabled)
    return (await postSubmission(
      "MEMBERSHIP",
      application.values,
      application.documents,
      security,
    )) as MembershipSubmissionResult;
  return {
    status: "unavailable",
    message:
      "Your application has not been sent. Online submission is awaiting integration. Your entries are still available here for review.",
  };
}
