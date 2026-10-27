import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ReadyDocument from "../../src/components/ready-document";
import Books from "../../src/app/books/page";

describe("ready-design behavior", () => {
  it("toggles the reference mobile navigation and restores focus with Escape", () => {
    render(<ReadyDocument page="home" />);
    const trigger = screen.getByRole("button", {
      name: "Open navigation menu",
    });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
  it("uses a native GET hero search form and direct filters", () => {
    render(<ReadyDocument page="home" />);
    const input = document.querySelector<HTMLInputElement>(
      "#catalog-search-hero",
    )!;
    expect(input.form).toHaveAttribute("action", "/books");
    expect(input.form).toHaveAttribute("method", "get");
    expect(input).toHaveAttribute("name", "q");
  });
  it("filters supplied catalogue records and updates the URL", () => {
    render(<ReadyDocument page="catalogue" />);
    const input = document.querySelector<HTMLInputElement>("#catalogSearch")!;
    fireEvent.input(input, { target: { value: "soil" } });
    expect(document.querySelector("#resultCounter")).toHaveTextContent(
      "1 monographs",
    );
    expect(
      document.querySelectorAll("[data-record-id]:not([hidden])"),
    ).toHaveLength(1);
    expect(new URLSearchParams(location.search).get("q")).toBe("soil");
    fireEvent.click(document.querySelector("#clearFiltersBtn")!);
    expect(
      document.querySelectorAll("[data-record-id]:not([hidden])"),
    ).toHaveLength(10);
  });
  it("shows a real zero-result state and supports reset", () => {
    render(<ReadyDocument page="catalogue" />);
    fireEvent.input(document.querySelector("#catalogSearch")!, {
      target: { value: "missing-title-xyz" },
    });
    expect(document.querySelector("#catalogEmptyState")).not.toHaveClass(
      "hidden",
    );
    fireEvent.click(document.querySelector("#emptyStateResetBtn")!);
    expect(document.querySelector("#catalogEmptyState")).toHaveClass("hidden");
  });
  it("renders only matching cards for a shared query on the server", async () => {
    const element = await Books({
      searchParams: Promise.resolve({ q: "soil" }),
    });
    // Client enhancement and SSR use the same domain rule; no sample fallback.
    render(element);
    expect(
      document.querySelectorAll("[data-record-id]:not([hidden])"),
    ).toHaveLength(1);
  });
  it("keeps the subject pagination summary live through repeated filtering", () => {
    render(<ReadyDocument page="subject" />);
    const input = document.querySelector("#hero-subject-search")!;
    fireEvent.input(input, { target: { value: "greenhouse" } });
    expect(
      document.querySelector("#category-pagination-summary"),
    ).toHaveTextContent("Showing 1 of 6");
    fireEvent.input(input, { target: { value: "missingxyz" } });
    expect(
      document.querySelector("#category-pagination-summary"),
    ).toHaveTextContent("Showing 0 of 6");
    fireEvent.click(document.querySelector("#reset-filters-btn")!);
    expect(
      document.querySelector("#category-pagination-summary"),
    ).toHaveTextContent("Showing 6 of 6");
  });
  it("provides accessible book tabs with arrow-key navigation", () => {
    render(<ReadyDocument page="detail" />);
    const contents = screen.getByRole("tab", { name: /Table of Contents/ });
    fireEvent.click(contents);
    expect(contents).toHaveAttribute("aria-selected", "true");
    expect(document.querySelector("#tab-pane-overview")).toHaveAttribute(
      "hidden",
    );
    fireEvent.keyDown(contents, { key: "ArrowRight" });
    expect(
      screen.getByRole("tab", { name: /Author Biography/ }),
    ).toHaveAttribute("aria-selected", "true");
  });
});
