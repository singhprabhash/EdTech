import { ConferenceStructuredData } from "../../../components/aeetds/seo/structured-data";
import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import ConferencePage from "../../../components/aeetds/events/conference-page";
import { publicConference } from "../../../server/public-content";

export function generateMetadata(): Metadata {
  const conference = publicConference("fstat-2025");
  return pageMetadata(
    "/events/fstat-2025",
    "FSTAT-2025 | AEETDS",
    conference.overview,
  );
}
export default function ConferenceRoute() {
  const conference = publicConference("fstat-2025");
  return (
    <>
      <ConferenceStructuredData conference={conference} />
      <ConferencePage conference={conference} />
    </>
  );
}
