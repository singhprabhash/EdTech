import { society } from "../../../content/aeetds";
import { contactInformation } from "../../../content/aeetds-support";
import { Icon } from "../ui";
import { SupportBreadcrumb, SupportCTA, SupportLabel } from "./shared";
import SecretariatInformation from "./contact-information";
import ContactForm from "./contact-form";
export default function ContactPageContent() {
  return (
    <>
      <SupportBreadcrumb title="Contact Us" />
      <section
        className="support-contact-hero"
        aria-labelledby="support-page-title"
      >
        <div className="support-hero-labels">
          <SupportLabel>SECRETARIAT &amp; LIAISON DESK</SupportLabel>
          <span className="support-small-badge">
            RESPONSE WITHIN THREE WORKING DAYS
          </span>
        </div>
        <div className="support-hero-grid">
          <div>
            <h1 id="support-page-title" className="support-display-title">
              Contact Us
            </h1>
            <p className="support-introduction">
              {contactInformation.introduction}
            </p>
          </div>
          <aside className="support-dossier">
            <span className="support-dossier-icon">
              <Icon name="account_balance" />
            </span>
            <div>
              <SupportLabel>REGISTRATION DOSSIER</SupportLabel>
              <p>{society.registration}</p>
            </div>
          </aside>
        </div>
      </section>
      <div className="support-contact-grid">
        <SecretariatInformation />
        <ContactForm />
      </div>
      <section className="support-map-section" aria-labelledby="find-us-title">
        <div className="support-map-heading">
          <div>
            <SupportLabel>OFFICE LOCATION</SupportLabel>
            <h2 id="find-us-title" className="support-section-heading">
              Find Us
            </h2>
          </div>
          <p>Lucknow, Uttar Pradesh, India</p>
        </div>
        <div className="support-map-placeholder">
          <div>
            <span className="support-map-icon">
              <Icon name="map" className="text-[30px]" />
            </span>
            <SupportLabel>AEETDS SECRETARIAT</SupportLabel>
            <h3>Office location to be updated</h3>
            <p>The full office address and map are not yet available.</p>
            <span className="support-small-badge">OFFICE ADDRESS AWAITED</span>
          </div>
        </div>
      </section>
      <SupportCTA
        title="Let's work together"
        text="We welcome your questions, suggestions and proposals for collaboration."
      />
    </>
  );
}
