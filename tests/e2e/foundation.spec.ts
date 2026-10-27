import { expect, test, type Page } from "@playwright/test";

async function load(page: Page, route: string) {
  const response = await page.goto(route);
  await page.locator('.ready-document[data-enhanced="true"]').waitFor();
  return response;
}

const detail =
  "/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems";
const subject = "/subjects/horticulture-pomology";
const routes = ["/", "/books", subject, detail];

for (const width of [320, 390, 768, 1024, 1280, 1440]) {
  test(`four supplied pages render without overflow at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      expect((await load(page, route))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      expect(await page.locator('a[href="#"]').count()).toBe(0);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () =>
            [...document.images].filter((i) => i.complete && !i.naturalWidth)
              .length,
        ),
      ).toBe(0);
    }
    expect(errors).toEqual([]);
  });
}

test("hero search Enter/button and direct subject links work", async ({
  page,
}) => {
  await load(page, "/");
  const search = page.locator("#catalog-search-hero");
  await search.fill("soil");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/books\?q=soil/);
  await expect(page.locator("#resultCounter")).toHaveText("1 monographs");
  await load(page, "/");
  await page.locator("#catalog-search-hero").fill("soil");
  await page
    .locator("#catalog-search-hero")
    .locator("xpath=ancestor::form")
    .getByRole("button", { name: "Search", exact: true })
    .click();
  await expect(page.locator("#resultCounter")).toHaveText("1 monographs");
  await load(page, "/");
  await page
    .getByRole("link", { name: /Food, Nutrition & Home Science/ })
    .click();
  await expect(page.locator("#resultCounter")).toHaveText("1 monographs");
});

test("catalogue combines facets, sorts, switches view and resets", async ({
  page,
}) => {
  await load(page, "/books");
  await page.locator('.subject-chip[data-subject="Agronomy"]').click();
  await expect(page.locator("[data-record-id]:visible")).toHaveCount(2);
  await page.locator('.facet-lang-btn[data-lang="Bilingual"]').click();
  await expect(page.locator("[data-record-id]:visible")).toHaveCount(1);
  await expect(page.locator("#resultCounter")).toHaveText("1 monographs");
  await page.locator("#clearFiltersBtn").click();
  await page.locator("#sortSelector").selectOption("az");
  await expect(page.locator("#sortSelector")).toHaveValue("az");
  const titles = await page
    .locator("[data-record-id]:visible")
    .evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-title")),
    );
  expect(titles[0]).toBe("Agricultural Entomology Laboratory Manual");
  await page.locator("#viewListBtn").click();
  await expect(page.locator("#catalogGrid")).toHaveClass(/ready-list-view/);
  await page.locator("#viewGridBtn").click();
  await expect(page.locator("#catalogGrid")).not.toHaveClass(/ready-list-view/);
  await page.locator("#catalogSearch").fill("missing-xyz");
  await expect(page.locator("#catalogEmptyState")).toBeVisible();
  await page.locator("#emptyStateResetBtn").click();
  await expect(page.locator("[data-record-id]:visible")).toHaveCount(10);
});

test("subject filters and repeated result summaries remain accurate", async ({
  page,
}) => {
  await load(page, subject);
  await page.locator("#year-filter").selectOption("2025");
  await expect(page.locator("[data-record-id]:visible")).toHaveCount(2);
  await expect(page.locator("#category-pagination-summary")).toContainText(
    "Showing 2 of 6",
  );
  await page.locator("#hero-subject-search").fill("greenhouse");
  await expect(page.locator("[data-record-id]:visible")).toHaveCount(1);
  await expect(page.locator("#category-pagination-summary")).toContainText(
    "Showing 1 of 6",
  );
  await page.locator("#hero-subject-search").fill("missing-xyz");
  await expect(page.locator("#no-results")).toBeVisible();
  await page.locator("#empty-reset-btn").click();
  await expect(page.locator("[data-record-id]:visible")).toHaveCount(6);
  await expect(page.locator("#category-pagination-summary")).toContainText(
    "Showing 6 of 6",
  );
});

test("category and detail citation dialogs open, copy honestly and restore focus", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
  });
  await load(page, subject);
  const cite = page.getByRole("button", { name: "Cite", exact: true }).first();
  await cite.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("#modal-book-title")).toHaveText(
    "Modern Technologies in Tropical Fruit Cultivation",
  );
  await dialog
    .getByRole("button", { name: "Copy", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toHaveText("Citation copied.");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(cite).toBeFocused();
  await load(page, detail);
  await page.getByRole("button", { name: "Cite This Work" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("detail tabs, breadcrumbs and related book destinations work", async ({
  page,
  request,
}) => {
  await load(page, detail);
  await page.getByRole("tab", { name: "Table of Contents" }).click();
  await expect(
    page.getByRole("tabpanel", { name: "Table of Contents" }),
  ).toBeVisible();
  await page
    .getByRole("tab", { name: "Table of Contents" })
    .press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Author Biography" }),
  ).toHaveAttribute("aria-selected", "true");
  const related = await page
    .getByRole("link", { name: "View Details", exact: true })
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  expect(new Set(related).size).toBe(3);
  for (const href of related)
    expect((await request.get(href)).status()).toBe(200);
  await expect(
    page
      .getByRole("navigation", { name: "Breadcrumb", exact: true })
      .getByRole("link", { name: "Home", exact: true }),
  ).toHaveAttribute("href", "/");
});

test("mobile navigation supports Escape and exposes all real destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await load(page, "/");
  const trigger = page.locator("#mobile-nav-toggle");
  await trigger.focus();
  await trigger.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(menu).toBeHidden();
  await trigger.click();
  await menu
    .getByRole("link", { name: "Books Catalogue", exact: true })
    .click();
  await expect(page).toHaveURL("/books");
});

test("unknown pages, native aliases and crawl policy remain correct", async ({
  page,
  request,
}) => {
  expect((await load(page, "/books/missing-book"))?.status()).toBe(404);
  await page.getByRole("link", { name: "Return to home" }).click();
  await expect(page).toHaveURL("/");
  for (const path of [
    "/index.html",
    "/catalog.html",
    "/catagory.html",
    "/book_detail.html",
  ])
    expect((await request.get(path)).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
});

test("copy failures never claim success", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Denied");
        },
      },
    });
  });
  await load(page, detail);
  await page.getByRole("button", { name: "Cite This Work" }).click();
  await page.getByRole("button", { name: "Copy APA" }).click();
  await expect(page.getByRole("status")).toContainText("Copy failed");
});
