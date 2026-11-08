import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import { SupportShell } from "../../components/aeetds/support/shared";
import PoliciesPageContent from "../../components/aeetds/support/policies-page";
export const metadata: Metadata = pageMetadata(
  "/policies",
  "Policies | AEETDS",
  "AEETDS privacy, terms of use, refund and cancellation, publication ethics and disclaimer policies.",
);
export default function PoliciesPage() {
  return (
    <SupportShell page="policies">
      <PoliciesPageContent />
    </SupportShell>
  );
}
