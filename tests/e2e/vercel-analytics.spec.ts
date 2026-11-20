import { expect, test } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";

const origin = "http://127.0.0.1:3207";
let server: ChildProcess;
test.beforeAll(async () => {
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3207",
    ],
    {
      env: {
        ...process.env,
        VERCEL_ENV: "production",
        AEETDS_SITE_URL: "",
        AEETDS_PUBLIC_RELEASE: "false",
        AEETDS_DATA_DIR: "",
        AEETDS_APP_SECRET: "",
        AEETDS_SUBMISSIONS_ENABLED: "false",
      },
      stdio: "ignore",
    },
  );
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null)
      throw new Error("Analytics fixture server exited before readiness.");
    try {
      if ((await fetch(origin)).ok) return;
    } catch {
      /* Wait for local server readiness. */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Analytics fixture server did not become ready.");
});
test.afterAll(async () => {
  if (server && server.exitCode === null) {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    await exited;
  }
});
test("Vercel production mounts one real SDK script and registers the privacy filter", async ({
  page,
}) => {
  // Replace only the hosting-provided script; this test sends no real analytics traffic.
  await page.route("**/_vercel/insights/script.js", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: "window.__analyticsScriptLoaded = true;",
    }),
  );
  const response = await page.goto(
    `${origin}/?email=person%40example.test#private`,
  );
  expect(response?.headers()["referrer-policy"]).toBe("strict-origin");
  await expect(
    page.locator('script[src*="/_vercel/insights/script.js"]'),
  ).toHaveCount(1);
  await expect
    .poll(() =>
      page.evaluate(() =>
        Boolean(
          (window as unknown as { __analyticsScriptLoaded?: boolean })
            .__analyticsScriptLoaded,
        ),
      ),
    )
    .toBe(true);
  const filtered = await page.evaluate(() => {
    const hook = window.vaq?.find(([name]) => name === "beforeSend")?.[1];
    if (typeof hook !== "function")
      throw new Error("SDK beforeSend hook missing.");
    return {
      public: hook({
        type: "pageview",
        url: `${location.origin}/events?email=private#receipt`,
      }),
      private: hook({
        type: "pageview",
        url: `${location.origin}/admin?submission=private`,
      }),
      application: hook({
        type: "pageview",
        url: `${location.origin}/membership/apply`,
      }),
    };
  });
  expect(filtered).toEqual({
    public: { type: "pageview", url: `${origin}/events` },
    private: null,
    application: null,
  });
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Conferences & Events", exact: true })
    .click();
  await expect(page).toHaveURL(`${origin}/events`);
  await expect(
    page.locator('script[src*="/_vercel/insights/script.js"]'),
  ).toHaveCount(1);
  await page.goto(`${origin}/admin?submission=private`);
  await expect(
    page.getByRole("heading", { name: "Secretary administration" }),
  ).toBeVisible();
  await expect(
    page.locator('script[src*="/_vercel/insights/script.js"]'),
  ).toHaveCount(0);
});
