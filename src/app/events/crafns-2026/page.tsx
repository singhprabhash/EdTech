import { ConferenceStructuredData } from "../../../components/aeetds/seo/structured-data";
import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import ConferencePage from "../../../components/aeetds/events/conference-page";
import { publicConference } from "../../../server/public-content";

export function generateMetadata(): Metadata {
  const conference = publicConference("crafns-2026");
  return pageMetadata(
    "/events/crafns-2026",
    "CRAFNS-2026 | AEETDS",
    conference.overview,
  );
}
export default function ConferenceRoute() {
  const conference = publicConference("crafns-2026");
  return (
    <>
      <ConferenceStructuredData conference={conference} />
      <ConferencePage conference={conference} />
    </>
  );
}
