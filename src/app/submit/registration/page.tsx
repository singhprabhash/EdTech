import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import RegistrationPageContent from "../../../components/aeetds/resources/registration-page";
export const metadata: Metadata = pageMetadata(
  "/submit/registration",
  "Registration & Payment | AEETDS",
  "CRAFNS-2026 fee availability, sponsorship, payment-verification notice and registration form preparation. Online submission is pending.",
);
export default function RegistrationPage() {
  return <RegistrationPageContent />;
}
