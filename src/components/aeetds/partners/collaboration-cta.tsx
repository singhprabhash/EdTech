import Link from "next/link";
import { collaborationInvitation } from "../../../content/aeetds-partners";
import { society } from "../../../content/aeetds";
import { Action, Eyebrow, Icon } from "../ui";

function SecretariatContactCard() {
  return (
    <aside
      className="partners-secretariat-card"
      aria-labelledby="partners-secretariat-title"
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <h3 id="partners-secretariat-title" className="text-title-sm">
          Society Secretariat
        </h3>
        <span className="font-label-mono-isbn text-[11px] text-tertiary-fixed-dim">
          AEETDS LUCKNOW
        </span>
      </div>
      <div className="space-y-4">
        <div className="partners-contact-row">
          <span className="partners-contact-icon">
            <Icon name="alternate_email" className="text-[18px]" />
          </span>
          <dl className="min-w-0">
            <dt className="mb-1 text-label-md text-surface-variant">
              Official Communication
            </dt>
            <dd>
              <Link
                prefetch={false}
                href={`mailto:${society.email}`}
                className="partners-contact-link"
              >
                {society.email}
              </Link>
            </dd>
          </dl>
        </div>
        <div className="partners-contact-row">
          <span className="partners-contact-icon">
            <Icon name="phone_in_talk" className="text-[18px]" />
          </span>
          <dl className="min-w-0">
            <dt className="mb-1 text-label-md text-surface-variant">
              Secretariat Helplines
            </dt>
            <dd className="flex flex-col items-start">
              {society.phones.map((phone) => (
                <Link
                  key={phone}
                  prefetch={false}
                  className="partners-contact-link"
                  href={`tel:${phone.replaceAll("-", "")}`}
                >
                  {phone}
                </Link>
              ))}
            </dd>
          </dl>
        </div>
        <div className="partners-contact-row">
          <span className="partners-contact-icon">
            <Icon name="place" className="text-[18px]" />
          </span>
          <dl className="min-w-0">
            <dt className="mb-2 text-label-md text-surface-variant">
              Central Secretariat
            </dt>
            <dd className="text-body-sm leading-relaxed">{society.location}</dd>
            <dd className="mt-2 font-label-mono-isbn text-[11px] text-surface-variant">
              REG NO: {society.registration}
            </dd>
          </dl>
        </div>
      </div>
    </aside>
  );
}

export default function CollaborationCTA() {
  return (
    <section
      className="about-section-block bg-surface-container-low/40"
      aria-labelledby="collaboration-invitation-title"
    >
      <div className="aeetds-container">
        <div className="partners-collaboration-panel">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <Eyebrow dark icon="add_business">
                PARTNERSHIP LIAISON &amp; SECRETARIAT DESK
              </Eyebrow>
              <h2
                id="collaboration-invitation-title"
                className="mt-2 mb-4 font-headline-lg text-headline-lg-mobile tracking-tight sm:text-headline-lg"
              >
                Institutional Alliances &amp; Collaborative Programs
              </h2>
              <p className="max-w-2xl font-body-lg text-body-lg leading-relaxed text-surface-variant">
                {collaborationInvitation}
              </p>
              <div className="partners-collaboration-actions mt-6">
                <Action href={`mailto:${society.email}`} icon="outgoing_mail">
                  Contact the Secretary
                </Action>
                <Link
                  prefetch={false}
                  href="/about/governance"
                  className="partners-governance-link"
                >
                  View Society Governance
                  <Icon name="arrow_forward" className="shrink-0 text-[18px]" />
                </Link>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-5">
              <SecretariatContactCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
