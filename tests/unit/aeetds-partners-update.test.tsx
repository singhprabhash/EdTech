import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import PartnersPage from "../../src/app/about/partners/page";
import { collaborators, society } from "../../src/content/aeetds";
import {
  partnerDirectory,
  partnersIntroduction,
  collaborationInvitation,
} from "../../src/content/aeetds-partners";

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

it("displays the eight sourced collaborators, full locations and a truthful count", () => {
  render(<PartnersPage />);
  expect(
    screen.getByRole("heading", {
      name: "Affiliated Research & Publishing Partners",
    }),
  ).toBeInTheDocument();
  expect(screen.getByText("8 Listed Collaborators")).toBeInTheDocument();
  const entries = within(
    screen.getByRole("list", { name: "Collaborating institutions" }),
  ).getAllByRole("listitem");
  expect(entries).toHaveLength(8);
  entries.forEach((entry, index) => {
    expect(within(entry).getByRole("heading", { level: 3 })).toHaveTextContent(
      partnerDirectory[index].name,
    );
    expect(entry).toHaveTextContent(collaborators[index].location);
  });
  expect(entries[7]).toHaveTextContent("Publishing Partner");
  expect(screen.getByText(partnersIntroduction)).toBeInTheDocument();
  expect(screen.getByText(collaborationInvitation)).toBeInTheDocument();
});

it("offers the complete Secretariat contacts and a real Governance route", () => {
  render(<PartnersPage />);
  const invitation = screen.getByRole("region", {
    name: "Institutional Alliances & Collaborative Programs",
  });
  expect(
    within(invitation).getByRole("heading", { name: "Society Secretariat" }),
  ).toBeInTheDocument();
  for (const phone of society.phones)
    expect(
      within(invitation).getByRole("link", { name: phone }),
    ).toHaveAttribute("href", `tel:${phone.replaceAll("-", "")}`);
  expect(
    within(invitation).getByRole("link", { name: society.email }),
  ).toHaveAttribute("href", `mailto:${society.email}`);
  expect(
    within(invitation).getByRole("link", {
      name: "Contact the Secretary",
    }),
  ).toHaveAttribute("href", `mailto:${society.email}`);
  expect(
    within(invitation).getByRole("link", { name: "View Society Governance" }),
  ).toHaveAttribute("href", "/about/governance");
  expect(invitation).toHaveTextContent(society.location);
  expect(invitation).toHaveTextContent(society.registration);
});

it("keeps unsupported approvals, relationship descriptions, classifications and SLAs out", () => {
  render(<PartnersPage />);
  const main = screen.getByRole("main");
  expect(main).not.toHaveTextContent(
    /verified|protocol compliance|clearance guidelines|48 business hours|academic co-sponsor|phytoremediation|ISBN indexing|Apex Management Academy|State Apex Council|Premier Laboratory|Central Government|scientist-farmer outreach/i,
  );
  expect(main.querySelector("img")).toBeNull();
  expect(main.querySelector('a[href="#"]')).toBeNull();
});
