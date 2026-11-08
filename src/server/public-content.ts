import { getPublicContent } from "./content.mjs";
import { contentDefaults } from "./content-defaults";
import { configuration } from "./config.mjs";
import { conferences, type Conference } from "../content/aeetds-events";
import type { SiteContent } from "../components/aeetds/site-content";
export function publicContent(): SiteContent {
  return getPublicContent(
    contentDefaults,
    configuration(),
  ) as unknown as SiteContent;
}
export function publicConferences(): readonly Conference[] {
  const content = publicContent();
  return conferences.map((original) => {
    const override = content.events.find(
      (event) => event.slug === original.slug,
    );
    return {
      ...original,
      ...override,
      startDate: override
        ? override.startDate || undefined
        : original.startDate,
      endDate: override ? override.endDate || undefined : original.endDate,
      photos: content.gallery.filter(
        (photo) => photo.eventSlug === original.slug,
      ),
    } as Conference;
  });
}
export function publicConference(slug: string) {
  return publicConferences().find((event) => event.slug === slug)!;
}
