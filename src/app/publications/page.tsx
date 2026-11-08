import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import ResourceShell from "../../components/aeetds/resources/shell";
import PublicationsPageContent from "../../components/aeetds/resources/publications-page";
export const metadata: Metadata = pageMetadata(
  "/publications",
  "Publications | AEETDS",
  "Explore conference Books of Abstracts, edited volumes, chapter guidance and the Society's forthcoming and planned publications.",
);
export default function PublicationsPage() {
  return (
    <ResourceShell activePath="/publications">
      <PublicationsPageContent />
    </ResourceShell>
  );
}
