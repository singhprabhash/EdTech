import { test, expect } from "@playwright/test";
import { spawn, type ChildProcess } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { hashPassword } from "../../src/server/auth.mjs";
import { closeDatabases } from "../../src/server/database.mjs";
const origin = "http://127.0.0.1:3201";
let server: ChildProcess;
let directory: string;
const password = "Synthetic test account only 2026!";
test.beforeAll(async () => {
  directory = mkdtempSync(path.join(tmpdir(), "aeetds-browser-admin-"));
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3201",
    ],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        AEETDS_SITE_URL: origin,
        AEETDS_ALLOW_LOCAL_HTTP: "true",
        AEETDS_DATA_DIR: directory,
        AEETDS_APP_SECRET: "Synthetic browser test secret only 2026",
        AEETDS_ADMIN_PASSWORD_HASH: hashPassword(password),
        AEETDS_SUBMISSIONS_ENABLED: "false",
      },
      stdio: "ignore",
    },
  );
  await expect
    .poll(
      async () => {
        try {
          return (await fetch(origin + "/admin")).status;
        } catch {
          return 0;
        }
      },
      { timeout: 60000 },
    )
    .toBe(200);
});
test.afterAll(async () => {
  if (server && server.exitCode === null) {
    const stopped = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    await stopped;
  }
  closeDatabases();
  if (directory) rmSync(directory, { recursive: true, force: true });
});
test("Secretary signs in, publishes validated content, sees changes publicly, and signs out", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto(origin + "/admin");
  await expect(page.getByLabel("Administrator password")).toBeVisible();
  await page.getByLabel("Administrator password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Administration" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ticker", exact: true }).click();
  const rows = page.locator("fieldset");
  await expect(
    rows.first().getByRole("textbox", { name: "Text", exact: true }),
  ).toBeVisible();
  await rows
    .first()
    .getByRole("textbox", { name: "Text", exact: true })
    .fill("Approved synthetic announcement for browser verification.");
  await page
    .getByRole("button", { name: "Save and publish", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(/saved/i);
  const publicPage = await page.context().newPage();
  await publicPage.goto(origin + "/");
  await expect(
    publicPage
      .getByRole("region", { name: "Announcements" })
      .getByText("Approved synthetic announcement for browser verification.", {
        exact: true,
      })
      .first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "Events", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Add entry", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Private submissions", exact: true })
    .click();
  const authenticated = await page.request.get(
    origin + "/api/admin/submissions",
  );
  expect(authenticated.status()).toBe(200);
  expect(authenticated.headers()["cache-control"]).toContain("no-store");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Sign in", exact: true }),
  ).toBeVisible();
  expect(
    (await page.request.get(origin + "/api/admin/submissions")).status(),
  ).toBe(401);
  await publicPage.close();
});
