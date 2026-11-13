import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../../src/app/page";

let reduced = false;
beforeEach(() => {
  reduced = false;
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: reduced,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("AEETDS homepage", () => {
  it("renders canonical sections and planned CTAs without unverified claims", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Science, Enterprise and Environment for a Self-Reliant Farm Sector",
    );
    for (const name of [
      "Welcome to AEETDS",
      "What We Do",
      "AEETDS at a Glance",
      "Our Collaborators",
      "Latest News & Updates",
      "Quick Links & Actions",
    ])
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Become a Member/ })[0],
    ).toHaveAttribute("href", "/membership/apply");
    expect(
      screen.getByRole("link", { name: /Abstract Submission/ }),
    ).toHaveAttribute("href", "/submit/guidelines");
    expect(document.querySelector('a[href="#"]')).toBeNull();
    expect(document.body).not.toHaveTextContent(
      /PAN|12A|226002|early registrations|portal active|zero non-academic|biennial audit/i,
    );
    expect(
      [...document.querySelectorAll("img")].find((image) =>
        decodeURIComponent(image.src).includes("/aeetds/logo.png"),
      ),
    ).not.toBeNull();
    expect(document.body).not.toHaveTextContent(/361|24 states/i);
  });
  it("opens the mobile menu, focuses a link and returns focus on Escape", () => {
    render(<Home />);
    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const nav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveFocus();
    fireEvent.keyDown(nav, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
  it("makes the duplicated ticker inaccessible and supports pausing", () => {
    render(<Home />);
    const ticker = screen.getByRole("region", { name: "Announcements" });
    expect(within(ticker).getAllByRole("link")).toHaveLength(6);
    expect(ticker.querySelector('[aria-hidden="true"][inert]')).not.toBeNull();
    const pause = within(ticker).getByRole("button", {
      name: "Pause announcements",
    });
    fireEvent.click(pause);
    expect(
      within(ticker).getByRole("button", { name: "Play announcements" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
  it("advances every five seconds, wraps manually and respects pause", () => {
    vi.useFakeTimers();
    const view = render(<Home />);
    const gallery = screen.getByRole("region", {
      name: "AEETDS conference photographs",
    });
    expect(within(gallery).getByText("1 / 4")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(within(gallery).getByText("2 / 4")).toBeInTheDocument();
    fireEvent.click(
      within(gallery).getByRole("button", { name: "Pause slideshow" }),
    );
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(within(gallery).getByText("2 / 4")).toBeInTheDocument();
    fireEvent.click(
      within(gallery).getByRole("button", { name: "Go to slide 4" }),
    );
    fireEvent.click(
      within(gallery).getByRole("button", { name: "Next slide" }),
    );
    expect(within(gallery).getByText("1 / 4")).toBeInTheDocument();
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("disables autoplay for reduced motion and still permits manual navigation", () => {
    reduced = true;
    vi.useFakeTimers();
    render(<Home />);
    const gallery = screen.getByRole("region", {
      name: "AEETDS conference photographs",
    });
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    expect(within(gallery).getByText("1 / 4")).toBeInTheDocument();
    fireEvent.click(
      within(gallery).getByRole("button", { name: "Next slide" }),
    );
    expect(within(gallery).getByText("2 / 4")).toBeInTheDocument();
  });
  it("does not autoplay when first rendered in a background tab", () => {
    vi.useFakeTimers();
    const hidden = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    const view = render(<Home />);
    act(() => {
      vi.advanceTimersByTime(15000);
    });
    const gallery = screen.getByRole("region", {
      name: "AEETDS conference photographs",
    });
    expect(within(gallery).getByText("1 / 4")).toBeInTheDocument();
    hidden.mockReturnValue(false);
    fireEvent(document, new Event("visibilitychange"));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(within(gallery).getByText("2 / 4")).toBeInTheDocument();
    view.unmount();
    hidden.mockRestore();
  });
  it("closes navigation with Escape when focus returns to its trigger", () => {
    render(<Home />);
    const toggle = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(toggle);
    toggle.focus();
    fireEvent.keyDown(toggle, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });
});
