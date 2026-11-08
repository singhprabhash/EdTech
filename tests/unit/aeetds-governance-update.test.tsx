import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GovernancePage from "../../src/app/about/governance/page";

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

describe("Governance reference update", () => {
  it("uses the requested executive-council heading and preserves the Governance breadcrumb", () => {
    render(<GovernancePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Governance & Executive Council",
    );
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" }),
    ).toHaveTextContent("Home/About/Governance");
    expect(
      screen.getByRole("heading", {
        name: "Roles & Constitutional Responsibilities",
      }),
    ).toBeInTheDocument();
  });
  it("adds verified governance information and the exact working closing actions", () => {
    render(<GovernancePage />);
    expect(
      screen.getByRole("heading", { name: "Governance Information" }),
    ).toBeInTheDocument();
    const cta = screen.getByRole("region", {
      name: "Societies Registration Act XXI of 1860",
    });
    expect(cta).toHaveTextContent(
      "For official information about the Memorandum of Association, Rules & Regulations, or governance-related enquiries, please reach out to the Society Secretariat.",
    );
    expect(
      within(cta).getByRole("link", { name: "Contact Secretariat" }),
    ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
    expect(
      within(cta).getByRole("link", { name: "About AEETDS" }),
    ).toHaveAttribute("href", "/about");
  });
  it("excludes unsupported committee identifiers, terms and legal/financial claims", () => {
    render(<GovernancePage />);
    const main = screen.getByRole("main");
    expect(main).not.toHaveTextContent(
      /COM-\d+|Standing Annual|Permanent Panel|one-third|Minutes Registry|Chartered Accountant|UGC\/ICAR|joint fiduciary|CHARTER SEC|gazette|honorary capacity/i,
    );
    expect(main.querySelector("img")).toBeNull();
    expect(
      within(main)
        .getByRole("table", { name: "Committees and responsibilities" })
        .querySelectorAll("tbody tr"),
    ).toHaveLength(5);
  });
});
