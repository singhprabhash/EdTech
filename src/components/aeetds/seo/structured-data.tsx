import { society } from "../../../content/aeetds";
import { contactInformation } from "../../../content/aeetds-support";
import type { Conference } from "../../../content/aeetds-events";
import { seoConfiguration } from "../../../config/seo";

// Escape HTML-significant characters even when future approved content is edited.
export function serializeStructuredData(data: object) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
export function organizationSchema() {
  const { origin } = seoConfiguration();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: society.name,
    alternateName: society.shortName,
    email: society.email,
    telephone: contactInformation.phones,
    ...(origin
      ? { url: origin.href, "@id": new URL("/#organization", origin).href }
      : {}),
    // No street address/PIN or social profile has been verified for schema use.
  };
}
export function eventSchema(conference: Conference) {
  if (!conference.startDate || !conference.endDate) return null;
  const { origin } = seoConfiguration();
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: conference.title,
    description: conference.overview,
    startDate: conference.startDate,
    endDate: conference.endDate,
    location: { "@type": "Place", name: conference.venue },
    organizer: { "@type": "Organization", name: conference.organiser },
    ...(origin
      ? { url: new URL(`/events/${conference.slug}`, origin).href }
      : {}),
  };
}
export function StructuredData({
  data,
  id,
}: {
  data: object | null;
  id: string;
}) {
  if (!data) return null;
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
    />
  );
}
export function OrganizationStructuredData() {
  return (
    <StructuredData id="aeetds-organization" data={organizationSchema()} />
  );
}
export function ConferenceStructuredData({
  conference,
}: {
  conference: Conference;
}) {
  return (
    <StructuredData
      id={`aeetds-event-${conference.slug}`}
      data={eventSchema(conference)}
    />
  );
}
