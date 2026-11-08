import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import { SupportShell } from "../../../components/aeetds/support/shared";
import FaqPageContent from "../../../components/aeetds/support/faq-page";
export const metadata: Metadata = pageMetadata(
  "/contact/faqs",
  "Frequently Asked Questions | AEETDS",
  "Official answers about AEETDS membership, conferences, abstract submissions, awards, registration and publications.",
);
export default function FaqPage() {
  return (
    <SupportShell page="faqs">
      <FaqPageContent />
    </SupportShell>
  );
}
