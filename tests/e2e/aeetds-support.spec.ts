import { expect, test } from "@playwright/test";
const routes = [
  { path: "/contact", title: "Contact Us" },
  { path: "/contact/faqs", title: "Frequently Asked Questions" },
  { path: "/policies", title: "Policies" },
];
for (const width of [360, 390, 768, 1024, 1280, 1440])
  test(`three support screens work at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      expect((await page.goto(route.path))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        route.title,
      );
      await expect(page).toHaveTitle(`${route.title} | AEETDS`);
      if (route.path.startsWith("/contact")) {
        if (width >= 1280)
          await expect(
            page
              .getByRole("navigation", { name: "Main navigation" })
              .getByRole("link", { name: "Contact", exact: true }),
          ).toHaveAttribute("aria-current", "page");
        else {
          await page
            .getByRole("button", { name: "Open navigation menu" })
            .click();
          await expect(
            page
              .getByRole("navigation", { name: "Mobile navigation" })
              .getByRole("link", { name: "Contact", exact: true }),
          ).toHaveAttribute("aria-current", "page");
          await page.keyboard.press("Escape");
        }
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route.path,
      ).toBe(true);
      expect(
        await page
          .locator('main a[href="#"],main iframe,main a[download]')
          .count(),
      ).toBe(0);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      if (route.path === "/contact" && width >= 1024) {
        const info = await page.locator(".support-information").boundingBox();
        const form = await page.locator(".support-form-panel").boundingBox();
        expect(info!.width / form!.width).toBeCloseTo(5 / 7, 1);
        expect(info!.x).toBeLessThan(form!.x);
      }
    }
    expect(errors).toEqual([]);
  });
test("contact validates and preserves input without simulating enquiry delivery", async ({
  page,
}) => {
  await page.goto("/contact");
  const send = page.getByRole("button", { name: "Send Message" });
  await send.click();
  await expect(
    page.getByRole("alert", { name: "Contact form errors" }),
  ).toBeFocused();
  const name = page.getByLabel("Full Name *");
  await name.fill("Test Applicant");
  await expect(name).toBeFocused();
  await page.getByLabel("Email Address *").fill("person@example.test");
  await page.getByLabel("Subject / Enquiry Category *").selectOption("Other");
  await page.getByLabel("Message *").fill("An enquiry for the Society.");
  await send.click();
  await expect(
    page.getByRole("alert", { name: "Contact submission status" }),
  ).toContainText("Your enquiry has not been sent");
  await expect(page.getByLabel("Message *")).toHaveValue(
    "An enquiry for the Society.",
  );
  await expect(
    page.getByText("Office location to be updated", { exact: true }),
  ).toBeVisible();
  for (const phone of [
    "+918009529170",
    "+917408206291",
    "+919198666776",
    "+917042360966",
  ])
    await expect(
      page.locator(`.support-information a[href="tel:${phone}"]`),
    ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        Object.keys(localStorage).length + Object.keys(sessionStorage).length,
    ),
  ).toBe(0);
  await page.reload();
  await expect(page.getByLabel("Message *")).toHaveValue("");
});
test("FAQ combines category/answer search, keyboard accordion and current-result schema", async ({
  page,
}) => {
  await page.goto("/contact/faqs");
  const schema = () =>
    page
      .locator('main script[type="application/ld+json"]')
      .evaluate((el) => JSON.parse(el.textContent ?? "null"));
  expect((await schema()).mainEntity).toHaveLength(11);
  const first = page.getByRole("button", { name: /Who can become a member/ });
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("region", { name: /Who can become/ }),
  ).toContainText("including students, farmers and entrepreneurs.");
  await page.keyboard.press("Space");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await page.getByLabel("Search questions and answers").fill("concessional");
  await expect(page.getByRole("status")).toHaveText("1 of 11 questions");
  expect((await schema()).mainEntity).toHaveLength(1);
  await page
    .getByRole("group", { name: "FAQ categories" })
    .getByRole("button", { name: /Awards & Honors/ })
    .click();
  await expect(page.getByText("No matching questions found.")).toBeVisible();
  await expect(
    page.locator('main script[type="application/ld+json"]'),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(page.getByRole("status")).toHaveText("11 of 11 questions");
  await page
    .getByRole("navigation", { name: "Contact and information" })
    .getByRole("link", { name: "Policies", exact: true })
    .click();
  await expect(page).toHaveURL(/\/policies$/);
});
for (const width of [390, 1440])
  test(`policy reader supports direct hashes, history, scrolling and active navigation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/policies#publication-ethics");
    const nav = page.getByRole("navigation", { name: "Policy sections" });
    await expect(nav.locator('a[href="#publication-ethics"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    const clearHeader = () =>
      page.locator("#publication-ethics").evaluate((el) => {
        const header = document
          .querySelector(".aeetds-header")!
          .getBoundingClientRect().bottom;
        const side = document
          .querySelector(".support-policy-sidebar")!
          .getBoundingClientRect();
        return (
          el.getBoundingClientRect().top >=
          (innerWidth < 1024 ? side.bottom : header) - 2
        );
      });
    await expect.poll(clearHeader).toBe(true);
    if (width < 1024)
      await expect
        .poll(() =>
          nav.locator("[aria-current]").evaluate((el) => {
            const r = el.getBoundingClientRect();
            return r.left >= 0 && r.right <= innerWidth;
          }),
        )
        .toBe(true);
    await nav.locator('a[href="#privacy-policy"]').click();
    await expect(page).toHaveURL(/#privacy-policy$/);
    await expect(nav.locator('a[href="#privacy-policy"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    await page.goBack();
    await expect(page).toHaveURL(/#publication-ethics$/);
    await expect(nav.locator('a[href="#publication-ethics"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    await page.locator("#terms-of-use").evaluate((el) => el.scrollIntoView());
    await expect(nav.locator('a[href="#terms-of-use"]')).toHaveAttribute(
      "aria-current",
      "location",
    );
    await page.goto("/policies#%E0%A4%A");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Policies",
    );
  });
test("all support content remains usable with doubled text and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(route.path);
    await page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll<HTMLElement>(
          ".aeetds-support h1,.aeetds-support h2,.aeetds-support h3,.aeetds-support p,.aeetds-support a,.aeetds-support label,.aeetds-support button,.aeetds-support span,.aeetds-support dt,.aeetds-support dd",
        ),
      ];
      const sizes = elements.map(
        (el) => parseFloat(getComputedStyle(el).fontSize) * 2,
      );
      elements.forEach(
        (el, index) => (el.style.fontSize = `${sizes[index]}px`),
      );
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route.path,
    ).toBe(true);
  }
});

test("direct policy links align after delayed fonts change mobile text geometry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  let releaseFonts: () => void = () => {};
  const fontsReady = new Promise<void>((resolve) => {
    releaseFonts = resolve;
  });
  await page.route("**/fonts/*.woff2", async (route) => {
    await fontsReady;
    await route.continue();
  });
  await page.goto("/policies#publication-ethics", {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page
      .getByRole("navigation", { name: "Policy sections" })
      .locator('[aria-current="location"]'),
  ).toContainText("Publication Ethics");
  releaseFonts();
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page
        .locator("#publication-ethics")
        .evaluate(
          (el) =>
            el.getBoundingClientRect().top >=
            document
              .querySelector(".support-policy-sidebar")!
              .getBoundingClientRect().bottom,
        ),
    )
    .toBe(true);
});
