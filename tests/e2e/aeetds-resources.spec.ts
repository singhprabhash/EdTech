import { expect, test } from "@playwright/test";
const routes = [
  ["/awards", "Awards & Fellowship"],
  ["/publications", "Publications"],
  ["/submit/guidelines", "Submission Guidelines"],
  ["/submit/registration", "Registration & Payment"],
];
for (const width of [360, 390, 768, 1024, 1280, 1440])
  test(`resources render and navigate at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 1000 });
    for (const [path, title] of routes) {
      expect((await page.goto(path))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page).toHaveTitle(`${title} | AEETDS`);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        path,
      ).toBe(true);
      expect(
        await page.locator('main a[href="#"],main a[download]').count(),
      ).toBe(0);
      if (path.startsWith("/submit/")) {
        const active = page
          .getByRole("navigation", { name: "Submit and Register" })
          .getByRole("link", { name: title, exact: true });
        await expect(active).toHaveAttribute("aria-current", "page");
        await expect
          .poll(async () =>
            active.evaluate((el) => {
              const r = el.getBoundingClientRect();
              return r.left >= 0 && r.right <= innerWidth;
            }),
          )
          .toBe(true);
      }
      await expect(page.getByRole("contentinfo")).toBeVisible();
    }
    expect(errors).toEqual([]);
  });
test("award filters work with an image-only photograph and no awardee directory", async ({
  page,
}) => {
  await page.goto("/awards");
  await page
    .getByLabel("Award group", { exact: true })
    .selectOption("lifetime");
  await expect(page.getByText("1 of 8 award groups displayed")).toBeVisible();
  await page.getByLabel("Award group", { exact: true }).selectOption("");
  await expect(page.getByText("8 of 8 award groups displayed")).toBeVisible();
  const photograph = page.locator(".resource-awards-photo");
  await expect(photograph.locator("img")).toBeVisible();
  await expect(photograph.locator("figcaption")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Past Awardees Directory" }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Search awardees")).toHaveCount(0);
});
test("submit entry redirects and checklist supports keyboard and reset", async ({
  page,
}) => {
  await page.goto("/submit");
  await expect(page).toHaveURL(/\/submit\/guidelines$/);
  const dock = page.getByRole("navigation", { name: "Guidelines sections" });
  await dock.getByRole("link").last().click();
  const boxes = page.getByRole("checkbox");
  await boxes.first().focus();
  await page.keyboard.press("Space");
  await expect(page.getByText("1 of 6 complete")).toBeVisible();
  for (let i = 1; i < 6; i++) await boxes.nth(i).check();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "6");
  await expect(
    page.getByText(/no manuscript has been submitted or validated/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset checklist" }).click();
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "0");
  await page
    .getByRole("navigation", { name: "Submit and Register" })
    .getByRole("link", { name: "Registration & Payment" })
    .click();
  await expect(page).toHaveURL(/\/submit\/registration$/);
});
test("registration validates, retains prepared details and never claims submission", async ({
  page,
}) => {
  await page.goto("/submit/registration");
  await expect(
    page.getByText("Online submission is not yet available.", { exact: true }),
  ).toBeVisible();
  const submit = page.getByRole("button", {
    name: "Submit Registration",
    exact: true,
  });
  await submit.click();
  await expect(
    page.getByRole("alert", { name: "Registration form errors" }),
  ).toBeFocused();
  const fields: Record<string, string> = {
    fullName: "Test Applicant",
    designation: "Scholar",
    institution: "Example institution",
    mobile: "+918000000000",
    email: "person@example.test",
    state: "Delhi",
    amountPaid: "5000",
    utr: "UTR-example",
    paymentDate: "2026-01-01",
  };
  for (const [key, value] of Object.entries(fields))
    await page.locator(`#registration-${key}`).fill(value);
  await page.locator("#registration-country").selectOption("India");
  await page
    .locator("#registration-category")
    .selectOption("Students / Research Scholars (India)");
  await page.locator("#registration-mode").selectOption("Offline");
  await page
    .locator("#registration-presentation")
    .selectOption("Attending only");
  await page.locator("#registration-receipt").setInputFiles({
    name: "receipt.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4"),
  });
  await page.locator("#registration-policy").check();
  await submit.click();
  await expect(
    page.getByRole("alert", { name: "Registration submission status" }),
  ).toContainText("Your registration has not been sent");
  await expect(page.locator("#registration-fullName")).toHaveValue(
    "Test Applicant",
  );
  await expect(page.getByText("receipt.pdf", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Remove receipt" }).click();
  await expect(page.getByText("receipt.pdf", { exact: true })).toHaveCount(0);
  expect(
    await page.evaluate(
      () =>
        Object.keys(localStorage).length + Object.keys(sessionStorage).length,
    ),
  ).toBe(0);
});

test("resource text can enlarge and guideline anchors clear the sticky navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  for (const [path] of routes) {
    await page.goto(path);
    await page.evaluate(() => {
      for (const el of document.querySelectorAll<HTMLElement>(
        "main h1,main h2,main h3,main p,main label,main td,main th,main a,main button",
      )) {
        el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * 2}px`;
      }
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      path,
    ).toBe(true);
  }
  await page.goto("/submit/guidelines");
  const dock = page.getByRole("navigation", { name: "Guidelines sections" });
  await dock.locator('a[href="#oral"]').click();
  await expect(dock.locator('a[href="#oral"]')).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect
    .poll(async () =>
      page.locator("#oral").evaluate((el) => {
        const dock = document.querySelector(".resource-guidelines-dock")!;
        return (
          el.getBoundingClientRect().top >=
          dock.getBoundingClientRect().bottom - 2
        );
      }),
    )
    .toBe(true);
});
