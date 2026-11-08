import { readFileSync } from "node:fs";
import VisionPage from "../../src/app/about/vision-mission/page";
import GovernancePage from "../../src/app/about/governance/page";
import PartnersPage from "../../src/app/about/partners/page";
import {
  governanceIntroduction,
  generalBody,
  executiveCouncil,
  president,
  unconfirmedSecretary,
  pendingPositions,
  officeRoles,
  committees,
} from "../../src/content/aeetds-governance";
import {
  partnerDirectory,
  partnersIntroduction,
  collaborationInvitation,
} from "../../src/content/aeetds-partners";
import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AboutPage from "../../src/app/about/page";

beforeEach(() =>
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  ),
);
afterEach(() => vi.unstubAllGlobals());

describe("unified About section", () => {
  it("offers every About route in one shared navigation with the current page active", () => {
    render(<AboutPage />);
    const nav = screen.getByRole("navigation", { name: "About section" });
    const links = within(nav).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/about",
      "/about/vision-mission",
      "/about/governance",
      "/about/partners",
    ]);
    expect(links[0]).toHaveAttribute("aria-current", "page");
    expect(nav.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });
});

it.each([
  ["/about/vision-mission", VisionPage],
  ["/about/governance", GovernancePage],
  ["/about/partners", PartnersPage],
] as const)(
  "keeps the shared top and secondary state correct on %s",
  (path, Page) => {
    render(<Page />);
    const sub = screen.getByRole("navigation", { name: "About section" });
    expect(sub.querySelector('[aria-current="page"]')).toHaveAttribute(
      "href",
      path,
    );
    expect(sub.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    const main = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(main).getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("contentinfo")).toHaveLength(1);
  },
);

it("preserves official governance descriptions and the canonical office roles", () => {
  render(<GovernancePage />);
  const brief = readFileSync(
    "references/aeetds/about-section/IMPLEMENTATION_PROMPT.md",
    "utf8",
  );
  for (const text of [
    governanceIntroduction,
    generalBody,
    executiveCouncil,
    ...officeRoles.slice(0, 4).map((role) => role.text),
  ]) {
    expect(brief).toContain(text);
    expect(screen.getByText(text)).toBeInTheDocument();
  }
  expect(officeRoles).toHaveLength(5);
  expect(
    screen.getByText(
      "responsible for the Society's publications, including books of abstracts, edited volumes and the magazine.",
    ),
  ).toBeInTheDocument();
});

it("separates the supplied President, unconfirmed Secretary and five pending positions", () => {
  render(<GovernancePage />);
  const card = screen.getByRole("article", { name: "President" });
  for (const text of Object.values(president))
    expect(within(card).getByText(text)).toBeInTheDocument();
  const note = screen.getByRole("note", {
    name: "Secretary confirmation required",
  });
  expect(note).toHaveTextContent(unconfirmedSecretary.name);
  expect(note).toHaveTextContent(unconfirmedSecretary.affiliation);
  expect(note).toHaveTextContent("confirmation required");
  expect(card).not.toHaveTextContent(unconfirmedSecretary.name);
  for (const position of pendingPositions)
    expect(
      screen.getByText(position, { selector: "dt" }).nextElementSibling,
    ).toHaveTextContent("Information pending");
  expect(document.querySelector("main img")).toBeNull();
});

it("keeps all committee names and exact responsibilities in semantic table rows", () => {
  render(<GovernancePage />);
  const table = screen.getByRole("table", {
    name: "Committees and responsibilities",
  });
  const rows = table.querySelectorAll("tbody tr");
  expect(rows).toHaveLength(5);
  const brief = readFileSync(
    "references/aeetds/about-section/IMPLEMENTATION_PROMPT.md",
    "utf8",
  );
  rows.forEach((row, index) => {
    expect(within(row as HTMLElement).getByRole("rowheader")).toHaveTextContent(
      committees[index].name,
    );
    expect(within(row as HTMLElement).getByRole("cell")).toHaveTextContent(
      committees[index].role,
    );
    expect(brief).toContain(committees[index].role);
  });
});

it("renders the eight exact partner institutions and real collaboration contact", () => {
  render(<PartnersPage />);
  const brief = readFileSync(
    "references/aeetds/about-section/IMPLEMENTATION_PROMPT.md",
    "utf8",
  );
  const entries = within(
    screen.getByRole("list", { name: "Collaborating institutions" }),
  ).getAllByRole("listitem");
  expect(entries).toHaveLength(8);
  entries.forEach((entry, index) => {
    const partner = partnerDirectory[index];
    expect(brief).toContain(`${partner.name}, ${partner.city}`);
    expect(within(entry).getByRole("heading", { level: 3 })).toHaveTextContent(
      partner.name,
    );
    expect(entry).toHaveTextContent(partner.city);
  });
  expect(entries[7]).toHaveTextContent("Publishing Partner");
  expect(screen.getByText(partnersIntroduction)).toBeInTheDocument();
  expect(screen.getByText(collaborationInvitation)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Contact the Secretary" }),
  ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
  expect(document.querySelector("main img")).toBeNull();
});

it.each([GovernancePage, PartnersPage])(
  "does not introduce unverified legal, identity or partnership claims",
  (Page) => {
    render(<Page />);
    const main = screen.getByRole("main");
    expect(main).not.toHaveTextContent(
      /gazette|elected tenure|active mandate verified|charter sec|UGC|honorary capacity|joint fiduciary|verified institutional partnerships|CENTRAL GOVT|ENDORSED/i,
    );
    expect(main.querySelector('a[href="#"], [data-path]')).toBeNull();
  },
);
