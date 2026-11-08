import { readFileSync } from "node:fs";
import AboutPage, { metadata } from "../../src/app/about/page";
import {
  backgroundParagraphs,
  societyProfile,
  societyMilestones,
} from "../../src/content/aeetds-about";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SiteHeader from "../../src/components/aeetds/site-header";

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("shared AEETDS navigation", () => {
  it("keeps Home active by default", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      within(nav).getByRole("link", { name: "About" }),
    ).not.toHaveAttribute("aria-current");
  });
  it("marks About active in both existing menus without changing destinations", () => {
    render(<SiteHeader activePath="/about" />);
    const desktop = screen.getByRole("navigation", { name: "Main navigation" });
    expect(
      within(desktop).getByRole("link", { name: "About" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(desktop).getByRole("link", { name: "Home" }),
    ).not.toHaveAttribute("aria-current");
    fireEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    const mobile = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(within(mobile).getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(mobile).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
  });
});

describe("About the Society content", () => {
  it("preserves all canonical paragraphs and seven semantic profile rows", () => {
    render(<AboutPage />);
    const brief = readFileSync(
      "references/aeetds/about/IMPLEMENTATION_PROMPT.md",
      "utf8",
    );
    expect(backgroundParagraphs).toHaveLength(3);
    for (const paragraph of backgroundParagraphs) {
      expect(brief).toContain(paragraph);
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    const profile = screen.getByRole("region", {
      name: "The Society in Brief",
    });
    expect(profile.querySelectorAll("dt")).toHaveLength(7);
    for (const row of societyProfile) {
      const label = within(profile).getByText(row.label, { selector: "dt" });
      expect(label.nextElementSibling).toHaveTextContent(row.value);
    }
    expect(
      within(profile).getByRole("link", { name: "secretaryaeetds@gmail.com" }),
    ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
  });
  it("renders the five approved milestones in chronological reading order", () => {
    render(<AboutPage />);
    const list = screen.getByRole("list", { name: "Society milestones" });
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(5);
    const brief = readFileSync(
      "references/aeetds/about/IMPLEMENTATION_PROMPT.md",
      "utf8",
    );
    items.forEach((item, index) => {
      const milestone = societyMilestones[index];
      expect(brief).toContain(milestone.description);
      expect(item.querySelector("time")).toHaveAttribute(
        "datetime",
        milestone.dateTime,
      );
      expect(within(item).getByRole("heading", { level: 3 })).toHaveTextContent(
        milestone.title,
      );
      expect(item).toHaveTextContent(milestone.description);
    });
    expect(items[4]).toHaveTextContent("in preparation");
  });
  it("uses a transparent illustration fallback and excludes unsupported additions", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("img", {
        name: "Illustration representing agricultural research and learning",
      }),
    ).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).not.toHaveTextContent(
      /Certified Registry|statutory body|PAN|12A|80G|Core Ethos|Science to Soil|National Academic Nexus|View Directory|PORTAL OPEN|now live/i,
    );
    expect(main.querySelector('img[src^="http"]')).toBeNull();
    expect(main.querySelector('a[href="#"]')).toBeNull();
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(metadata.title).toBe("About the Society | AEETDS");
  });
});
