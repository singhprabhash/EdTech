import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, afterEach, vi } from "vitest";
import VisionMissionPage, {
  metadata,
} from "../../src/app/about/vision-mission/page";
import {
  visionStatement,
  missionStatement,
  whyParagraphs,
  objectives,
  thrustAreas,
  coreValues,
} from "../../src/content/aeetds-vision";
import { describe, expect, it } from "vitest";
import robots from "../../src/app/robots";

describe("Vision route crawl policy", () => {
  it("allows the requested page and render assets while blocking other preview pages", () => {
    const rules = robots().rules;
    expect(rules).toMatchObject({ userAgent: "*", disallow: "/" });
    expect(rules).toHaveProperty("allow");
    expect((rules as { allow: string[] }).allow).toContain(
      "/about/vision-mission$",
    );
    expect((rules as { allow: string[] }).allow).toContain("/_next/static/");
    expect((rules as { allow: string[] }).allow).not.toContain("/about");
    expect((rules as { allow: string[] }).allow).not.toContain("/");
  });
});

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

describe("Vision, Mission and Objectives content", () => {
  it("preserves exact approved statements and all three Why paragraphs", () => {
    render(<VisionMissionPage />);
    const brief = readFileSync(
      "references/aeetds/vision-mission/IMPLEMENTATION_PROMPT.md",
      "utf8",
    );
    for (const text of [visionStatement, missionStatement, ...whyParagraphs]) {
      expect(brief).toContain(text);
      expect(screen.getByText(text)).toBeInTheDocument();
    }
    expect(whyParagraphs).toHaveLength(3);
    expect(document.querySelectorAll("blockquote")).toHaveLength(2);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(metadata.title).toBe("Vision, Mission and Objectives | AEETDS");
  });
  it("renders nine exact objectives in their approved order", () => {
    render(<VisionMissionPage />);
    const brief = readFileSync(
      "references/aeetds/vision-mission/IMPLEMENTATION_PROMPT.md",
      "utf8",
    );
    const items = within(
      screen.getByRole("list", { name: "Society objectives" }),
    ).getAllByRole("listitem");
    expect(items).toHaveLength(9);
    items.forEach((item, index) => {
      expect(brief).toContain(objectives[index].text);
      expect(item).toHaveTextContent(objectives[index].text);
      expect(item.querySelector(".vision-objective-number")).toHaveTextContent(
        String(index + 1).padStart(2, "0"),
      );
    });
  });
  it("renders all five thrust areas/focuses and only the five core value names", () => {
    render(<VisionMissionPage />);
    const brief = readFileSync(
      "references/aeetds/vision-mission/IMPLEMENTATION_PROMPT.md",
      "utf8",
    );
    const areas = within(
      screen.getByRole("list", { name: "Thrust areas" }),
    ).getAllByRole("listitem");
    expect(areas).toHaveLength(5);
    areas.forEach((item, index) => {
      expect(brief).toContain(thrustAreas[index].focus);
      expect(within(item).getByRole("heading", { level: 3 })).toHaveTextContent(
        thrustAreas[index].title,
      );
      expect(item).toHaveTextContent(thrustAreas[index].focus);
    });
    const values = within(
      screen.getByRole("list", { name: "Core values" }),
    ).getAllByRole("listitem");
    expect(values).toHaveLength(5);
    values.forEach((item, index) =>
      expect(within(item).getByRole("heading")).toHaveTextContent(
        coreValues[index].name,
      ),
    );
  });
  it("uses valid parent links and direct AEETDS email actions without unsupported additions", () => {
    render(<VisionMissionPage />);
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(
      within(breadcrumb).getByRole("link", { name: "Home" }),
    ).toHaveAttribute("href", "/");
    expect(
      within(breadcrumb).getByRole("link", { name: "About" }),
    ).toHaveAttribute("href", "/about");
    const cta = screen.getByRole("region", {
      name: "Be Part of a More Sustainable Agricultural Future",
    });
    for (const link of within(cta).getAllByRole("link")) {
      const url = new URL(link.getAttribute("href")!);
      expect(url.protocol).toBe("mailto:");
      expect(url.pathname).toBe("secretaryaeetds@gmail.com");
    }
    expect(screen.getByRole("main")).not.toHaveTextContent(
      /STRATEGIC DIRECTIVE|AEETDS CHARTER|Executive Council Note|Constitutional Mandates|Uncompromising Rigour|Ground-Level Priority|Equitable Growth|Public Accountability|Youth Incubation|Global Academic Exchange|Modern Agri-Tech|five programmatic corridors|ICAR CO-OPERATIVE FIELD TRIAL/i,
    );
    expect(
      document.querySelector('a[href="#"], [data-path], main img'),
    ).toBeNull();
  });
});
