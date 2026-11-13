import { expect, test } from "@playwright/test";
const routes = [
  {
    path: "/events",
    title: "Conferences & Events",
    heading: "Conferences & Events",
  },
  {
    path: "/events/crafns-2026",
    title: "CRAFNS-2026",
    heading:
      "International Conference on Advances in Agricultural and Allied Sciences for Climate-Resilient Food and Nutritional Security",
  },
  {
    path: "/events/ncfahs-2026",
    title: "NCFAHS-2026",
    heading:
      "National Conference on Frontiers in Agroforestry and Horticultural Sciences",
  },
  {
    path: "/events/fstat-2025",
    title: "FSTAT-2025",
    heading:
      "II International Conference on Frontiers in Science and Technology for Agricultural Transformation",
  },
  {
    path: "/events/iacrsaegns-2024",
    title: "IACRSAEGNS-2024",
    heading:
      "First International Conference on Innovations to Achieve Climate Resilient Smart Agriculture for Ensuring Global Food and Nutritional Security",
  },
  {
    path: "/events/trainings-workshops",
    title: "Trainings & Workshops",
    heading: "Training Programmes & Workshops",
  },
];
for (const width of [360, 390, 768, 1024, 1280, 1440])
  test(`all six event screens work at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      expect((await page.goto(route.path))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("main img").evaluateAll(async (elements) =>
        Promise.all(
          elements.map((element) => {
            const image = element as HTMLImageElement;
            image.loading = "eager";
            return image.decode();
          }),
        ),
      );
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        route.heading,
      );
      await expect(page).toHaveTitle(`${route.title} | AEETDS`);
      if (width >= 1280)
        await expect(
          page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("link", { name: "Conferences & Events", exact: true }),
        ).toHaveAttribute("aria-current", "page");
      else {
        const toggle = page.getByRole("button", {
          name: "Open navigation menu",
        });
        await toggle.click();
        await expect(
          page
            .getByRole("navigation", { name: "Mobile navigation" })
            .getByRole("link", { name: "Conferences & Events", exact: true }),
        ).toHaveAttribute("aria-current", "page");
        await page.keyboard.press("Escape");
        await expect(toggle).toBeFocused();
      }
      const main = page.getByRole("main");
      await expect(main).not.toContainText(/361|24 states/i);
      if (route.path === "/events") {
        const featured = page.getByRole("region", {
          name: "Featured Upcoming Assembly",
        });
        await expect(featured).toContainText("10-11 December, 2026");
        await expect(featured).toContainText(
          "ICAR - National Academy of Agricultural Research Management (ICAR-NAARM), Rajendranagar, Hyderabad – 500030, Telangana, India",
        );
        await expect(featured).not.toContainText(
          /Host institution|To be announced/i,
        );
      }
      expect(
        await main
          .locator(
            'a[href="#"], [data-path], a[download]:not([href="/aeetds/documents/crafns-2026-brochure.pdf"])',
          )
          .count(),
      ).toBe(0);
      // The existing shared ticker keeps its planned destinations; new event
      // content must use working enquiries until those submission routes exist.
      expect(
        await main
          .locator(
            'section:not([aria-label="Announcements"]) a[href="/submit/registration"], section:not([aria-label="Announcements"]) a[href="/submit/abstract"]',
          )
          .count(),
      ).toBe(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route.path,
      ).toBe(true);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      if ([390, 768, 1440].includes(width))
        await page.screenshot({
          path: `/tmp/events-${route.path.split("/").pop()}-${width}.png`,
          fullPage: true,
        });
    }
    expect(errors).toEqual([]);
  });
test("event cards, breadcrumb, training links and refresh all work", async ({
  page,
}) => {
  await page.goto("/events");
  await page
    .getByRole("link", { name: "View Conference Details", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL("/events/crafns-2026");
  await expect(
    page.getByRole("link", { name: "Registration", exact: true }),
  ).toHaveAttribute("href", "https://forms.gle/AyASGfqcDvEtHaTV8");
  await expect(
    page.getByRole("link", { name: "Abstract Submission", exact: true }),
  ).toHaveAttribute("href", "https://forms.gle/3CD99LypP1iszLF16");
  await expect(page.getByRole("main")).toContainText("To be announced");
  for (const item of routes.slice(2, 5)) {
    await page
      .getByRole("navigation", { name: "Breadcrumb" })
      .getByRole("link", { name: "Conferences & Events", exact: true })
      .click();
    await expect(page).toHaveURL("/events");
    await page
      .getByRole("link", {
        name: `View ${item.title} conference details`,
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(item.path);
    expect((await page.reload())?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      item.heading,
    );
    await page.getByRole("link", { name: "Back to Past Conferences" }).click();
    await expect(page).toHaveURL("/events#past-conferences");
    await page
      .getByRole("link", { name: "Upcoming Conference", exact: true })
      .first()
      .click();
  }
  await page.goto("/events");
  await page.getByRole("link", { name: "Explore Training Programmes" }).click();
  await expect(page).toHaveURL("/events/trainings-workshops");
  await expect(
    page.getByRole("link", { name: "Write to the Secretary", exact: true }),
  ).toHaveAttribute("href", /^mailto:secretaryaeetds@gmail.com/);
});
test("calendar renders confirmed dates, handles year rollover and exposes selected events", async ({
  page,
}) => {
  await page.goto("/events");
  const calendar = page.getByRole("region", {
    name: "Academic Calendar & Schedule",
  });
  const next = calendar.getByRole("button", {
    name: "Next month",
    exact: true,
  });
  const previous = calendar.getByRole("button", {
    name: "Previous month",
    exact: true,
  });
  const fifteen = calendar.getByRole("button", {
    name: "15 July 2026 — confirmed conference",
    exact: true,
  });
  await fifteen.focus();
  await fifteen.press("ArrowRight");
  await expect(
    calendar.getByRole("button", {
      name: "16 July 2026 — confirmed conference",
      exact: true,
    }),
  ).toBeFocused();
  await expect(
    calendar.getByRole("link", {
      name: "View Conference Details",
      exact: true,
    }),
  ).toHaveAttribute("href", "/events/ncfahs-2026");
  await next.click();
  await expect(calendar.getByRole("table")).toHaveAttribute(
    "aria-label",
    "August 2026 calendar",
  );
  await expect(
    calendar.getByRole("button", { name: /confirmed conference/ }),
  ).toHaveCount(0);
  await expect(calendar).toContainText(
    "No confirmed conference is listed for this date.",
  );
  for (let index = 0; index < 11; index++) await previous.click();
  await expect(calendar.getByRole("table")).toHaveAttribute(
    "aria-label",
    "September 2025 calendar",
  );
  await calendar
    .getByRole("button", {
      name: "25 September 2025 — confirmed conference",
      exact: true,
    })
    .click();
  await expect(
    calendar.getByRole("link", {
      name: "View Conference Details",
      exact: true,
    }),
  ).toHaveAttribute("href", "/events/fstat-2025");
  for (let index = 0; index < 10; index++) await previous.click();
  await expect(calendar.getByRole("table")).toHaveAttribute(
    "aria-label",
    "November 2024 calendar",
  );
  await calendar
    .getByRole("button", {
      name: "18 November 2024 — confirmed conference",
      exact: true,
    })
    .click();
  await expect(
    calendar.getByRole("link", {
      name: "View Conference Details",
      exact: true,
    }),
  ).toHaveAttribute("href", "/events/iacrsaegns-2024");
  await expect(
    calendar.getByRole("link", { name: "Upcoming Conference", exact: true }),
  ).toHaveAttribute("href", "/events/crafns-2026");
  for (let index = 0; index < 2; index++) await next.click();
  await expect(calendar.getByRole("table")).toHaveAttribute(
    "aria-label",
    "January 2025 calendar",
  );
});
for (const [slug, count] of [
  ["ncfahs-2026", 3],
  ["fstat-2025", 2],
  ["iacrsaegns-2024", 2],
] as const)
  test(`${slug} gallery supports dialog, keys, backdrop and focus restoration`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/events/${slug}`);
    const first = page.getByRole("button", { name: /^Enlarge photograph 1:/ });
    await first.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("status")).toHaveText(
      `Photograph 1 of ${count}`,
    );
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(
      "hidden",
    );
    await expect(
      dialog.getByRole("button", { name: "Close photograph viewer" }),
    ).toBeFocused();
    for (let cycle = 0; cycle < 6; cycle++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((element) =>
          element.contains(document.activeElement),
        ),
      ).toBe(true);
    }
    const backgroundScroll = await page.evaluate(() => window.scrollY);
    await page.mouse.move(2, 2);
    await page.mouse.wheel(0, 600);
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    expect(await page.evaluate(() => window.scrollY)).toBe(backgroundScroll);
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("status")).toHaveText(
      `Photograph 2 of ${count}`,
    );
    await dialog.getByRole("img").click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Next photograph" }).click();
    await expect(dialog.getByRole("status")).toHaveText(
      `Photograph ${count === 3 ? 3 : 1} of ${count}`,
    );
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("status")).toHaveText(
      `Photograph 2 of ${count}`,
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    await first.click();
    await page.mouse.click(2, 2);
    await expect(dialog).toBeHidden();
    await expect(first).toBeFocused();
    await page.setViewportSize({ width: 360, height: 844 });
    await first.click();
    await expect(dialog).toBeVisible();
    expect(
      await dialog.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    await dialog
      .getByRole("button", { name: "Close photograph viewer" })
      .click();
    await expect(first).toBeFocused();
  });
test("failed photograph requests show the neutral fallback", async ({
  page,
}) => {
  await page.route("**/_next/image?**", (route) => route.abort());
  await page.goto("/events/ncfahs-2026");
  await expect(
    page.getByText("Photograph unavailable", { exact: true }).first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("all event screens remain usable with doubled text", async ({ page }) => {
  for (const route of routes) {
    await page.setViewportSize({ width: 360, height: 1000 });
    await page.goto(route.path);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll<HTMLElement>("main *"),
      ].filter(
        (element) =>
          !element.classList.contains("material-symbols-outlined") &&
          [...element.childNodes].some(
            (node) =>
              node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
          ),
      );
      const sizes = nodes.map((element) => ({
        element,
        size: parseFloat(getComputedStyle(element).fontSize),
        line: parseFloat(getComputedStyle(element).lineHeight),
      }));
      for (const { element, size, line } of sizes) {
        element.style.fontSize = `${size * 2}px`;
        if (Number.isFinite(line)) element.style.lineHeight = `${line * 2}px`;
      }
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route.path,
    ).toBe(true);
  }
});

test("current conference brochure is available everywhere and downloads the actual PDF", async ({
  page,
  request,
}) => {
  const href = "/aeetds/documents/crafns-2026-brochure.pdf";
  const response = await request.get(href);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
  for (const route of ["/", "/events", "/events/crafns-2026", "/downloads"]) {
    await page.goto(route);
    const brochure = page.locator(`a[href="${href}"]`).first();
    await expect(brochure).toBeVisible();
    await expect(brochure).toHaveAttribute(
      "download",
      "CRAFNS-2026-Brochure.pdf",
    );
  }
  const pending = page.waitForEvent("download");
  await page.locator(`a[href="${href}"]`).first().click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("CRAFNS-2026-Brochure.pdf");
  expect(await download.failure()).toBeNull();
});
