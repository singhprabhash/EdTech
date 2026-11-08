import { publicConferences } from "../../server/public-content";
import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import EventsLanding from "../../components/aeetds/events/landing";
export const metadata: Metadata = pageMetadata(
  "/events",
  "Conferences & Events | AEETDS",
  "Explore AEETDS conferences, confirmed past events, the academic calendar and training programmes.",
);
export default function EventsPage() {
  return <EventsLanding eventRecords={publicConferences()} />;
}
