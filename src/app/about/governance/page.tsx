import { pageMetadata } from "../../../config/seo";
import {
  GovernanceInformationSection,
  GovernanceContactCTA,
} from "../../../components/aeetds/governance/information-and-contact";
import "./governance.css";
import type { Metadata } from "next";
import AboutLayout from "../../../components/aeetds/about/section-layout";
import AboutSectionHeader from "../../../components/aeetds/about/section-header";
import GovernanceStructure from "../../../components/aeetds/governance/structure";
import OfficeBearersSection from "../../../components/aeetds/governance/office-bearers";
import {
  OfficeBearerRoles,
  CommitteesSection,
} from "../../../components/aeetds/governance/roles-and-committees";
import { governanceIntroduction } from "../../../content/aeetds-governance";
import { society } from "../../../content/aeetds";
import { Icon } from "../../../components/aeetds/ui";

export const metadata: Metadata = pageMetadata(
  "/about/governance",
  "Governance & Executive Council | AEETDS",
  "Explore AEETDS governance, its General Body, Executive Council, office-bearer responsibilities and committees.",
);
export default function GovernancePage() {
  return (
    <AboutLayout
      currentPath="/about/governance"
      pageClassName="aeetds-governance"
    >
      <AboutSectionHeader
        title="Governance & Executive Council"
        breadcrumbLabel="Governance"
        eyebrowDetail={society.registration}
        eyebrow="INSTITUTIONAL STRUCTURE"
        introduction={governanceIntroduction}
        aside={
          <div className="flex items-start gap-3 rounded-xl bg-surface-container-low p-4">
            <Icon name="account_balance" className="shrink-0 text-secondary" />
            <div>
              <p className="text-title-sm text-primary">Registered Society</p>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Societies Registration Act XXI of 1860
              </p>
              <p className="mt-2 text-body-sm text-on-surface-variant">
                Lucknow, Uttar Pradesh
              </p>
            </div>
          </div>
        }
      />
      <GovernanceStructure />
      <OfficeBearersSection />
      <OfficeBearerRoles />
      <CommitteesSection />
      <GovernanceInformationSection />
      <GovernanceContactCTA />
    </AboutLayout>
  );
}
