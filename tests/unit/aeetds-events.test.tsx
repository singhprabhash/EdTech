import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it } from "vitest";
import {
  conferences,
  crafnsConference,
  pastConferences,
  eventPhotos,
  trainingPillars,
} from "../../src/content/aeetds-events";
import provenance from "../../public/aeetds/provenance.json";
import EventsLanding from "../../src/components/aeetds/events/landing";
import ConferencePage from "../../src/components/aeetds/events/conference-page";
import TrainingsWorkshopsPage from "../../src/components/aeetds/events/training";
import EventCalendar from "../../src/components/aeetds/events/calendar";
import EventImage from "../../src/components/aeetds/events/event-image";

it("uses approved CRAFNS logistics without inventing a host or image", () => {
  expect(pastConferences.map((item) => item.slug)).toEqual([
    "ncfahs-2026",
    "fstat-2025",
    "iacrsaegns-2024",
  ]);
  expect(crafnsConference.startDate).toBe("2026-12-10");
  expect(crafnsConference.endDate).toBe("2026-12-11");
  expect(crafnsConference.photos).toEqual([]);
  expect(crafnsConference.host).toBe("To be announced");
  expect(crafnsConference.dates).toBe("10-11 December, 2026");
  expect(crafnsConference.venue).toContain("Rajendranagar, Hyderabad – 500030");
  expect(JSON.stringify(conferences)).not.toMatch(/361|24 states/i);
  expect(conferences.map((item) => item.themes.length)).toEqual([8, 5, 9, 7]);
  expect(trainingPillars).toHaveLength(9);
  expect(crafnsConference.themesHeading).toContain("Suggested");
  const brief = readFileSync(
    "references/aeetds/events/IMPLEMENTATION_PROMPT.md",
    "utf8",
  );
  for (const item of conferences) expect(brief).toContain(item.title);
});
it("uses all seven real photographs and exact PDF extraction provenance", () => {
  const photos = Object.values(eventPhotos).flat();
  expect(photos).toHaveLength(7);
  expect(new Set(photos.map((photo) => photo.src)).size).toBe(7);
  for (const photo of photos) {
    const path = `public${photo.src}`;
    expect(existsSync(path)).toBe(true);
    const asset = provenance.assets.find((item) =>
      photo.src.endsWith(item.file),
    )!;
    expect(photo.alt).toBe(asset.caption);
    expect(photo.caption).toBe(asset.caption);
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(
      asset.sha256,
    );
  }
});
it("links every landing archive and training route, with the supplied conference participation forms", () => {
  render(<EventsLanding />);
  for (const item of conferences)
    expect(
      document.querySelector(`a[href="/events/${item.slug}"]`),
    ).not.toBeNull();
  expect(
    screen.getByRole("link", { name: "Explore Training Programmes" }),
  ).toHaveAttribute("href", "/events/trainings-workshops");
  expect(screen.getByRole("link", { name: "Registration" })).toHaveAttribute(
    "href",
    "https://forms.gle/AyASGfqcDvEtHaTV8",
  );
  expect(
    screen.getByRole("link", { name: "Abstract Submission" }),
  ).toHaveAttribute("href", "https://forms.gle/3CD99LypP1iszLF16");
  expect(
    document.querySelector(
      'a[href="#"],a[href="/submit/registration"],a[href="/submit/abstract"]',
    ),
  ).toBeNull();
});
it.each(conferences)(
  "renders canonical overview and safe archive details for $shortName",
  (conference) => {
    render(<ConferencePage conference={conference} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      conference.title,
    );
    expect(screen.getByText(conference.overview)).toBeInTheDocument();
    for (const person of conference.people)
      expect(
        screen.getByRole("heading", { name: person.name }),
      ).toBeInTheDocument();
    if (conference.status === "completed") {
      expect(
        screen.getByRole("link", { name: "Back to Past Conferences" }),
      ).toHaveAttribute("href", "/events#past-conferences");
      expect(
        screen.getByRole("list", {
          name: `${conference.shortName} photographs`,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Enquire About Materials" }),
      ).toHaveAttribute("href", expect.stringContaining("mailto:"));
    }
    expect(document.body).not.toHaveTextContent(
      /540\+|382|18 keynote|100% peer|60%|audited|authenticated download|DOI:|ISBN:|formally adopted|registry token|3-Day Technical Schedule|MoU Finalization/,
    );
    expect(
      document.querySelector(
        'a[download]:not([href="/aeetds/documents/crafns-2026-brochure.pdf"]),a[href="#"]',
      ),
    ).toBeNull();
  },
);
it("renders nine training areas without operational guarantees or fake application forms", () => {
  render(<TrainingsWorkshopsPage />);
  for (const pillar of trainingPillars)
    expect(
      screen.getByRole("heading", { name: pillar.title }),
    ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", {
      name: "Interested in Hosting a Training Programme?",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Write to the Secretary" }),
  ).toHaveAttribute(
    "href",
    expect.stringContaining("mailto:secretaryaeetds@gmail.com"),
  );
  expect(document.body).not.toHaveTextContent(
    /60%|certification|accreditation|4-tier|guaranteed|48 hours/i,
  );
  expect(document.querySelector("form")).toBeNull();
});
it("navigates calendar months, selects dates and supports arrow-key date focus", () => {
  render(<EventCalendar />);
  const table = screen.getByRole("table", { name: "July 2026 calendar" });
  expect(within(table).getAllByRole("columnheader")).toHaveLength(7);
  const day = screen.getByRole("button", {
    name: "15 July 2026 — confirmed conference",
  });
  fireEvent.click(day);
  day.focus();
  fireEvent.keyDown(day, { key: "ArrowRight" });
  expect(
    screen.getByRole("button", { name: "16 July 2026 — confirmed conference" }),
  ).toHaveFocus();
  expect(
    screen.getByRole("link", { name: "View Conference Details" }),
  ).toHaveAttribute("href", "/events/ncfahs-2026");
  fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  expect(
    screen.getByRole("table", { name: "August 2026 calendar" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText("No confirmed conference is listed for this date."),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /confirmed conference/ }),
  ).toBeNull();
  for (let index = 0; index < 12; index++)
    fireEvent.click(screen.getByRole("button", { name: "Next month" }));
  expect(
    screen.getByRole("table", { name: "August 2027 calendar" }),
  ).toBeInTheDocument();
});
it("replaces a failed event photograph with its neutral availability state", () => {
  render(<EventImage photo={eventPhotos.ncfahs[0]} />);
  fireEvent.error(screen.getByRole("img"));
  expect(screen.getByText("Photograph unavailable")).toBeVisible();
  expect(screen.getByText(eventPhotos.ncfahs[0].caption)).toBeVisible();
});
