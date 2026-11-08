import { expect, it } from "vitest";
import { emptyRegistrationValues } from "../../src/domain/registration";
import {
  isRegistrationReceipt,
  submitRegistration,
} from "../../src/services/registration";
it("returns unavailable without inventing a registration receipt", async () => {
  expect(
    await submitRegistration({
      values: emptyRegistrationValues,
      receipt: new File(["%PDF"], "receipt.pdf", { type: "application/pdf" }),
    }),
  ).toMatchObject({ status: "unavailable" });
});
it("requires a real structured service receipt before acknowledgement", () => {
  for (const receipt of [
    null,
    {},
    { reference: "fake" },
    { reference: "AEETDS/CONF-REG/2026/42", submittedAt: "bad" },
  ])
    expect(isRegistrationReceipt(receipt)).toBe(false);
  expect(
    isRegistrationReceipt({
      reference: "AEETDS/CONF-REG/2026/42",
      submittedAt: "2026-11-08T10:00:00Z",
    }),
  ).toBe(true);
});
