import { announcements } from "../content/aeetds";
import { conferences } from "../content/aeetds-events";
import { awardees } from "../content/aeetds-awards";
export const contentDefaults = {
  ticker: announcements.map((item) => ({ ...item })),
  events: conferences.map((event) => ({
    slug: event.slug,
    shortName: event.shortName,
    title: event.title,
    subtitle: event.subtitle || "",
    category: event.category,
    status: event.status,
    dates: event.dates,
    startDate: event.startDate || "",
    endDate: event.endDate || "",
    venue: event.venue,
    shortVenue: event.shortVenue,
    mode: event.mode,
    host: event.host,
    organiser: event.organiser,
    overview: event.overview,
  })),
  downloads: [],
  gallery: conferences.flatMap((event) =>
    event.photos.map((photo) => ({ eventSlug: event.slug, ...photo })),
  ),
  awardees: [...awardees],
};
