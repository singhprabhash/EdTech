import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import { SupportShell } from "../../components/aeetds/support/shared";
import ContactPageContent from "../../components/aeetds/support/contact-page";
export const metadata: Metadata = pageMetadata(
  "/contact",
  "Contact Us | AEETDS",
  "Contact the AEETDS Secretary's office for membership, conferences, submissions and collaboration enquiries.",
);
export default function ContactPage() {
  return (
    <SupportShell page="contact">
      <ContactPageContent />
    </SupportShell>
  );
}
