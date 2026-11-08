import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/about",
  "/about/vision-mission",
  "/about/governance",
  "/about/partners",
  "/membership",
  "/membership/apply",
  "/events",
  "/events/crafns-2026",
  "/events/ncfahs-2026",
  "/events/fstat-2025",
  "/events/iacrsaegns-2024",
  "/events/trainings-workshops",
  "/awards",
  "/publications",
  "/submit/guidelines",
  "/submit/registration",
  "/contact",
  "/contact/faqs",
  "/policies",
  "/downloads",
  "/books",
  "/subjects/horticulture-pomology",
  "/books/frontier-agronomy-for-climate-smart-digital-and-natural-farming-systems",
  "/publish-with-us",
];
for (const width of [360, 768, 1280])
  test(`official semantic theme applies across all routes at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      const tokens = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return [
          "primary",
          "primary-dark",
          "accent",
          "secondary",
          "background",
          "on-surface",
        ].map((name) =>
          style.getPropertyValue(`--color-${name}`).trim().toLowerCase(),
        );
      });
      expect(tokens, route).toEqual([
        "#0b6b3a",
        "#074a28",
        "#e3ae1f",
        "#1d5f8c",
        "#fafaf7",
        "#1e2329",
      ]);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route,
      ).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/,
      );
      expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
    }
    expect(errors).toEqual([]);
  });
for (const width of [360, 1280])
  test(`WCAG AA checks on representative page families at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(180000);
    await page.setViewportSize({ width, height: 1000 });
    const violations = [];
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      for (const violation of result.violations)
        violations.push({
          route,
          id: violation.id,
          impact: violation.impact,
          nodes: violation.nodes.map((node) => ({
            target: node.target,
            summary: node.failureSummary,
          })),
        });
    }
    expect(violations).toEqual([]);
  });
test("unconfigured server fails closed and private administration is not indexed", async ({
  page,
  request,
}) => {
  const status = await request.get("/api/submissions/config");
  expect(await status.json()).toMatchObject({
    enabled: false,
    uploadsEnabled: false,
    siteKey: null,
  });
  expect(
    (await request.post("/api/submissions/ENQUIRY", { data: {} })).status(),
  ).toBe(503);
  for (const path of [
    "/api/admin/submissions",
    "/api/admin/files/00000000-0000-0000-0000-000000000000",
  ])
    expect([401, 503]).toContain((await request.get(path)).status());
  await page.goto("/admin");
  await expect(
    page.getByRole("heading", { name: "Secretary administration" }),
  ).toBeVisible();
  await expect(page.getByText(/Administration is unavailable/)).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect(
    (await request.get("/media/00000000-0000-0000-0000-000000000000")).status(),
  ).toBe(404);
});
