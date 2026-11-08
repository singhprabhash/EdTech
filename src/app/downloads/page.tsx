import { pageMetadata } from "../../config/seo";
import ResourceShell from "../../components/aeetds/resources/shell";
import {
  ResourceBreadcrumb,
  ResourceHero,
} from "../../components/aeetds/resources/shared";
import Downloads from "../../components/aeetds/resources/downloads";
export const metadata = pageMetadata(
  "/downloads",
  "Downloads | AEETDS",
  "Official AEETDS documents and forms published by the Society Secretariat.",
);
export default function DownloadsPage() {
  return (
    <ResourceShell activePath="">
      <ResourceBreadcrumb title="Downloads" />
      <ResourceHero
        title="Downloads"
        eyebrow="SOCIETY DOCUMENTS"
        introduction="Official forms and documents made available by the AEETDS Secretariat."
      />
      <Downloads />
    </ResourceShell>
  );
}
