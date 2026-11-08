import { expect, test, type Page } from "@playwright/test";
const routes = [
  { path: "/membership", heading: "Become a Member of AEETDS" },
  { path: "/membership/apply", heading: "Apply for Membership" },
  {
    path: "/membership/acknowledgement",
    heading: "Application Acknowledgement",
  },
];
for (const width of [360, 768, 1280, 1440])
  test(`membership screens use the shared shell without overflow at ${width}px`, async ({
    page,
  }) => {
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
        route.heading,
      );
      if (width >= 1280)
        await expect(
          page
            .getByRole("navigation", { name: "Main navigation" })
            .getByRole("link", { name: "Membership", exact: true }),
        ).toHaveAttribute("aria-current", "page");
      else {
        await page
          .getByRole("button", { name: "Open navigation menu" })
          .click();
        await expect(
          page
            .getByRole("navigation", { name: "Mobile navigation" })
            .getByRole("link", { name: "Membership", exact: true }),
        ).toHaveAttribute("aria-current", "page");
        await page.keyboard.press("Escape");
      }
      await expect(
        page.getByRole("region", { name: "Announcements" }),
      ).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        route.path,
      ).toBe(true);
      expect(
        await page.locator('main a[href="#"], main [data-path]').count(),
      ).toBe(0);
      await page.screenshot({
        path: `/tmp/membership-${route.path.split("/").pop()}-${width}.png`,
        fullPage: true,
      });
    }
    expect(errors).toEqual([]);
  });
async function next(page: Page) {
  await page.getByRole("button", { name: "Next", exact: true }).click();
}
async function fillDetails(page: Page, category = "Student") {
  await page
    .getByLabel("Membership category", { exact: false })
    .selectOption(category);
  await page
    .getByLabel("Designation", { exact: false })
    .fill("Research scholar");
  await page
    .getByLabel("Institution / organisation", { exact: false })
    .fill("Example institution");
  await page
    .getByLabel("Highest qualification", { exact: false })
    .selectOption("Master's degree");
  await page
    .getByLabel("Discipline / specialisation", { exact: false })
    .selectOption("Other");
  await page
    .getByLabel("Other discipline / specialisation", { exact: false })
    .fill("Soil research");
}
async function fillPersonal(page: Page) {
  await page.getByLabel("Title", { exact: false }).selectOption("Ms.");
  await page.getByLabel("Full name", { exact: false }).fill("Test Applicant");
  await page
    .getByLabel("Email", { exact: false })
    .fill("applicant@example.test");
  await page
    .getByLabel("Mobile (WhatsApp)", { exact: false })
    .fill("+918000000000");
  await page.getByLabel("Date of birth", { exact: false }).fill("2000-01-01");
  await page.getByLabel("Nationality", { exact: false }).selectOption("Other");
  await page
    .getByLabel("Nationality details", { exact: false })
    .fill("Example nationality");
  await page
    .getByLabel("Postal address", { exact: false })
    .fill("Example street");
  await page.getByLabel("PIN / postal code", { exact: false }).fill("SW1A 1AA");
}
const photograph = {
  name: "photo.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
    "base64",
  ),
};
const proof = {
  name: "proof.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.4\nTest document"),
};
test("Student application validates uploads, preserves edits and never fabricates submission", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.goto("/membership/apply?category=Student");
  await expect(
    page.getByRole("combobox", { name: /^Membership category/ }),
  ).toHaveValue("Student");
  expect(
    await page.getByRole("option", { name: "Honorary", exact: true }).count(),
  ).toBe(0);
  await next(page);
  await expect(page.getByRole("main").getByRole("alert")).toBeFocused();
  const designation = page.getByLabel("Designation", { exact: false });
  await designation.focus();
  await designation.pressSequentially("Research scholar");
  await expect(designation).toBeFocused();
  await expect(designation).toHaveValue("Research scholar");
  await fillDetails(page);
  await next(page);
  await fillPersonal(page);
  await next(page);
  await page
    .getByLabel("Passport-size photograph", { exact: false })
    .setInputFiles({ ...photograph, buffer: Buffer.alloc(1024 * 1024 + 1) });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "1 MB or smaller",
  );
  await page
    .getByLabel("Passport-size photograph", { exact: false })
    .setInputFiles(photograph);
  await expect(
    page.getByAltText("Selected passport photograph preview"),
  ).toBeVisible();
  await page
    .getByLabel("Student ID / enrolment proof", { exact: false })
    .setInputFiles({ ...photograph, name: "proof.png" });
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Choose a PDF/JPG file.",
  );
  await page
    .getByLabel("Student ID / enrolment proof", { exact: false })
    .setInputFiles(proof);
  await page.getByRole("button", { name: "Previous", exact: true }).click();
  await expect(page.getByLabel("Full name", { exact: false })).toHaveValue(
    "Test Applicant",
  );
  await next(page);
  await expect(page.getByText("photo.png", { exact: true })).toBeVisible();
  await next(page);
  await page
    .getByLabel("Payment transaction (UTR) number", { exact: false })
    .fill("UTR-example");
  await page.getByLabel("Payment date", { exact: false }).fill("2026-01-01");
  await page
    .getByLabel("Payment receipt", { exact: false })
    .setInputFiles({ ...proof, name: "receipt.pdf" });
  await next(page);
  await expect(
    page.getByText("Ms. Test Applicant", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("photo.png", { exact: true })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Edit membership and professional information",
    })
    .click();
  await expect(
    page.getByLabel("Other discipline / specialisation", { exact: false }),
  ).toHaveValue("Soil research");
  await page.getByRole("button", { name: /5 Declaration and Review/ }).click();
  await page
    .getByLabel("I agree to abide by the Rules and Regulations of AEETDS.", {
      exact: false,
    })
    .check();
  await page
    .getByRole("button", { name: "Submit Application", exact: true })
    .click();
  await expect(page.getByRole("main").getByRole("alert")).toContainText(
    "Your application has not been sent",
  );
  await expect(page).toHaveURL(/\/membership\/apply/);
  expect(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
  ).toBe(0);
  await page.screenshot({
    path: "/tmp/membership-review-360.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Edit personal information" }).click();
  await expect(page.getByLabel("Email", { exact: false })).toHaveValue(
    "applicant@example.test",
  );
});
test("overview category links preselect public categories and acknowledgement ignores forged query data", async ({
  page,
}) => {
  await page.goto("/membership");
  const categories = page.getByRole("list", { name: "Membership categories" });
  await expect(categories.getByRole("listitem")).toHaveCount(6);
  await expect(
    categories.getByRole("listitem").last().getByRole("link"),
  ).toHaveCount(0);
  await categories
    .getByRole("link", { name: "Apply as Life Member", exact: true })
    .click();
  await expect(page).toHaveURL("/membership/apply?category=Life");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Apply for Membership",
  );
  await expect(
    page.getByRole("combobox", { name: /^Membership category/ }),
  ).toHaveValue("Life");
  await fillDetails(page, "Life");
  await next(page);
  await fillPersonal(page);
  await next(page);
  await expect(
    page.getByLabel("Student ID / enrolment proof", { exact: false }),
  ).toHaveCount(0);
  await page.goto(
    "/membership/acknowledgement?reference=AEETDS/MEMBERSHIP/2026/8419&status=accepted",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Application Acknowledgement",
  );
  await expect(page.getByRole("main")).toContainText(
    "No reference has been generated",
  );
  await expect(page.getByRole("main")).not.toContainText("8419");
  await expect(
    page.getByRole("button", { name: "Copy reference" }),
  ).toHaveCount(0);
  await page.getByRole("link", { name: "Back to Membership Overview" }).click();
  await expect(page).toHaveURL("/membership");
});
test("membership screens and controls remain usable with doubled text", async ({
  page,
}) => {
  for (const route of routes) {
    await page.setViewportSize({ width: 360, height: 900 });
    await page.goto(route.path);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      const nodes = [
        ...document.querySelectorAll<HTMLElement>("main *"),
      ].filter(
        (element) =>
          !element.classList.contains("material-symbols-outlined") &&
          ([...element.childNodes].some(
            (node) =>
              node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
          ) ||
            element.matches("input,textarea,select")),
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
    if (route.path.endsWith("apply")) {
      await next(page);
      await expect(page.getByRole("main").getByRole("alert")).toBeFocused();
      await expect(
        page.getByRole("combobox", { name: /^Membership category/ }),
      ).toBeVisible();
    }
  }
});
