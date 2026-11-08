import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import ResourceShell from "../../components/aeetds/resources/shell";
import AwardsPageContent from "../../components/aeetds/resources/awards-page";
export const metadata: Metadata = pageMetadata(
  "/awards",
  "Awards & Fellowship | AEETDS",
  "Explore the eight Society award groups, nomination process, rules and contribution fees pending confirmation.",
);
export default function AwardsPage() {
  return (
    <ResourceShell activePath="/awards">
      <AwardsPageContent />
    </ResourceShell>
  );
}
