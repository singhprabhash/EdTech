import { ReadyLayout } from "../../components/ready-document";
import type { Metadata } from "next";
import Link from "next/link";
import { site } from "../../config/site";

export const metadata: Metadata = {
  title: "Publish With Us | EdTech Publications",
};

export default function PublishWithUs() {
  return (
    <ReadyLayout>
      <main id="main" tabIndex={-1} className="site-container content-page">
        <p className="eyebrow">For authors</p>
        <h1>Bring your ideas to the page.</h1>
        <p className="page-intro">
          Contact EdTech Publications to discuss your academic book or
          manuscript.
        </p>
        <section className="info-panel publishing-panel">
          <h2>Start a publishing conversation</h2>
          <p>
            For publishing enquiries, email the team. Online proposal submission
            is not yet available.
          </p>
          <a className="button button-primary" href={`mailto:${site.email}`}>
            Email the publishing team <span aria-hidden="true">↗</span>
          </a>
          <Link className="text-link" href="/contact">
            Other ways to contact us →
          </Link>
        </section>
      </main>
    </ReadyLayout>
  );
}
