import {
  president,
  pendingPositions,
  unconfirmedSecretary,
} from "../../../content/aeetds-governance";
import { Eyebrow, Icon } from "../ui";

export default function OfficeBearersSection() {
  return (
    <section
      className="about-section-block bg-surface-container-low/60"
      aria-labelledby="office-bearers-title"
    >
      <div className="aeetds-container">
        <div className="mb-6">
          <Eyebrow>SECTION B • SECRETARIAT DIRECTORY</Eyebrow>
          <h2
            id="office-bearers-title"
            className="mb-2 font-headline-md text-headline-md text-primary"
          >
            Office Bearers
          </h2>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Official stewardship and executive leadership under constitutional
            mandate.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article aria-label="President" className="governance-office-card">
            <span className="governance-status bg-surface-container text-primary">
              <Icon name="person" className="text-[16px]" />
              President of the Society
            </span>
            <div className="mt-5 flex items-start gap-4">
              <span aria-hidden="true" className="governance-initials">
                FK
              </span>
              <div className="min-w-0">
                <p className="mb-1 font-label-mono-isbn text-[11px] text-secondary">
                  PRESIDENT
                </p>
                <h3 className="font-headline-sm text-headline-sm leading-snug text-primary">
                  {president.name}
                </h3>
                <p className="mt-1 text-body-sm text-on-surface-variant">
                  SKUAST-Kashmir
                </p>
              </div>
            </div>
            <div className="mt-5 rounded-lg bg-surface-container-low p-4">
              <p className="mb-2 font-label-mono-isbn text-[10px] tracking-wider text-on-surface-variant">
                ACADEMIC AFFILIATION
              </p>
              <p className="text-body-sm font-semibold text-primary">
                {president.designation}
              </p>
              <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">
                {president.institution}
              </p>
            </div>
          </article>
          <div
            role="note"
            aria-label="Secretary confirmation required"
            className="governance-office-card governance-office-pending"
          >
            <span className="governance-status bg-secondary-fixed text-on-secondary-container">
              <Icon name="hourglass_top" className="text-[16px]" />
              Confirmation pending
            </span>
            <h3 className="mt-5 font-headline-sm text-headline-sm text-primary">
              Secretary
            </h3>
            <p className="mt-3 text-title-sm text-primary">
              {unconfirmedSecretary.name}
            </p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              {unconfirmedSecretary.affiliation}
            </p>
            <div className="mt-5 rounded-lg bg-surface-container-low p-4 text-body-sm leading-relaxed text-on-surface-variant">
              <p>
                <strong>{unconfirmedSecretary.status}</strong>
              </p>
              <p className="mt-2">
                Secretary details are awaiting confirmation.
              </p>
            </div>
          </div>
          <div className="governance-office-card">
            <span className="governance-status bg-surface-container-low text-on-surface-variant">
              <Icon name="inventory_2" className="text-[16px]" />
              Information pending
            </span>
            <h3 className="mt-5 mb-4 font-headline-sm text-headline-sm text-primary">
              Designations &amp; Portfolios
            </h3>
            <dl className="governance-pending-positions">
              {pendingPositions.map((position) => (
                <div key={position}>
                  <dt className="text-title-sm text-primary">{position}</dt>
                  <dd className="mt-1 text-body-sm text-on-surface-variant">
                    Information pending
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
