import { expect, test } from "@playwright/test";

const retired = [
  "/books",
  "/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems",
  "/books/missing-book",
  "/subjects",
  "/subjects/horticulture-pomology",
  "/publish-with-us",
  "/catalog.html",
  "/catagory.html",
  "/book_detail.html",
  "/cart",
  "/checkout",
  "/authors",
];
test("retired book-storefront URLs and aliases return real AEETDS 404s", async ({
  page,
}) => {
  for (const path of retired) {
    expect((await page.goto(path))?.status(), path).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore Conferences", exact: true }),
    ).toHaveAttribute("href", "/events");
    await expect(
      page.locator(
        'a[href^="/books"],a[href^="/subjects"],a[href="/publish-with-us"]',
      ),
    ).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toBeVisible();
  }
  await page
    .getByRole("link", { name: "Explore Conferences", exact: true })
    .click();
  await expect(page).toHaveURL("/events");
});
for (const width of [360, 1280])
  test(`Society 404 recovery remains usable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    expect((await page.goto("/books"))?.status()).toBe(404);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("link", { name: "Return to home", exact: true })
      .click();
    await expect(page).toHaveURL("/");
  });
test("public conference pages inherit one exact Google verification tag without storefront links or fake Analytics", async ({
  page,
  request,
}) => {
  for (const path of ["/", "/events", "/publications", "/about"]) {
    await page.goto(path);
    const verification = page.locator('meta[name="google-site-verification"]');
    await expect(verification).toHaveCount(1);
    await expect(verification).toHaveAttribute(
      "content",
      "GXYbw1Sr3OKYCNFMetw2x0VNiOWalUMHv1K9x1ICKv8",
    );
    await expect(
      page.locator(
        'a[href^="/books"],a[href^="/subjects"],a[href="/publish-with-us"]',
      ),
    ).toHaveCount(0);
    await expect(
      page.locator('script[src*="googletagmanager.com"]'),
    ).toHaveCount(0);
  }
  const homepageHtml = await (await request.get("/")).text();
  const serverHead = homepageHtml.match(/<head>([\s\S]*?)<\/head>/)?.[1] || "";
  expect(serverHead.match(/name="google-site-verification"/g)).toHaveLength(1);
  expect(serverHead).toContain("GXYbw1Sr3OKYCNFMetw2x0VNiOWalUMHv1K9x1ICKv8");
  expect((await request.get("/index.html")).status()).toBe(200);
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).not.toMatch(/\/(?:books|subjects|publish-with-us)/);
});
