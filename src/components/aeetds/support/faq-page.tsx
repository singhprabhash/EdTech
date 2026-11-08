import { faqs } from "../../../content/aeetds-support";
import { society } from "../../../content/aeetds";
import { Icon } from "../ui";
import { SupportBreadcrumb, SupportLabel, SupportCTA } from "./shared";
import FaqExperience from "./faq-experience";
export default function FaqPageContent() {
  return (
    <>
      <div className="support-faq-reference-row">
        <SupportBreadcrumb title="Frequently Asked Questions" contactParent />
        <div className="support-reference-labels">
          <span>
            <Icon name="menu_book" className="text-[16px]" />
            SOCIETY INFORMATION
          </span>
          <span>{society.registration}</span>
        </div>
      </div>
      <section
        className="support-faq-hero"
        aria-labelledby="support-page-title"
      >
        <div>
          <SupportLabel>CLARIFICATIONS &amp; ENQUIRIES</SupportLabel>
          <h1 id="support-page-title" className="support-page-title">
            Frequently Asked Questions
          </h1>
          <p className="support-introduction">
            Find answers to common questions about AEETDS membership,
            conferences, abstract submissions, awards, registration and
            publications.
          </p>
        </div>
        <aside className="support-faq-guidance">
          <SupportLabel>AEETDS SECRETARIAT</SupportLabel>
          <h2>Inquiry Guidance Desk</h2>
          <p>
            For questions about membership, conferences, submissions and other
            enquiries, contact the Secretary&apos;s office.
          </p>
          <div>
            <a href="/contact">Contact Us</a>
            <span>
              <Icon name="help_center" className="text-[16px]" />
              {faqs.length} Questions
            </span>
          </div>
        </aside>
      </section>
      <FaqExperience />
      <SupportCTA
        title="Still have a question?"
        text="Our Secretary's office is happy to assist you with membership, conferences, submissions and other enquiries."
        contactLink
      />
    </>
  );
}
