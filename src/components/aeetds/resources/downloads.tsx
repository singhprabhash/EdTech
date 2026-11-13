"use client";
import { crafnsBrochure } from "../../../content/aeetds-events";
import { useSiteContent } from "../site-content";
import { Icon } from "../ui";
export default function Downloads() {
  const items = [crafnsBrochure, ...(useSiteContent().downloads ?? [])];
  return (
    <section className="resource-section">
      <div className="aeetds-container">
        <h2 className="resource-heading mb-6">Official Documents</h2>
        {items.length ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {items.map((item) => (
              <li
                key={item.href}
                className="rounded-xl border border-outline-variant bg-white p-6"
              >
                <h3 className="mb-3 text-title-md">{item.title}</h3>
                <p className="mb-4 text-on-surface-variant">
                  {item.description}
                </p>
                <a
                  href={item.href}
                  download={
                    item.href === crafnsBrochure.href
                      ? crafnsBrochure.filename
                      : undefined
                  }
                  className="resource-inline-link"
                >
                  <Icon name="download" />
                  Download document
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="resource-empty rounded-xl border border-outline-variant bg-white p-8">
            <Icon name="description" className="text-[32px]" />
            <p className="mt-4">
              No official documents have been published here yet.
            </p>
            <p className="mt-2">
              For a current form or brochure, contact the Secretary.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
