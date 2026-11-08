import { expect, test } from "@playwright/test";

const routes = [
  { path: "/about", title: "About the Society" },
  { path: "/about/vision-mission", title: "Vision, Mission and Objectives" },
  { path: "/about/governance", title: "Governance & Executive Council" },
  { path: "/about/partners", title: "Partners and Collaborators" },
];
for (const width of [320, 360, 390, 768, 1024, 1280, 1440]) {
  test(`all four About pages form a coherent section at ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.setViewportSize({ width, height: 1000 });
    for (const route of routes) {
      expect((await page.goto(route.path))?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        route.title,
      );
      await expect(page).toHaveTitle(`${route.title} | AEETDS`);
      if (width < 1280) {
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
        await expect(
          page
            .getByRole("navigation", { name: "Mobile navigation" })
            .getByRole("link", { name: "About", exact: true }),
        ).toHaveAttribute("aria-current", "page");
        await page.keyboard.press("Escape");
      } else {
        await expect(
          page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("link", { name: "About", exact: true }),
        ).toHaveAttribute("aria-current", "page");
      }
      const nav = page.getByRole("navigation", { name: "About section" });
      await expect(nav.getByRole("link")).toHaveCount(4);
      const active = nav.locator('[aria-current="page"]');
      await expect(active).toHaveCount(1);
      await expect(active).toHaveAttribute("href", route.path);
      await expect(active).toBeInViewport();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route.path,
      ).toBe(true);
      expect(await page.locator('a[href="#"], [data-path]').count()).toBe(0);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        "noindex, nofollow",
      );
      if (width === 390 || width === 768 || width === 1440)
        await page.screenshot({
          path: `/tmp/aeetds-section-${route.path.split("/").pop()}-${width}.png`,
          fullPage: true,
        });
    }
    expect(errors).toEqual([]);
  });
}

test("all secondary links navigate, activate and refresh across the About hierarchy", async ({
  page,
}) => {
  await page.goto("/about");
  for (const route of [...routes.slice(1), routes[0]]) {
    const nav = page.getByRole("navigation", { name: "About section" });
    await nav.locator(`a[href="${route.path}"]`).click();
    await expect(page).toHaveURL(route.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      route.title,
    );
    expect((await page.reload())?.status()).toBe(200);
    await expect(
      page
        .getByRole("navigation", { name: "About section" })
        .locator('[aria-current="page"]'),
    ).toHaveAttribute("href", route.path);
  }
});

test("mobile secondary navigation exposes focused links and preserves global Escape behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about/partners");
  const nav = page.getByRole("navigation", { name: "About section" });
  // Reduced motion shows all six announcements, placing this section below
  // the fold on short screens. Verify horizontal visibility after scrolling.
  await nav.scrollIntoViewIfNeeded();
  await expect(nav.locator('[aria-current="page"]')).toBeInViewport();
  for (const link of await nav.getByRole("link").all()) {
    await link.focus();
    await expect(link).toBeInViewport();
  }
  const toggle = page.getByRole("button", { name: "Open navigation menu" });
  await toggle.focus();
  await toggle.press("Enter");
  await expect(
    page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

test("governance pending names, committees and text-only partner directory remain honest", async ({
  page,
}) => {
  await page.goto("/about/governance");
  const president = page.getByRole("article", { name: "President" });
  await expect(president).toContainText("Prof. (Dr.) F.A. Khan");
  const pending = page.getByRole("note", {
    name: "Secretary confirmation required",
  });
  await expect(pending).toContainText("Dr. Niyaz Ahmad");
  await expect(pending).toContainText("confirmation required");
  expect(await page.locator("main img").count()).toBe(0);
  await expect(
    page
      .getByRole("table", { name: "Committees and responsibilities" })
      .locator("tbody tr"),
  ).toHaveCount(5);
  await expect(
    page
      .getByRole("table", { name: "Committees and responsibilities" })
      .getByRole("columnheader"),
  ).toHaveText(["Committee", "Function"]);
  await expect(
    page.getByRole("heading", { name: "Governance Information", exact: true }),
  ).toBeVisible();
  const contact = page.getByRole("region", {
    name: "Societies Registration Act XXI of 1860",
    exact: true,
  });
  await expect(
    contact.getByRole("link", { name: "Contact Secretariat", exact: true }),
  ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
  await expect(
    contact.getByRole("link", { name: "About AEETDS", exact: true }),
  ).toHaveAttribute("href", "/about");
  await contact
    .getByRole("link", { name: "About AEETDS", exact: true })
    .click();
  await expect(page).toHaveURL("/about");
  await page.goto("/about/partners");
  await expect(
    page
      .getByRole("list", { name: "Collaborating institutions" })
      .locator("li"),
  ).toHaveCount(8);
  expect(await page.locator("main img").count()).toBe(0);
  await expect(
    page.getByRole("link", { name: "Contact the Secretary", exact: true }),
  ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
});

test("new pages and secondary navigation support doubled content text", async ({
  page,
}) => {
  for (const width of [320, 768, 1280])
    for (const route of routes.slice(2)) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(route.path);
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
      const nav = page.getByRole("navigation", { name: "About section" });
      await nav.locator('[aria-current="page"]').focus();
      await expect(nav.locator('[aria-current="page"]')).toBeInViewport();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route.path} at ${width}px`,
      ).toBe(true);
    }
});

test("Partners directory follows one/two/four columns and offers usable Secretariat links", async ({
  page,
}) => {
  for (const [width, columns] of [
    [390, 1],
    [768, 2],
    [1440, 4],
  ]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/about/partners");
    await page.evaluate(() => document.fonts.ready);
    const entries = page
      .getByRole("list", { name: "Collaborating institutions" })
      .getByRole("listitem");
    await expect(entries).toHaveCount(8);
    const firstRow = await entries.evaluateAll((elements) => {
      const top = elements[0].getBoundingClientRect().top;
      return elements.filter(
        (element) => Math.abs(element.getBoundingClientRect().top - top) < 1,
      ).length;
    });
    expect(firstRow, `${width}px directory columns`).toBe(columns);
    await expect(
      page.getByText("8 Listed Collaborators", { exact: true }),
    ).toBeVisible();
  }
  const invitation = page.getByRole("region", {
    name: "Institutional Alliances & Collaborative Programs",
  });
  for (const phone of ["+91-8009529170", "+91-7408206291", "+91-9198666776"]) {
    const link = invitation.getByRole("link", { name: phone, exact: true });
    await expect(link).toHaveAttribute(
      "href",
      `tel:${phone.replaceAll("-", "")}`,
    );
    await link.focus();
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    const focusContrast = await link.evaluate((element) => {
      const luminance = (color: string) => {
        const channels = color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return (
          channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        );
      };
      let background = element.parentElement!;
      while (
        getComputedStyle(background).backgroundColor === "rgba(0, 0, 0, 0)"
      )
        background = background.parentElement!;
      const outline = luminance(getComputedStyle(element).outlineColor);
      const surface = luminance(getComputedStyle(background).backgroundColor);
      return (
        (Math.max(outline, surface) + 0.05) /
        (Math.min(outline, surface) + 0.05)
      );
    });
    expect(
      focusContrast,
      "Secretariat keyboard focus contrast",
    ).toBeGreaterThanOrEqual(3);
  }
  await expect(
    invitation.getByRole("link", {
      name: "secretaryaeetds@gmail.com",
      exact: true,
    }),
  ).toHaveAttribute("href", "mailto:secretaryaeetds@gmail.com");
  await invitation
    .getByRole("link", { name: "View Society Governance" })
    .click();
  await expect(page).toHaveURL("/about/governance");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Governance & Executive Council",
  );
});
