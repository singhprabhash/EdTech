import { expect, it } from "vitest";
import { emptyContactValues } from "../../src/domain/contact";
import { isContactReceipt, submitContact } from "../../src/services/contact";
it("default service is unavailable without fabricated acceptance or network requests", async () => {
  expect(await submitContact(emptyContactValues)).toMatchObject({
    status: "unavailable",
  });
});
it("acceptance requires the agreed reference structure", () => {
  for (const value of [null, {}, "success", { reference: "fake" }])
    expect(isContactReceipt(value)).toBe(false);
  expect(isContactReceipt({ reference: "AEETDS/ENQUIRY/2026/42" })).toBe(true);
});
