import { ReadyLayout } from "../../components/ready-document";
import type { Metadata } from "next";
import { site } from "../../config/site";

export const metadata: Metadata = { title: "Contact | EdTech Publications" };

export default function Contact() {
  return (
    <ReadyLayout>
      <main id="main" tabIndex={-1} className="site-container content-page">
        <p className="eyebrow">Let’s talk</p>
        <h1>Contact EdTech Publications</h1>
        <p className="page-intro">
          Get in touch about books, publishing, chapters or an order.
        </p>
        <div className="contact-grid">
          <section className="info-panel">
            <h2>Email</h2>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <p>For book and publishing enquiries.</p>
          </section>
          <section className="info-panel">
            <h2>Telephone</h2>
            <a href={`tel:${site.telephone}`}>{site.telephoneLabel}</a>
            <p>{site.location}</p>
          </section>
        </div>
      </main>
    </ReadyLayout>
  );
}
