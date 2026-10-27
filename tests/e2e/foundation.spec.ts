import { expect, test } from "@playwright/test";

for (const width of [320, 390, 768, 1024, 1280, 1440]) {
  test(`homepage shell is usable at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(
      page.getByRole("heading", {
        name: "Ideas that advance knowledge.",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to content" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("main")).toBeFocused();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () =>
          document.fonts.check('16px "Manrope"') &&
          document.fonts.check('16px "Newsreader"'),
      ),
    ).toBe(true);
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: `/tmp/edtech-shell-${width}.png`,
        fullPage: true,
      });
    expect(errors).toEqual([]);
  });
}

test("unknown routes return HTTP 404 and a working home link", async ({
  page,
}) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to home" }).click();
  await expect(page).toHaveURL("/");
});

test("robots policy prevents crawling the unfinished site", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain("Disallow: /");
});

test("hero Enter and Search button both submit a shareable catalogue query", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("searchbox", { name: "Search the catalogue" })
    .fill("soil science");
  await page
    .getByRole("searchbox", { name: "Search the catalogue" })
    .press("Enter");
  await expect(page).toHaveURL(/\/books\?q=soil\+science$/);
  await expect(page.getByRole("status")).toContainText(
    "The catalogue is being prepared",
  );
  await expect(page.getByRole("searchbox")).toHaveValue("soil science");
  await page.goto("/");
  await page.getByRole("searchbox").fill("soil science");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page).toHaveURL(/\/books\?q=soil\+science$/);
});

test("mobile navigation supports keyboard, Escape, focus return and route selection", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.locator('button[aria-controls="mobile-navigation"]');
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  const navigation = page.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(
    navigation.getByRole("link", { name: "Home", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await navigation.getByRole("link", { name: "Books", exact: true }).click();
  await expect(page).toHaveURL("/books");
  await expect(navigation).toBeHidden();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    navigation.getByRole("link", { name: "Books", exact: true }),
  ).toHaveAttribute("aria-current", "page");
});

test("every internal shell destination resolves and retains header/footer", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const links = await page
    .locator('header a[href^="/"], footer a[href^="/"], main a[href^="/"]')
    .evaluateAll((elements) => [
      ...new Set(elements.map((element) => element.getAttribute("href")!)),
    ]);
  for (const href of links) {
    expect((await request.get(href)).status()).toBe(200);
    await page.goto(href);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  }
});

test("query input is bounded and never interpreted as markup", async ({
  page,
}) => {
  await page.goto(
    `/books?q=${encodeURIComponent('<script>alert("test")</script>')}`,
  );
  await expect(page.getByRole("searchbox")).toHaveValue(
    '<script>alert("test")</script>',
  );
  await expect(page.getByRole("status")).toContainText(
    '<script>alert("test")</script>',
  );
  await expect(page.locator("main script")).toHaveCount(0);
  await page.goto(`/books?q=${"a".repeat(250)}`);
  await expect(page.getByRole("searchbox")).toHaveValue("a".repeat(200));
});

test("navigation remains usable at 200 percent text size across breakpoints", async ({
  page,
}) => {
  for (const width of [320, 390, 640, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Text scaling at ${width}px`,
    ).toBe(true);
    await expect(page.getByRole("contentinfo")).toBeVisible();
  }
});

test("supporting routes remain within the viewport at all required widths", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/books", "/publish-with-us", "/contact"]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
      await expect(page.getByRole("contentinfo")).toBeVisible();
    }
  }
});
