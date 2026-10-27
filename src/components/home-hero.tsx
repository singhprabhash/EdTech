import Link from "next/link";
import CatalogueSearch from "./catalogue-search";

export default function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="hero-heading">
      <div className="site-container hero-layout">
        <div className="hero-editorial">
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" /> Academic
            publishing
          </p>
          <h1 id="hero-heading">Ideas that advance knowledge.</h1>
          <p className="hero-description">
            Academic textbooks, reference books and laboratory manuals for
            students, teachers and researchers.
          </p>
          <div className="hero-actions">
            <Link className="button button-navy" href="/books">
              Explore the Catalogue <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-white" href="/publish-with-us">
              Publish With Us <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <CatalogueSearch />
        </div>
      </div>
    </section>
  );
}
