import { existsSync } from "node:fs";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import NotFound from "../../src/app/not-found";
import { publicSocietyRoutes } from "../../src/config/seo";

beforeEach(() =>
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  })),
);
afterEach(() => vi.unstubAllGlobals());

it("retires storefront route modules while preserving all public Society pages", () => {
  for (const route of [
    "books",
    "books/[slug]",
    "subjects",
    "subjects/[slug]",
    "publish-with-us",
  ])
    expect(existsSync(`src/app/${route}/page.tsx`), route).toBe(false);
  for (const route of publicSocietyRoutes)
    expect(
      existsSync(`src/app${route === "/" ? "" : route}/page.tsx`),
      route,
    ).toBe(true);
});
it("offers conference recovery in an AEETDS 404 without publisher storefront navigation", () => {
  render(<NotFound />);
  expect(
    screen.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  expect(
    screen.getByRole("link", { name: "Explore Conferences" }),
  ).toHaveAttribute("href", "/events");
  expect(
    document.querySelector(
      'a[href^="/books"],a[href^="/subjects"],a[href="/publish-with-us"]',
    ),
  ).toBeNull();
  expect(document.body).toHaveTextContent("AEETDS");
});
