import { pageMetadata } from "../../config/seo";
import AboutLayout from "../../components/aeetds/about/section-layout";
import type { Metadata } from "next";
import AboutPageIntro from "../../components/aeetds/about/intro";
import BackgroundSection from "../../components/aeetds/about/background";
import SocietyProfileSection from "../../components/aeetds/about/society-profile";
import JourneyTimeline from "../../components/aeetds/about/journey-timeline";
import "./about.css";

export const metadata: Metadata = pageMetadata(
  "/about",
  "About the Society | AEETDS",
  "Learn about the Agriculture, Entrepreneur, Environment & Technology Development Society (AEETDS), its institutional background, registration details and journey.",
);

export default function AboutPage() {
  return (
    <AboutLayout currentPath="/about" pageClassName="aeetds-about">
      <AboutPageIntro />
      <BackgroundSection />
      <SocietyProfileSection />
      <JourneyTimeline />
    </AboutLayout>
  );
}
