import { pageMetadata } from "../../../config/seo";
import AboutLayout from "../../../components/aeetds/about/section-layout";
import type { Metadata } from "next";
import VisionMissionPageHeader from "../../../components/aeetds/vision/page-intro";
import VisionMissionPanels from "../../../components/aeetds/vision/purpose-panels";
import WhyAeetdsSection from "../../../components/aeetds/vision/why-aeetds";
import ObjectivesSection from "../../../components/aeetds/vision/objectives";
import {
  ThrustAreasSection,
  CoreValuesSection,
} from "../../../components/aeetds/vision/thrust-and-values";
import VisionMissionCTA from "../../../components/aeetds/vision/closing-cta";
import "./vision.css";

export const metadata: Metadata = pageMetadata(
  "/about/vision-mission",
  "Vision, Mission and Objectives | AEETDS",
  "Explore the vision, mission, objectives, thrust areas and core values of the Agriculture, Entrepreneur, Environment & Technology Development Society (AEETDS).",
);

export default function VisionMissionPage() {
  return (
    <AboutLayout
      currentPath="/about/vision-mission"
      pageClassName="aeetds-vision"
    >
      <VisionMissionPageHeader />
      <VisionMissionPanels />
      <WhyAeetdsSection />
      <ObjectivesSection />
      <ThrustAreasSection />
      <CoreValuesSection />
      <VisionMissionCTA />
    </AboutLayout>
  );
}
