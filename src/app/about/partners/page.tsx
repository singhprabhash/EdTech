import { pageMetadata } from "../../../config/seo";
import "./partners.css";
import CollaborationCTA from "../../../components/aeetds/partners/collaboration-cta";
import type { Metadata } from "next";
import AboutLayout from "../../../components/aeetds/about/section-layout";
import AboutSectionHeader from "../../../components/aeetds/about/section-header";
import PartnersDirectory from "../../../components/aeetds/partners/directory";
import { partnersIntroduction } from "../../../content/aeetds-partners";
import { Icon } from "../../../components/aeetds/ui";

export const metadata: Metadata = pageMetadata(
  "/about/partners",
  "Partners and Collaborators | AEETDS",
  "Discover the institutions collaborating with AEETDS on conferences and programmes, and contact the Society about collaboration.",
);
export default function PartnersPage() {
  return (
    <AboutLayout currentPath="/about/partners" pageClassName="aeetds-partners">
      <AboutSectionHeader
        title="Partners and Collaborators"
        eyebrow="INSTITUTIONAL COLLABORATION"
        introduction={partnersIntroduction}
        aside={
          <div className="partners-hero-note flex items-start gap-3">
            <span className="partners-note-icon">
              <Icon name="hub" className="text-secondary" />
            </span>
            <div className="min-w-0">
              <p className="text-title-sm text-primary">
                Institutional Collaboration
              </p>
              <p className="mt-1 text-body-sm leading-relaxed text-on-surface-variant">
                AEETDS works with institutions on its conferences and
                programmes.
              </p>
            </div>
          </div>
        }
      />
      <PartnersDirectory />
      <CollaborationCTA />
    </AboutLayout>
  );
}
