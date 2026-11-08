import { isPlainMailbox } from "../shared/email.mjs";
export const contactCategories = [
  "Membership",
  "Conference",
  "Awards",
  "Publications",
  "Payment",
  "Other",
] as const;
export type ContactValues = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};
export type ContactErrors = Partial<Record<keyof ContactValues, string>>;
export const emptyContactValues: ContactValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  else if (values.fullName.trim().length > 200)
    errors.fullName = "Keep your name within 200 characters.";
  if (
    !values.email.trim() ||
    values.email.trim().length > 254 ||
    !isPlainMailbox(values.email)
  )
    errors.email = "Enter a valid email address.";
  const phone = values.phone.trim();
  if (
    phone &&
    (!/^\+?[\d\s().-]+$/.test(phone) ||
      phone.replace(/\D/g, "").length < 8 ||
      phone.replace(/\D/g, "").length > 15 ||
      phone.length > 40)
  )
    errors.phone =
      "Enter a valid phone number with 8–15 digits, or leave it blank.";
  if (!contactCategories.some((category) => category === values.subject))
    errors.subject = "Select an enquiry category.";
  if (!values.message.trim()) errors.message = "Enter your message.";
  else if (values.message.length > 2000)
    errors.message = "Keep your message within 2,000 characters.";
  return errors;
}
