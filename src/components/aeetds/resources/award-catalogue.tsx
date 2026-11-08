"use client";
import { useSiteContent } from "../site-content";
import { useState } from "react";
import {
  awardGroups,
  awardees,
  filterAwardees,
} from "../../../content/aeetds-awards";
import { Eyebrow, Icon } from "../ui";
export function AwardCatalogue() {
  const [group, setGroup] = useState("");
  const visible = awardGroups.filter((item) => !group || item.id === group);
  return (
    <section
      id="society-awards"
      className="resource-section bg-surface-container-low"
      aria-labelledby="award-catalogue-title"
    >
      <div className="aeetds-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0 max-w-3xl">
            <Eyebrow>SECTION 01 / AWARD CATEGORIES</Eyebrow>
            <h2 id="award-catalogue-title" className="resource-heading mb-3">
              Society Awards Nomenclature &amp; Criteria
            </h2>
            <p className="text-on-surface-variant">
              Explore all eight official award groups. Category filtering
              changes the displayed groups without shortening their award lists.
            </p>
          </div>
          <div className="resource-filter-control">
            <label htmlFor="award-group">Award group</label>
            <select
              id="award-group"
              value={group}
              onChange={(event) => setGroup(event.target.value)}
            >
              <option value="">All groups</option>
              {awardGroups.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p role="status" className="mb-4 text-body-sm text-on-surface-variant">
          {visible.length} of 8 award groups displayed
        </p>
        <div className="resource-award-grid">
          {visible.map((item) => (
            <article key={item.id} className="resource-award-card">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="resource-badge">
                  GROUP{" "}
                  {String(
                    awardGroups.findIndex(
                      (candidate) => candidate.id === item.id,
                    ) + 1,
                  ).padStart(2, "0")}
                </span>
                <Icon name={item.icon} className="text-secondary" />
              </div>
              <h3 className="mb-5 text-title-md text-primary">{item.name}</h3>
              <ul className="space-y-3">
                {item.awards.map((award) => (
                  <li key={award} className="resource-award-name">
                    {award}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function AwardeeDirectory() {
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const entries = useSiteContent().awardees ?? awardees;
  const records = filterAwardees(entries, year, category, query);
  function reset() {
    setYear("");
    setCategory("");
    setQuery("");
  }
  return (
    <section
      id="past-awardees"
      className="resource-section bg-background"
      aria-labelledby="awardee-directory-title"
    >
      <div className="aeetds-container">
        <Eyebrow>AWARDEE RECORDS</Eyebrow>
        <h2 id="awardee-directory-title" className="resource-heading mb-6">
          Past Awardees Directory
        </h2>
        <div className="resource-directory">
          <div className="resource-directory-filters">
            <div className="resource-filter-control">
              <label htmlFor="awardee-year">Year</label>
              <select
                id="awardee-year"
                value={year}
                onChange={(event) => setYear(event.target.value)}
              >
                <option value="">All years</option>
                {[
                  ...new Set([
                    "2026",
                    "2025",
                    "2024",
                    ...entries.map((entry) => entry.year),
                  ]),
                ]
                  .sort()
                  .reverse()
                  .map((item) => (
                    <option key={item}>{item}</option>
                  ))}
              </select>
            </div>
            <div className="resource-filter-control">
              <label htmlFor="awardee-category">Award category</label>
              <select
                id="awardee-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">All categories</option>
                {awardGroups.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="resource-filter-control resource-search">
              <label htmlFor="awardee-query">Search awardees</label>
              <input
                id="awardee-query"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, institution or award"
              />
            </div>
            <button
              type="button"
              className="resource-text-button"
              onClick={reset}
            >
              Reset filters
            </button>
          </div>
          <p
            role="status"
            className="border-b border-surface-container px-5 py-3 text-body-sm text-on-surface-variant"
          >
            {records.length} confirmed records{year ? ` · Year: ${year}` : ""}
            {category
              ? ` · Category: ${awardGroups.find((item) => item.id === category)?.name}`
              : ""}
            {query ? ` · Search: ${query}` : ""}
          </p>
          <div className="resource-table-scroll">
            <table
              className="resource-directory-table"
              aria-label="Past awardees"
            >
              <thead>
                <tr>
                  <th scope="col">Year</th>
                  <th scope="col">Award</th>
                  <th scope="col">Name</th>
                  <th scope="col">Institution</th>
                </tr>
              </thead>
              <tbody>
                {records.length ? (
                  records.map((record, index) => (
                    <tr key={`${record.year}-${index}`}>
                      <td>{record.year}</td>
                      <td>{record.award}</td>
                      <td>{record.name}</td>
                      <td>{record.institution}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="resource-empty">
                        <Icon
                          name="manage_search"
                          className="mb-3 text-[32px] text-secondary"
                        />
                        <h3 className="mb-3 font-headline-sm text-headline-sm">
                          Confirmed Awardee Records Awaited
                        </h3>
                        <p>
                          No confirmed awardee records for 2024–2026 have been
                          supplied. Names, institutions and photographs will be
                          listed only when official records are available.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
