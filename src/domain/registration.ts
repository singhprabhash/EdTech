import { isPlainMailbox } from "../shared/email.mjs";
import { localDate } from "./membership";
export const registrationCategories = [
  "Scientists / Faculty / Professionals (India)",
  "Students / Research Scholars (India)",
  "Corporate / Industry",
  "International Participant",
  "International Student / Scholar",
  "Accompanying Person",
] as const;
export type RegistrationValues = {
  fullName: string;
  designation: string;
  institution: string;
  email: string;
  mobile: string;
  category: string;
  mode: string;
  country: string;
  otherCountry: string;
  state: string;
  member: string;
  membershipNumber: string;
  presentation: string;
  paperTitle: string;
  abstractReference: string;
  accommodation: string;
  arrivalDate: string;
  departureDate: string;
  diet: string;
  amountPaid: string;
  utr: string;
  paymentDate: string;
  policy: boolean;
};
export type RegistrationField = keyof RegistrationValues | "receipt";
export type RegistrationErrors = Partial<Record<RegistrationField, string>>;
export const emptyRegistrationValues: RegistrationValues = {
  fullName: "",
  designation: "",
  institution: "",
  email: "",
  mobile: "",
  category: "",
  mode: "",
  country: "",
  otherCountry: "",
  state: "",
  member: "",
  membershipNumber: "",
  presentation: "",
  paperTitle: "",
  abstractReference: "",
  accommodation: "",
  arrivalDate: "",
  departureDate: "",
  diet: "",
  amountPaid: "",
  utr: "",
  paymentDate: "",
  policy: false,
};

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function validateRegistrationReceipt(file: File): string | undefined {
  const extension = file.name.toLowerCase().split(".").pop();
  const expected =
    extension === "jpg" || extension === "jpeg"
      ? "image/jpeg"
      : extension === "png"
        ? "image/png"
        : extension === "pdf"
          ? "application/pdf"
          : undefined;
  if (!expected || file.type !== expected)
    return "Choose a PDF, JPG or PNG receipt.";
  if (file.size === 0) return "The receipt file is empty. Choose another file.";
  if (file.size > 2 * 1024 * 1024)
    return "The receipt must be 2 MB or smaller.";
}
export function validateRegistration(
  values: RegistrationValues,
  receipt: File | null,
  today = localDate(),
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  for (const [field, label] of [
    ["fullName", "Full name"],
    ["designation", "Designation"],
    ["institution", "Institution / organisation"],
    ["email", "Email"],
    ["mobile", "Mobile (WhatsApp)"],
    ["country", "Country / region"],
    ["state", "State / province / region"],
    ["utr", "UTR number"],
  ] as const) {
    if (!values[field].trim()) errors[field] = `${label} is required.`;
    else if (values[field].length > 250)
      errors[field] = `${label} is too long.`;
  }
  if (!(registrationCategories as readonly string[]).includes(values.category))
    errors.category = "Select a participant category.";
  if (!["Offline", "Online"].includes(values.mode))
    errors.mode = "Select a participation mode.";
  if (
    values.mode === "Online" &&
    ["Corporate / Industry", "Accompanying Person"].includes(values.category)
  )
    errors.mode = "Online participation is not applicable to this category.";
  if (!["Oral", "Poster", "Attending only"].includes(values.presentation))
    errors.presentation = "Select a presentation option.";
  if (values.email && !isPlainMailbox(values.email))
    errors.email = "Enter a valid email address.";
  if (
    values.mobile &&
    !/^\d{8,15}$/.test(values.mobile.replace(/[\s()+.-]/g, ""))
  )
    errors.mobile = "Enter a valid mobile number including country code.";
  if (!["India", "Other country"].includes(values.country))
    errors.country = "Select a country / region.";
  if (values.country === "Other country" && !values.otherCountry.trim())
    errors.otherCountry = "Enter your country / region.";
  if (
    values.accommodation === "Yes" &&
    (values.arrivalDate || values.departureDate)
  ) {
    if (!validDate(values.arrivalDate))
      errors.arrivalDate = "Enter a valid arrival date.";
    if (
      !validDate(values.departureDate) ||
      values.departureDate < values.arrivalDate
    )
      errors.departureDate =
        "Enter a valid departure date on or after arrival.";
  }
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(values.amountPaid) ||
    !Number.isFinite(Number(values.amountPaid)) ||
    Number(values.amountPaid) <= 0
  )
    errors.amountPaid =
      "Enter the positive amount shown on your existing receipt.";
  if (!validDate(values.paymentDate) || values.paymentDate > today)
    errors.paymentDate =
      "Enter a valid payment date that is not in the future.";
  const receiptError = receipt
    ? validateRegistrationReceipt(receipt)
    : "Payment receipt is required.";
  if (receiptError) errors.receipt = receiptError;
  if (!values.policy)
    errors.policy = "Acknowledge the registration and payment policies.";
  return errors;
}
