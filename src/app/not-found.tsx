import ResourceShell from "../components/aeetds/resources/shell";
import { Action, Eyebrow } from "../components/aeetds/ui";

export default function NotFound() {
  return (
    <ResourceShell activePath="">
      <section className="resource-section" aria-labelledby="not-found-title">
        <div className="aeetds-container max-w-3xl">
          <Eyebrow>AEETDS / AGRICULTURAL CONFERENCES</Eyebrow>
          <h1 id="not-found-title" className="resource-heading mb-6">
            Page not found
          </h1>
          <p className="mb-6 text-body-md text-on-surface-variant">
            This page is unavailable. Explore AEETDS conferences, events and
            Society resources.
          </p>
          <div className="resource-actions">
            <Action href="/">Return to home</Action>
            <Action href="/events" tone="light">
              Explore Conferences
            </Action>
          </div>
        </div>
      </section>
    </ResourceShell>
  );
}
