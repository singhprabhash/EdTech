import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../../src/app/page";
import NotFound from "../../src/app/not-found";
import { metadata } from "../../src/app/layout";

describe("reference application foundation", () => {
  it("renders the supplied homepage sections and real local artwork", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Ideas that advance knowledge.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Browse by Academic Subject" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Featured Academic Monographs" }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('img[src^="/reference-assets/"]'),
    ).not.toBeNull();
    expect(document.querySelector('a[href="#"]')).toBeNull();
  });
  it("keeps supplied design content unindexed pending factual reconciliation", () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
  it("offers native not-found recovery with reference chrome", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Return to home" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
