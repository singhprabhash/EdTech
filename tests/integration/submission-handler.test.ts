// @vitest-environment node
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import { configuration } from "../../src/server/config.mjs";
import { database, closeDatabases } from "../../src/server/database.mjs";
import { handleSubmission } from "../../src/server/submissions";
import { deliverOutbox } from "../../src/server/mail.mjs";
import {
  sniffFile,
  privateFilePath,
  storeUpload,
} from "../../src/server/files.mjs";
import { verifyCaptcha } from "../../src/server/captcha.mjs";
const dirs: string[] = [];
afterEach(() => {
  closeDatabases();
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function setup() {
  const directory = mkdtempSync(path.join(tmpdir(), "aeetds-handler-"));
  dirs.push(directory);
  return configuration({
    AEETDS_DATA_DIR: directory,
    AEETDS_SITE_URL: "https://example.test",
    AEETDS_APP_SECRET: "test-only-secret-longer-than-32-characters",
    AEETDS_SUBMISSIONS_ENABLED: "true",
    SMTP_HOST: "smtp.example.test",
    SMTP_PORT: "465",
    SMTP_USER: "test",
    SMTP_PASSWORD: "test",
    SMTP_FROM: "sender@example.test",
    TURNSTILE_SECRET_KEY: "test",
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "test",
  });
}
const values = {
  fullName: "Test Applicant",
  email: "person@example.test",
  phone: "",
  subject: "Other",
  message: "A question for the Society.",
};
function request(
  id = randomUUID(),
  change = {},
  origin = "https://example.test",
  honey = "",
) {
  const form = new FormData();
  form.set("values", JSON.stringify({ ...values, ...change }));
  form.set("requestId", id);
  form.set("captchaToken", "test");
  form.set("website", honey);
  return new Request("https://example.test/api/submissions/ENQUIRY", {
    method: "POST",
    headers: { Origin: origin },
    body: form,
  });
}
it("fails closed without config and rejects origin, honeypot, invalid fields and failed CAPTCHA", async () => {
  expect(
    (
      await handleSubmission(request(), "ENQUIRY", {
        config: configuration({}),
      })
    ).status,
  ).toBe(503);
  const config = setup();
  const captcha = vi.fn(async () => false);
  expect(
    (
      await handleSubmission(
        request(randomUUID(), {}, "https://attacker.test"),
        "ENQUIRY",
        { config, captcha },
      )
    ).status,
  ).toBe(403);
  expect(
    (
      await handleSubmission(
        request(randomUUID(), {}, "https://example.test", "bot"),
        "ENQUIRY",
        { config, captcha },
      )
    ).status,
  ).toBe(400);
  const invalid = await handleSubmission(
    request(randomUUID(), { email: "bad" }),
    "ENQUIRY",
    { config, captcha },
  );
  expect((await invalid.json()).fieldErrors.email).toBeTruthy();
  expect(
    (await handleSubmission(request(), "ENQUIRY", { config, captcha })).status,
  ).toBe(400);
  expect(
    database(config.storage)
      .prepare("SELECT COUNT(*) n FROM submissions")
      .get()!.n,
  ).toBe(0);
});
it("persists valid submissions before acceptance and makes same-content retries idempotent", async () => {
  const config = setup(),
    id = randomUUID(),
    captcha = vi.fn(async () => true);
  const first = await handleSubmission(request(id), "ENQUIRY", {
    config,
    captcha,
  });
  expect(first.status).toBe(201);
  const accepted = await first.json();
  expect(accepted.receipt.reference).toMatch(/^AEETDS\/ENQUIRY\/\d{4}\/1$/);
  expect(accepted.receipt.acknowledgementEmail).toBe("pending");
  expect(
    (await handleSubmission(request(id), "ENQUIRY", { config, captcha }))
      .status,
  ).toBe(200);
  expect(captcha).toHaveBeenCalledTimes(1);
  expect(
    (
      await handleSubmission(
        request(id, { message: "Changed content" }),
        "ENQUIRY",
        { config, captcha },
      )
    ).status,
  ).toBe(409);
  const db = database(config.storage);
  expect(db.prepare("SELECT COUNT(*) n FROM submissions").get()!.n).toBe(1);
  expect(db.prepare("SELECT COUNT(*) n FROM outbox").get()!.n).toBe(2);
});
it("keeps persisted enquiry and retries mail failures with official recipient and validated Reply-To", async () => {
  const config = setup();
  await handleSubmission(request(), "ENQUIRY", {
    config,
    captcha: async () => true,
  });
  const db = database(config.storage);
  const failing = {
    sendMail: vi.fn(async () => {
      throw new Error("private provider detail must not be stored");
    }),
  };
  expect(await deliverOutbox(db, config, failing, 1000)).toEqual({
    sent: 0,
    failed: 2,
  });
  expect(db.prepare("SELECT COUNT(*) n FROM submissions").get()!.n).toBe(1);
  const sendMail = vi.fn(async (options: { to: string }) => ({
    accepted: [options.to],
  }));
  expect(await deliverOutbox(db, config, { sendMail }, 100000)).toEqual({
    sent: 2,
    failed: 0,
  });
  expect(sendMail.mock.calls[0][0]).toMatchObject({
    to: "secretaryaeetds@gmail.com",
    replyTo: "person@example.test",
  });
  expect(sendMail.mock.calls[1][0]).toMatchObject({
    to: "person@example.test",
    replyTo: "secretaryaeetds@gmail.com",
  });
  expect(
    db.prepare("SELECT last_code FROM outbox LIMIT 1").get()!.last_code,
  ).toBeNull();
});
it("requires file signatures, private keys and successful scanning before storing uploads", async () => {
  const config = setup();
  const pdf = Buffer.from("%PDF-1.4\nfixture document\n%%EOF");
  expect(sniffFile(pdf, "pdf")).toBe("application/pdf");
  expect(sniffFile(Buffer.from("forged"), "pdf")).toBeNull();
  expect(() =>
    privateFilePath(config.storage, "../../public/secret.pdf"),
  ).toThrow();
  const file = new File([pdf], "receipt.pdf", { type: "application/pdf" });
  const stored = await storeUpload(
    config.storage,
    file,
    "receipt",
    config,
    async () => {},
  );
  expect(stored.storage_key).not.toContain("receipt");
  expect(stored.mime).toBe("application/pdf");
  await expect(
    storeUpload(config.storage, file, "receipt", config, async () => {
      throw new Error("virus");
    }),
  ).rejects.toThrow(/safety scan/);
});
it("checks CAPTCHA hostname, action, cdata and provider failures", async () => {
  const config = setup(),
    id = randomUUID();
  const provider = (value: object) => vi.fn(async () => Response.json(value));
  expect(
    await verifyCaptcha(
      "token",
      id,
      config,
      provider({
        success: true,
        hostname: "example.test",
        action: "aeetds_submit",
        cdata: id,
      }),
    ),
  ).toBe(true);
  for (const change of [
    { hostname: "attacker.test" },
    { action: "other" },
    { cdata: "wrong" },
    { success: false },
  ])
    expect(
      await verifyCaptcha(
        "token",
        id,
        config,
        provider({
          success: true,
          hostname: "example.test",
          action: "aeetds_submit",
          cdata: id,
          ...change,
        }),
      ),
    ).toBe(false);
});

it("leases each queued email at claim time even when a batch runs longer than the lease", async () => {
  const config = setup();
  await handleSubmission(request(), "ENQUIRY", {
    config,
    captcha: async () => true,
  });
  const db = database(config.storage);
  let time = 1000;
  const clock = vi.spyOn(Date, "now").mockImplementation(() => time);
  const leases: number[] = [];
  try {
    const sendMail = vi.fn(async (options: { to: string }) => {
      leases.push(
        Number(
          db
            .prepare("SELECT lease_at FROM outbox WHERE status='processing'")
            .get()!.lease_at,
        ),
      );
      time += 130000;
      return { accepted: [options.to] };
    });
    expect(await deliverOutbox(db, config, { sendMail })).toEqual({
      sent: 2,
      failed: 0,
    });
    expect(leases).toEqual([1000, 131000]);
  } finally {
    clock.mockRestore();
  }
});

it("validates, scans and persists both existing upload form types with correct references", async () => {
  const { readFileSync } = await import("node:fs");
  const { emptyMembershipValues } = await import("../../src/domain/membership");
  const { emptyRegistrationValues, registrationCategories } =
    await import("../../src/domain/registration");
  const config = { ...setup(), scanner: "/test/scanner" };
  const membership = {
    ...emptyMembershipValues,
    category: "Life",
    designation: "Scientist",
    institution: "Example Institute",
    discipline: "Agriculture",
    qualification: "PhD",
    title: "Dr.",
    fullName: "Test Applicant",
    address: "Example institutional address",
    postalCode: "123456",
    email: "person@example.test",
    mobile: "+918000000000",
    dateOfBirth: "1990-01-01",
    nationality: "India",
    utr: "TEST-UTR",
    paymentDate: "2026-01-01",
    declaration: true,
  };
  const registration = {
    ...emptyRegistrationValues,
    fullName: "Test Applicant",
    designation: "Scientist",
    institution: "Example Institute",
    email: "person@example.test",
    mobile: "+918000000000",
    country: "India",
    state: "Delhi",
    category: registrationCategories[0],
    mode: "Offline",
    presentation: "Attending only",
    amountPaid: "5000",
    utr: "TEST-UTR",
    paymentDate: "2026-01-01",
    policy: true,
  };
  for (const [type, values] of [
    ["MEMBERSHIP", membership],
    ["CONF-REG", registration],
  ] as const) {
    const form = new FormData();
    form.set("values", JSON.stringify(values));
    form.set("requestId", randomUUID());
    form.set("captchaToken", "test");
    form.set("website", "");
    form.set(
      "receipt",
      new File(["%PDF-1.4\nfixture\n%%EOF"], "receipt.pdf", {
        type: "application/pdf",
      }),
    );
    if (type === "MEMBERSHIP")
      form.set(
        "photo",
        new File([readFileSync("public/aeetds/logo.png")], "photo.png", {
          type: "image/png",
        }),
      );
    const response = await handleSubmission(
      new Request(`https://example.test/api/submissions/${type}`, {
        method: "POST",
        headers: { Origin: "https://example.test" },
        body: form,
      }),
      type,
      { config, captcha: async () => true, scanner: async () => {} },
    );
    expect(response.status).toBe(201);
    expect((await response.json()).receipt.reference).toMatch(
      new RegExp(`^AEETDS/${type}/\\d{4}/1$`),
    );
  }
  expect(
    database(config.storage).prepare("SELECT COUNT(*) n FROM files").get()!.n,
  ).toBe(3);
});
