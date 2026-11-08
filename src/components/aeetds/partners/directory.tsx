import { partnerDirectory } from "../../../content/aeetds-partners";
import { Eyebrow, Icon } from "../ui";

type Partner = (typeof partnerDirectory)[number];

function PartnerCard({ partner, index }: { partner: Partner; index: number }) {
  return (
    <li className="partners-directory-card">
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="partners-identity-label">
            {partner.designation ?? partner.acronym}
          </span>
          <span className="font-label-mono-isbn text-[11px] text-on-surface-variant">
            #{String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="partners-institution-icon mb-3">
          <Icon name={partner.icon} className="text-[26px]" />
        </div>
        <h3 className="font-headline-sm text-headline-sm leading-tight text-primary">
          {partner.name}
        </h3>
        <p className="mt-3 flex items-start gap-1.5 text-body-sm font-medium text-secondary">
          <Icon name="location_on" className="shrink-0 text-[16px]" />
          <span>{partner.location}</span>
        </p>
        <p className="mt-3 text-body-md leading-relaxed text-on-surface-variant">
          {partner.designation
            ? "Publishing Partner of AEETDS."
            : "Institutional collaborator of AEETDS."}
        </p>
      </div>
      <div className="mt-6 flex items-center gap-1.5 border-t border-surface-container pt-3 text-body-sm text-on-surface-variant">
        <Icon
          name={partner.designation ? "auto_stories" : "handshake"}
          className="text-[16px] text-secondary"
        />
        <span>{partner.designation ?? "AEETDS collaborator"}</span>
      </div>
    </li>
  );
}

export default function PartnersDirectory() {
  return (
    <section
      className="about-section-block bg-background"
      aria-labelledby="partner-directory-title"
    >
      <div className="aeetds-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow>INSTITUTIONAL DIRECTORY</Eyebrow>
            <h2
              id="partner-directory-title"
              className="font-headline-md text-headline-md text-primary"
            >
              Affiliated Research &amp; Publishing Partners
            </h2>
          </div>
          <p className="partners-directory-count">
            <Icon
              name="format_list_bulleted"
              className="shrink-0 text-[18px] text-secondary"
            />
            <span>{partnerDirectory.length} Listed Collaborators</span>
          </p>
        </div>
        <ul
          aria-label="Collaborating institutions"
          className="partners-directory-grid grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {partnerDirectory.map((partner, index) => (
            <PartnerCard key={partner.name} partner={partner} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
