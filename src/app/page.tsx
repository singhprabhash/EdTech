import { pageMetadata, homeTitle, homeDescription } from "../config/seo";
import type { Metadata } from "next";
import SiteHeader from "../components/aeetds/site-header";
import NewsTicker from "../components/aeetds/news-ticker";
import HeroSection from "../components/aeetds/hero-section";
import ConferenceHighlight from "../components/aeetds/conference-highlight";
import {
  WelcomeSection,
  WhatWeDoSection,
  StatisticsSection,
  CollaboratorsSection,
} from "../components/aeetds/society-sections";
import NewsAndQuickLinksSection from "../components/aeetds/news-section";
import SiteFooter from "../components/aeetds/site-footer";

import "./aeetds.css";

export const metadata: Metadata = pageMetadata("/", homeTitle, homeDescription);

export default function Home() {
  return (
    <div className="aeetds-page">
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <NewsTicker />
        <HeroSection />
        <ConferenceHighlight />
        <WelcomeSection />
        <WhatWeDoSection />
        <StatisticsSection />
        <CollaboratorsSection />
        <NewsAndQuickLinksSection />
      </main>
      <SiteFooter />
    </div>
  );
}
