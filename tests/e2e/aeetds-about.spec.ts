import { expect, test } from "@playwright/test";

for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
  test(`About page loads with readable profile and chronology at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "About the Society",
    );
    await expect(page).toHaveTitle("About the Society | AEETDS");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /institutional background, registration details and journey/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator(".about-profile-rows > div")).toHaveCount(7);
    await expect(
      page.getByRole("list", { name: "Society milestones" }).locator("li"),
    ).toHaveCount(5);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const positions = await page
      .locator(".about-timeline-node")
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const r = node.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        }),
      );
    for (let i = 1; i < positions.length; i++) {
      expect(Math.abs(positions[i].x - positions[0].x)).toBeLessThan(1);
      expect(positions[i].y).toBeGreaterThan(positions[i - 1].y + 30);
    }
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      breadcrumb.getByRole("link", { name: "Home", exact: true }),
    ).toHaveAttribute("href", "/");
    const profile = page.getByRole("region", { name: "The Society in Brief" });
    await expect(
      profile.getByRole("link", { name: "secretaryaeetds@gmail.com" }),
    ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
    expect(
      await page.locator('a[href="#"], [data-path], img[src^="http"]').count(),
    ).toBe(0);
    if (width === 1440 || width === 390 || width === 768) {
      await page.screenshot({
        path: `/tmp/aeetds-about-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
}

test("About navigation stays active through refresh and mobile keyboard operation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/about");
  expect((await page.reload())?.status()).toBe(200);
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.focus();
  await toggle.press("Enter");
  const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(
    mobile.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    mobile.getByRole("link", { name: "Home", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(mobile).toBeHidden();
  await expect(toggle).toBeFocused();
  await page
    .getByRole("navigation", { name: "Breadcrumb" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Science, Enterprise and Environment for a Self-Reliant Farm Sector",
  );
  await toggle.click();
  await expect(
    mobile.getByRole("link", { name: "Home", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await mobile.getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL("/about");
});

test("About page reuses the ticker and handles enlarged text without clipping", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto("/about");
  const ticker = page.getByRole("region", { name: "Announcements" });
  await expect(ticker.getByRole("link")).toHaveCount(6);
  await ticker.getByRole("button", { name: "Pause announcements" }).click();
  await expect(ticker).toHaveAttribute("data-paused", "true");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await ticker
      .locator(".aeetds-ticker-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.locator(".about-profile-rows").scrollIntoViewIfNeeded();
  await expect(page.locator("header")).toBeInViewport();
});

test("all About content text can double including fixed pixel typography", async ({
  page,
}) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/about");
    await page.evaluate(() => {
      const text = [...document.querySelectorAll<HTMLElement>("main *")].filter(
        (el) =>
          !el.classList.contains("material-symbols-outlined") &&
          !el.closest('[role="img"]') &&
          [...el.childNodes].some(
            (node) =>
              node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
          ),
      );
      const sizes = text.map((el) => {
        const style = getComputedStyle(el);
        return {
          el,
          size: parseFloat(style.fontSize),
          line: parseFloat(style.lineHeight),
        };
      });
      for (const { el, size, line } of sizes) {
        el.style.fontSize = `${size * 2}px`;
        if (Number.isFinite(line)) el.style.lineHeight = `${line * 2}px`;
      }
    });
    expect(
      await page
        .locator(".about-background-copy p")
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
    ).toBe(32);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `text doubled at ${width}px`,
    ).toBe(true);
    const badge = page
      .locator(".about-profile-rows dd")
      .filter({ hasText: "LUC/00238/2024-25" })
      .locator("span");
    const sizes = await badge.evaluate((el) => ({
      width: el.getBoundingClientRect().width,
      available: el.parentElement!.getBoundingClientRect().width,
    }));
    expect(sizes.width).toBeLessThanOrEqual(sizes.available);
  }
});
