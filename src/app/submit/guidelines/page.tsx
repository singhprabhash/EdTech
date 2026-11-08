import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import {
  ResourceBreadcrumb,
  ResourceHero,
} from "../../../components/aeetds/resources/shared";
import GuidelinesExperience from "../../../components/aeetds/resources/guidelines-experience";
export const metadata: Metadata = pageMetadata(
  "/submit/guidelines",
  "Submission Guidelines | AEETDS",
  "Official abstract, extended summary, oral presentation and poster specifications, with a preparation checklist.",
);
export default function GuidelinesPage() {
  return (
    <div className="aeetds-guidelines">
      <ResourceBreadcrumb
        title="Submission Guidelines"
        parent={{ label: "Submit / Register", href: "/submit" }}
      />
      <ResourceHero
        title="Submission Guidelines"
        eyebrow="AUTHOR & PRESENTER INSTRUCTIONS"
        introduction="Prepare your abstract, extended summary, oral presentation or poster using the Society's official formatting requirements and the current conference brochure."
      />
      <GuidelinesExperience />
    </div>
  );
}
