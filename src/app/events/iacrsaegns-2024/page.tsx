import { ConferenceStructuredData } from "../../../components/aeetds/seo/structured-data";
import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import ConferencePage from "../../../components/aeetds/events/conference-page";
import { publicConference } from "../../../server/public-content";

export function generateMetadata(): Metadata {
  const conference = publicConference("iacrsaegns-2024");
  return pageMetadata(
    "/events/iacrsaegns-2024",
    "IACRSAEGNS-2024 | AEETDS",
    conference.overview,
  );
}
export default function ConferenceRoute() {
  const conference = publicConference("iacrsaegns-2024");
  return (
    <>
      <ConferenceStructuredData conference={conference} />
      <ConferencePage conference={conference} />
    </>
  );
}
