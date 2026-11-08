import { society } from "../../../content/aeetds";
import { contactInformation } from "../../../content/aeetds-support";
import { Icon } from "../ui";
import { SupportLabel } from "./shared";
export default function SecretariatInformation() {
  return (
    <section
      className="support-information"
      aria-labelledby="secretariat-title"
    >
      <h2 id="secretariat-title" className="support-section-heading">
        Secretariat Information
      </h2>
      <div className="support-info-card">
        <div className="support-info-heading">
          <span className="support-icon">
            <Icon name="markunread_mailbox" />
          </span>
          <div>
            <SupportLabel>OFFICIAL POSTAL ADDRESS</SupportLabel>
            <h3>Office of the Secretary</h3>
          </div>
        </div>
        <address>
          The Secretary, AEETDS,
          <br />
          [Full office address to be provided],
          <br />
          Lucknow, Uttar Pradesh – [PIN to be provided], India.
        </address>
        <p className="support-inset">
          The full office address and PIN are not yet available.
        </p>
      </div>
      <div className="support-info-card">
        <div className="support-info-heading">
          <span className="support-icon">
            <Icon name="alternate_email" />
          </span>
          <div className="min-w-0">
            <SupportLabel>EMAIL CORRESPONDENCE</SupportLabel>
            <a className="support-email" href={`mailto:${society.email}`}>
              {society.email}
            </a>
          </div>
        </div>
        <p>For all enquiries, submissions and registrations.</p>
      </div>
      <div className="support-info-card">
        <div className="support-info-heading">
          <span className="support-icon">
            <Icon name="support_agent" />
          </span>
          <div>
            <SupportLabel>VOICE &amp; INSTANT MESSAGING</SupportLabel>
            <h3>Telephonic &amp; WhatsApp Helplines</h3>
          </div>
        </div>
        <div className="support-helplines">
          {contactInformation.phones.map((phone, index) => (
            <a key={phone} href={`tel:${phone.replaceAll("-", "")}`}>
              <span className="support-line-label">
                LINE {String(index + 1).padStart(2, "0")}
                <Icon name="call" className="text-[18px]" />
              </span>
              <span>{phone}</span>
            </a>
          ))}
        </div>
      </div>
      <div className="support-info-pair">
        <div className="support-info-card">
          <SupportLabel>
            <Icon name="schedule" className="text-[18px]" /> Working Hours
          </SupportLabel>
          <p className="support-info-value">{contactInformation.hours}</p>
        </div>
        <div className="support-info-card">
          <SupportLabel>
            <Icon name="public" className="text-[18px]" />
            Official Website
          </SupportLabel>
          <a
            className="support-info-value support-inline-link"
            href={contactInformation.website}
          >
            {contactInformation.websiteLabel}
            <Icon name="north_east" className="text-[16px]" />
          </a>
        </div>
      </div>
      <div className="support-registration resource-dark">
        <SupportLabel>
          <Icon name="account_balance" />
          SOCIETY REGISTRATION
        </SupportLabel>
        <p>{society.registration}</p>
      </div>
    </section>
  );
}
