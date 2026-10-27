import Link from "next/link";
import { navigation, site } from "../config/site";
import Brand from "./brand";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div className="footer-intro">
          <Brand inverse />
          <p>Academic books. Ideas. New perspectives.</p>
          <p className="footer-location">{site.location}</p>
        </div>
        <nav aria-label="Footer navigation">
          <h2>Explore</h2>
          {navigation.map(({ href, label }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="footer-contact">
          <h2>Get in touch</h2>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.telephone}`}>{site.telephoneLabel}</a>
          <p>For book and publishing enquiries.</p>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Website in development</span>
      </div>
    </footer>
  );
}
