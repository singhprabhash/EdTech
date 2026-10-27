"use client";

import { useRouter } from "next/navigation";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  catalogueQueryFromParams,
  queryCatalogue,
  type CatalogueQuery,
  type CatalogueRecord,
} from "../domain/catalogue";

const emptyQuery: CatalogueQuery = {};

// Progressive enhancement is scoped to this one inert, server-rendered document.
// Source scripts are never evaluated. Pure catalogue rules live in the domain module.
export default function ReadyInteractions({
  children,
  page,
  records,
  initialQuery = emptyQuery,
}: {
  children: ReactNode;
  page: string;
  records: CatalogueRecord[];
  initialQuery?: CatalogueQuery;
}) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const controller = new AbortController();
    const options = { signal: controller.signal };
    const one = <T extends HTMLElement = HTMLElement>(selector: string) =>
      scope.querySelector<T>(selector);
    const all = <T extends HTMLElement = HTMLElement>(selector: string) =>
      Array.from(scope.querySelectorAll<T>(selector));
    const header = one("header");
    const drawer = one("#mobile-menu-drawer");
    const toggle = one<HTMLButtonElement>("#mobile-nav-toggle");
    const modal = one<HTMLDialogElement>("#citation-modal");
    const input = one<HTMLInputElement>(
      page === "subject" ? "#hero-subject-search" : "#catalogSearch",
    );
    const grid = one("#catalogGrid, #books-grid");
    const cards = all<HTMLElement>("[data-record-id]");
    let query: CatalogueQuery = {
      ...initialQuery,
      ...catalogueQueryFromParams(new URLSearchParams(location.search)),
    };
    let returnFocus: HTMLElement | null = null;
    let statusTimer: ReturnType<typeof setTimeout> | undefined;

    const measure = () => {
      if (header)
        scope.style.setProperty(
          "--ready-header-height",
          `${header.getBoundingClientRect().height}px`,
        );
    };
    measure();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    if (header) observer?.observe(header);
    const menu = (open: boolean, restore = false) => {
      drawer?.classList.toggle("hidden", !open);
      toggle?.setAttribute("aria-expanded", String(open));
      toggle?.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu",
      );
      const icon = one("#mobile-nav-icon");
      if (icon) icon.textContent = open ? "close" : "menu";
      if (restore) toggle?.focus();
    };
    const closeModal = () => {
      if (modal?.open) modal.close();
      modal?.classList.add("hidden");
      modal?.classList.remove("flex");
      returnFocus?.focus();
    };
    const announce = (message: string) => {
      setStatus(message);
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => setStatus(""), 5000);
    };
    const update = (write = true) => {
      if (!grid) return;
      const selected = queryCatalogue(records, query);
      const ids = new Set(selected.map((r) => r.id));
      for (const card of cards)
        card.hidden = !ids.has(card.dataset.recordId ?? "");
      for (const record of selected) {
        const card = cards.find((c) => c.dataset.recordId === record.id);
        if (card) grid.appendChild(card);
      }
      const count = selected.length;
      for (const id of ["#visible-count", "#pag-visible-count"]) {
        const n = one(id);
        if (n) n.textContent = String(count);
      }
      const counter = one("#resultCounter");
      if (counter) {
        counter.textContent = `${count} monographs`;
        counter.setAttribute("aria-live", "polite");
      }
      const summary = one("#paginationSummary");
      if (summary)
        summary.textContent = `Displaying ${count} of ${records.length} catalogued monographs`;
      const categorySummary = one("#category-pagination-summary");
      if (categorySummary)
        categorySummary.textContent = `Showing ${count} of ${records.length} titles in Horticulture & Pomology archive`;
      const empty = one("#catalogEmptyState, #no-results");
      if (empty) {
        empty.classList.toggle("hidden", count !== 0);
        empty.classList.toggle("flex", count === 0);
        empty.setAttribute("role", "status");
      }
      const clear = one("#clearSearchInputBtn");
      clear?.classList.toggle("hidden", !query.q);
      if (input && input.value !== (query.q ?? "")) input.value = query.q ?? "";
      for (const select of all<HTMLSelectElement>(
        "#sortSelector, #year-filter, #format-filter",
      )) {
        const key =
          select.id === "sortSelector"
            ? "sort"
            : select.id === "year-filter"
              ? "year"
              : "format";
        select.value = query[key] ?? (key === "sort" ? "newest" : "all");
      }
      for (const button of all<HTMLButtonElement>(
        ".subject-chip, .facet-year-btn, .facet-lang-btn, .facet-type-btn, .filter-btn",
      )) {
        const key = button.dataset.subject
          ? "subject"
          : button.classList.contains("facet-year-btn")
            ? "year"
            : button.classList.contains("facet-lang-btn")
              ? "language"
              : button.classList.contains("facet-type-btn")
                ? "type"
                : "category";
        const value =
          button.dataset.subject ??
          button.dataset.year ??
          button.dataset.lang ??
          button.dataset.type ??
          button.dataset.category;
        const active = (query[key] ?? "all") === value;
        button.classList.remove("bg-primary", "text-on-primary", "active");
        button.classList.add(
          "bg-surface-container-low",
          "text-on-surface-variant",
        );
        button.classList.toggle("ready-filter-active", active);
        button.setAttribute("aria-pressed", String(active));
        if (button.getAttribute("role") === "tab")
          button.setAttribute("aria-selected", String(active));
      }
      if (write) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(query))
          if (v && v !== "all") params.set(k, v);
        history.replaceState(
          null,
          "",
          location.pathname + (params.size ? `?${params}` : "") + location.hash,
        );
      }
    };
    const tab = (name: string, focus = false) => {
      for (const button of all<HTMLButtonElement>("[data-tab]")) {
        const active = button.dataset.tab === name;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        button.classList.toggle("ready-filter-active", active);
        button.classList.remove("bg-primary", "text-on-primary");
        if (active && focus) button.focus();
      }
      for (const panel of all(".tab-pane")) {
        const active = panel.id === `tab-pane-${name}`;
        panel.hidden = !active;
        panel.classList.toggle("hidden", !active);
      }
    };
    const openCitation = (trigger: HTMLElement) => {
      if (!modal) return;
      returnFocus = trigger;
      const title = trigger.dataset.book;
      if (title) {
        const fields: Record<string, string> = {
          "#modal-book-title": title,
          "#modal-book-authors": trigger.dataset.authors ?? "",
          "#modal-book-isbn": `ISBN: ${trigger.dataset.isbn ?? ""}`,
          "#cite-apa": `${trigger.dataset.authors} (${trigger.dataset.year}). ${title}. EdTech Publications.`,
          "#cite-chicago": `${trigger.dataset.authors} ${trigger.dataset.year}. ${title}. EdTech Publications.`,
        };
        for (const [selector, value] of Object.entries(fields)) {
          const field = one(selector);
          if (field) field.textContent = value;
        }
      }
      modal.classList.remove("hidden");
      modal.classList.add("flex");
      modal.showModal();
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const control = target.closest<HTMLElement>("button, a");
      if (toggle && control === toggle) {
        menu(toggle.getAttribute("aria-expanded") !== "true");
        return;
      }
      if (
        toggle?.getAttribute("aria-expanded") === "true" &&
        (!drawer?.contains(target) || target.closest("a"))
      )
        menu(false);
      if (!control) return;
      if (control.dataset.tab) {
        tab(control.dataset.tab);
        return;
      }
      if (
        control.dataset.openCitation ||
        control.classList.contains("open-citation-btn")
      ) {
        openCitation(control);
        return;
      }
      if (
        control.dataset.closeCitation ||
        ["close-modal-btn", "modal-done-btn"].includes(control.id)
      ) {
        closeModal();
        return;
      }
      const copyTarget =
        control.dataset.copyTarget ??
        (control.classList.contains("copy-cite-btn")
          ? control.dataset.target
          : undefined);
      if (copyTarget) {
        const value = one(`#${CSS.escape(copyTarget)}`)?.textContent?.trim();
        if (value) {
          if(!navigator.clipboard) { announce("Copy unavailable. Select and copy the citation text manually."); return; }
          void navigator.clipboard.writeText(value).then(
            () => announce("Citation copied."),
            () =>
              announce(
                "Copy failed. Select the citation text and copy it manually.",
              ),
          );
        }
        return;
      }
      if (
        [
          "clearFiltersBtn",
          "emptyStateResetBtn",
          "reset-filters-btn",
          "empty-reset-btn",
        ].includes(control.id)
      ) {
        query = {};
        update();
        return;
      }
      if (control.id === "clearSearchInputBtn") {
        query.q = "";
        update();
        input?.focus();
        return;
      }
      if (control.id === "viewListBtn" || control.id === "viewGridBtn") {
        const list = control.id === "viewListBtn";
        grid?.classList.toggle("ready-list-view", list);
        one("#viewListBtn")?.setAttribute("aria-pressed", String(list));
        one("#viewGridBtn")?.setAttribute("aria-pressed", String(!list));
        return;
      }
      if (control.id === "hero-search-btn") {
        query.q = input?.value.slice(0, 200) ?? "";
        update();
        return;
      }
      if (control.classList.contains("quick-tag")) {
        query.q = control.dataset.query;
        update();
        return;
      }
      if (
        control.matches(
          ".subject-chip, .facet-year-btn, .facet-lang-btn, .facet-type-btn, .filter-btn",
        )
      ) {
        if (control.dataset.subject) query.subject = control.dataset.subject;
        else if (control.classList.contains("facet-year-btn"))
          query.year = control.dataset.year;
        else if (control.classList.contains("facet-lang-btn"))
          query.language = control.dataset.lang;
        else if (control.classList.contains("facet-type-btn"))
          query.type = control.dataset.type;
        else query.category = control.dataset.category;
        update();
        return;
      }
      const hero = one<HTMLInputElement>("#catalog-search-hero");
      if (
        page === "home" &&
        hero &&
        control.tagName === "BUTTON" &&
        control.closest("form") === hero.closest("form") &&
        control.getAttribute("type") !== "submit"
      ) {
        hero.value = (control.textContent ?? "")
          .trim()
          .replace(/^ISBN:\s*/, "");
        hero.form?.requestSubmit();
      }
    };
    scope.addEventListener("click", onClick, options);
    scope.addEventListener(
      "input",
      (event) => {
        if (input && event.target === input) {
          query.q = input.value.slice(0, 200);
          update();
        }
      },
      options,
    );
    scope.addEventListener(
      "change",
      (event) => {
        const select = event.target;
        if (!(select instanceof HTMLSelectElement)) return;
        if (select.id === "sortSelector") query.sort = select.value;
        if (select.id === "year-filter") query.year = select.value;
        if (select.id === "format-filter") query.format = select.value;
        update();
      },
      options,
    );
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          if (modal?.open) closeModal();
          else menu(false, true);
        }
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "k"
        ) {
          event.preventDefault();
          (
            input ?? one<HTMLInputElement>('header input[type="search"]')
          )?.focus();
        }
        const target = event.target;
        if (
          target instanceof HTMLInputElement &&
          target.type === "search" &&
          event.key === "Enter" &&
          !target.form
        ) {
          event.preventDefault();
          if (target === input) {
            query.q = target.value;
            update();
          } else
            router.push(
              `/books?q=${encodeURIComponent(target.value.slice(0, 200))}`,
            );
        }
        if (
          target instanceof HTMLElement &&
          target.dataset.tab &&
          ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
        ) {
          event.preventDefault();
          const tabs = all<HTMLButtonElement>("[data-tab]");
          const index = tabs.indexOf(target as HTMLButtonElement);
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? tabs.length - 1
                : (index +
                    (event.key === "ArrowRight" ? 1 : -1) +
                    tabs.length) %
                  tabs.length;
          tab(tabs[next].dataset.tab!, true);
        }
      },
      options,
    );
    modal?.addEventListener(
      "cancel",
      (event) => {
        event.preventDefault();
        closeModal();
      },
      options,
    );
    modal?.addEventListener(
      "click",
      (event) => {
        if (event.target === modal) closeModal();
      },
      options,
    );
    window.addEventListener(
      "resize",
      () => {
        if (innerWidth >= 1280) menu(false);
        measure();
      },
      options,
    );
    window.addEventListener(
      "popstate",
      () => {
        query = catalogueQueryFromParams(new URLSearchParams(location.search));
        update(false);
      },
      options,
    );
    for (const link of all<HTMLAnchorElement>("header nav a"))
      if (link.pathname === location.pathname)
        link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    if (page === "detail") tab("overview");
    update(false);
    return () => {
      controller.abort();
      observer?.disconnect();
      clearTimeout(statusTimer);
    };
  }, [page, records, initialQuery, router]);
  return (
    <div ref={root} className="ready-document" data-ready-page={page}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={status ? "ready-status" : "sr-only"}
      >
        {status}
      </div>
    </div>
  );
}
