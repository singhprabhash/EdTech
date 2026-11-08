import { expect, test } from "@playwright/test";

const route = "/about/vision-mission";
for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
  test(`Vision page renders all canonical sections at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    expect((await page.goto(route))?.status()).toBe(200);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Vision, Mission and Objectives",
    );
    await expect(page).toHaveTitle("Vision, Mission and Objectives | AEETDS");
    for (const heading of [
      "Why AEETDS",
      "Objectives",
      "Thrust Areas",
      "Core Values",
      "Be Part of a More Sustainable Agricultural Future",
    ])
      await expect(
        page.getByRole("heading", { name: heading, exact: true }),
      ).toBeVisible();
    await expect(
      page.getByRole("list", { name: "Society objectives" }).locator("li"),
    ).toHaveCount(9);
    await expect(
      page.getByRole("list", { name: "Thrust areas" }).locator("li"),
    ).toHaveCount(5);
    await expect(
      page.getByRole("list", { name: "Core values" }).locator("li"),
    ).toHaveCount(5);
    expect(
      await page.locator(".vision-objective-number").allTextContents(),
    ).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const cards = await page
      .locator(".vision-purpose-panels > article")
      .evaluateAll((items) =>
        items.map((item) => {
          const r = item.getBoundingClientRect();
          return { x: r.x, y: r.y, height: r.height };
        }),
      );
    if (width >= 1024) {
      expect(cards[0].y).toBe(cards[1].y);
      expect(cards[0].height).toBe(cards[1].height);
    } else expect(cards[1].y).toBeGreaterThan(cards[0].y);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    expect(
      await page.locator('a[href="#"], [data-path], main img').count(),
    ).toBe(0);
    if ([390, 768, 1440].includes(width))
      await page.screenshot({
        path: `/tmp/aeetds-vision-${width}.png`,
        fullPage: true,
      });
    expect(errors).toEqual([]);
  });
}

test("Vision navigation, refresh, mail actions and crawl allowance work", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(route);
  expect((await page.reload())?.status()).toBe(200);
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(
    nav.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(
    breadcrumb.getByRole("link", { name: "Home", exact: true }),
  ).toHaveAttribute("href", "/");
  await expect(
    breadcrumb.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("href", "/about");
  const cta = page.getByRole("region", {
    name: "Be Part of a More Sustainable Agricultural Future",
  });
  for (const link of await cta.getByRole("link").all())
    await expect(link).toHaveAttribute(
      "href",
      /^mailto:secretaryaeetds@gmail.com/,
    );
  await expect(
    cta.getByRole("link", { name: /Become a Member/ }),
  ).toHaveAttribute("href", /subject=AEETDS%20membership%20enquiry/);
  const policy = await (await request.get("/robots.txt")).text();
  expect(policy).toContain("Allow: /about/vision-mission$");
  expect(policy).toContain("Disallow: /");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
  await breadcrumb.getByRole("link", { name: "About", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "About the Society",
  );
});

test("Vision mobile shell retains keyboard and reduced motion behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.focus();
  await toggle.press("Enter");
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(
    nav.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(toggle).toBeFocused();
  const ticker = page.getByRole("region", { name: "Announcements" });
  await expect(ticker.getByRole("link")).toHaveCount(6);
  expect(
    await ticker
      .locator(".aeetds-ticker-track")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("Vision fixed pixel content text can double without clipping", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(route);
    await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll<HTMLElement>("main *"),
      ].filter(
        (el) =>
          !el.classList.contains("material-symbols-outlined") &&
          [...el.childNodes].some(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
          ),
      );
      const sizes = nodes.map((el) => ({
        el,
        size: parseFloat(getComputedStyle(el).fontSize),
        line: parseFloat(getComputedStyle(el).lineHeight),
      }));
      for (const { el, size, line } of sizes) {
        el.style.fontSize = `${size * 2}px`;
        if (Number.isFinite(line)) el.style.lineHeight = `${line * 2}px`;
      }
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `text doubled at ${width}px`,
    ).toBe(true);
    expect(
      await page
        .locator(".vision-thrust-grid > li")
        .evaluateAll((items) =>
          items.every((el) => el.scrollWidth <= el.clientWidth + 1),
        ),
    ).toBe(true);
  }
});
