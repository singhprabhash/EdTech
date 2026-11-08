import { expect, it } from "vitest";
import {
  emptyContactValues,
  validateContact,
  contactCategories,
} from "../../src/domain/contact";
const valid = {
  fullName: "Test Person",
  email: "person@example.test",
  phone: "",
  subject: "Other",
  message: "A question for the Society.",
};
it("requires the official fields and rejects whitespace-only input", () => {
  expect(validateContact(emptyContactValues)).toMatchObject({
    fullName: expect.any(String),
    email: expect.any(String),
    subject: expect.any(String),
    message: expect.any(String),
  });
  expect(validateContact(valid)).toEqual({});
  expect(
    validateContact({ ...valid, fullName: "  ", message: "\n " }),
  ).toMatchObject({
    fullName: expect.any(String),
    message: expect.any(String),
  });
});
it("allows the six official categories and optional international phone", () => {
  expect(contactCategories).toEqual([
    "Membership",
    "Conference",
    "Awards",
    "Publications",
    "Payment",
    "Other",
  ]);
  for (const subject of contactCategories)
    expect(
      validateContact({ ...valid, subject, phone: "+44 (20) 7946 0958" }),
    ).toEqual({});
  expect(
    validateContact({
      ...valid,
      subject: "invented",
      phone: "123",
      email: "invalid",
    }),
  ).toMatchObject({
    subject: expect.any(String),
    phone: expect.any(String),
    email: expect.any(String),
  });
});
it("bounds message and identity fields without silently truncating", () => {
  expect(validateContact({ ...valid, message: "x".repeat(2000) })).toEqual({});
  expect(
    validateContact({ ...valid, message: "x".repeat(2001) }).message,
  ).toBeTruthy();
  expect(
    validateContact({ ...valid, fullName: "x".repeat(201) }).fullName,
  ).toBeTruthy();
  expect(
    validateContact({ ...valid, email: "x".repeat(255) + "@example.test" })
      .email,
  ).toBeTruthy();
  expect(
    validateContact({ ...valid, phone: "+" + "1".repeat(16) }).phone,
  ).toBeTruthy();
});
