import { expect, test } from "@playwright/test";

for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
  test(`AEETDS homepage responds at ${width}px with canonical local assets`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(
      "AEETDS Lucknow | Agriculture, Entrepreneur, Environment & Technology Development Society",
    );
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Science, Enterprise and Environment for a Self-Reliant Farm Sector",
    );
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const gallery = page.getByRole("region", {
      name: "AEETDS conference photographs",
    });
    await expect(gallery.locator("img").first()).toBeVisible();
    await gallery
      .locator("img")
      .first()
      .evaluate((img: HTMLImageElement) => img.decode());
    expect(
      await page.evaluate(() =>
        [...document.images].every(
          (img) => !img.complete || img.naturalWidth > 0,
        ),
      ),
    ).toBe(true);
    expect(await page.locator('img[src^="http"]').count()).toBe(0);
    expect(await page.locator('a[href="#"], [data-path]').count()).toBe(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await page
      .getByRole("heading", { name: "AEETDS at a Glance" })
      .scrollIntoViewIfNeeded();
    await expect(page.locator("header")).toBeInViewport();
    if (width === 1440 || width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `/tmp/aeetds-home-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}

test("mobile navigation supports keyboard, Escape, link close and planned routes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.focus();
  await toggle.press("Enter");
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(
    menu.getByRole("link", { name: "Home", exact: true }),
  ).toBeFocused();
  await expect(
    menu.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("href", "/about");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.getByRole("link", { name: "Home", exact: true }).click();
  await expect(menu).toBeHidden();
  const quick = page.getByRole("complementary", {
    name: "Quick Links & Actions",
  });
  for (const [name, path] of Object.entries({
    "Membership Form": "/membership/apply",
    "Conference Registration": "/submit/registration",
    "Abstract Submission": "/submit/guidelines",
    "Award Nomination": "/awards#nomination",
    "Downloads & Brochures": "/downloads",
    "Contact Secretariat": "/contact",
  }))
    await expect(
      quick.getByRole("link", { name: new RegExp(name) }),
    ).toHaveAttribute("href", path);
});

test("slideshow autoplay, hover/focus pause and manual controls work", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  const gallery = page.getByRole("region", {
    name: "AEETDS conference photographs",
  });
  await expect(gallery.getByText("1 / 4")).toBeVisible();
  await page.clock.fastForward(5100);
  await expect(gallery.getByText("2 / 4")).toBeVisible();
  await gallery.hover();
  await page.clock.fastForward(11000);
  await expect(gallery.getByText("2 / 4")).toBeVisible();
  await page.getByRole("heading", { level: 1 }).hover();
  await page.clock.fastForward(5100);
  await expect(gallery.getByText("3 / 4")).toBeVisible();
  await gallery.getByRole("button", { name: "Pause slideshow" }).click();
  await page.clock.fastForward(10000);
  await expect(gallery.getByText("3 / 4")).toBeVisible();
  await gallery.getByRole("button", { name: "Next slide" }).click();
  await expect(gallery.getByText("4 / 4")).toBeVisible();
  await gallery.getByRole("button", { name: "Next slide" }).click();
  await expect(gallery.getByText("1 / 4")).toBeVisible();
  await gallery.getByRole("button", { name: "Go to slide 3" }).click();
  await expect(
    gallery.getByRole("button", { name: "Go to slide 3" }),
  ).toHaveAttribute("aria-pressed", "true");
  await gallery
    .getByRole("button", { name: "Previous slide" })
    .press("ArrowLeft");
  await expect(gallery.getByText("2 / 4")).toBeVisible();
});

test("ticker pause, focus visibility and reduced-motion preferences work", async ({
  page,
}) => {
  await page.goto("/");
  const ticker = page.getByRole("region", { name: "Announcements" });
  const track = ticker.locator(".aeetds-ticker-track");
  await ticker.hover();
  expect(
    await track.evaluate((el) => getComputedStyle(el).animationPlayState),
  ).toBe("paused");
  await ticker.getByRole("button", { name: "Pause announcements" }).click();
  await expect(ticker).toHaveAttribute("data-paused", "true");
  await ticker.getByRole("link").last().focus();
  await expect(ticker.getByRole("link").last()).toBeInViewport();
  expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    "none",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe(
    "none",
  );
  await expect(ticker.getByRole("link")).toHaveCount(6);
  const gallery = page.getByRole("region", {
    name: "AEETDS conference photographs",
  });
  await expect(
    gallery.getByRole("button", { name: "Play slideshow" }),
  ).toBeDisabled();
  await gallery.getByRole("button", { name: "Next slide" }).click();
  await expect(gallery.getByText("2 / 4")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("200 percent text remains usable and email/phone links reach AEETDS", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const emails = page.locator('a[href="mailto:secretaryaeetds@gmail.com"]');
  expect(await emails.count()).toBeGreaterThanOrEqual(3);
  for (const phone of ["+918009529170", "+917408206291", "+919198666776"])
    await expect(page.locator(`a[href="tel:${phone}"]`)).toHaveCount(1);
});

test("landscape mobile menu keeps the last link visible with 200 percent text", async ({
  page,
}) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const contact = page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Contact", exact: true });
  await contact.focus();
  const bounds = await contact.boundingBox();
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(375);
});
