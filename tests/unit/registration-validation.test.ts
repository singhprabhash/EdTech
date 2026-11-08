import { expect, it } from "vitest";
import {
  emptyRegistrationValues,
  registrationCategories,
  validateRegistration,
  validateRegistrationReceipt,
} from "../../src/domain/registration";
const receipt = () =>
  new File(["%PDF-1.4"], "receipt.pdf", { type: "application/pdf" });
const valid = {
  ...emptyRegistrationValues,
  fullName: "Test Applicant",
  designation: "Research scholar",
  institution: "Example institution",
  email: "person@example.test",
  mobile: "+918000000000",
  category: registrationCategories[0],
  mode: "Offline",
  country: "India",
  state: "Uttar Pradesh",
  presentation: "Attending only",
  amountPaid: "5000.00",
  utr: "UTR-example",
  paymentDate: "2026-01-01",
  policy: true,
};
it("requires all official participant, payment and policy fields", () => {
  expect(
    validateRegistration(emptyRegistrationValues, null, "2026-11-08"),
  ).toMatchObject({
    fullName: expect.any(String),
    designation: expect.any(String),
    institution: expect.any(String),
    email: expect.any(String),
    mobile: expect.any(String),
    category: expect.any(String),
    mode: expect.any(String),
    country: expect.any(String),
    state: expect.any(String),
    presentation: expect.any(String),
    amountPaid: expect.any(String),
    utr: expect.any(String),
    paymentDate: expect.any(String),
    receipt: expect.any(String),
    policy: expect.any(String),
  });
  expect(validateRegistration(valid, receipt(), "2026-11-08")).toEqual({});
});
it("rejects online-only exclusions without inventing fee amounts", () => {
  for (const category of ["Corporate / Industry", "Accompanying Person"])
    expect(
      validateRegistration(
        { ...valid, category, mode: "Online" },
        receipt(),
        "2026-11-08",
      ).mode,
    ).toBeTruthy();
  expect(
    validateRegistration(
      {
        ...valid,
        category: "International Participant",
        country: "Other country",
        otherCountry: "United Kingdom",
        state: "London",
        mobile: "+44 20 7946 0958",
        amountPaid: "60",
      },
      receipt(),
      "2026-11-08",
    ),
  ).toEqual({});
});
it("validates email/phone/payment date and positive receipt amount", () => {
  const errors = validateRegistration(
    {
      ...valid,
      email: "invalid",
      mobile: "123",
      paymentDate: "2027-01-01",
      amountPaid: "-5",
    },
    receipt(),
    "2026-11-08",
  );
  expect(errors).toMatchObject({
    email: expect.any(String),
    mobile: expect.any(String),
    paymentDate: expect.any(String),
    amountPaid: expect.any(String),
  });
  expect(
    validateRegistration(
      { ...valid, paymentDate: "2026-02-30" },
      receipt(),
      "2026-11-08",
    ).paymentDate,
  ).toBeTruthy();
});
it("keeps membership and accommodation optional, validating dates when provided", () => {
  expect(
    validateRegistration(
      { ...valid, member: "Yes", accommodation: "Yes" },
      receipt(),
      "2026-11-08",
    ),
  ).toEqual({});
  expect(
    validateRegistration(
      {
        ...valid,
        accommodation: "Yes",
        arrivalDate: "2026-12-20",
        departureDate: "2026-12-19",
      },
      receipt(),
      "2026-11-08",
    ).departureDate,
  ).toBeTruthy();
  expect(
    validateRegistration(
      { ...valid, accommodation: "Yes", arrivalDate: "2026-12-20" },
      receipt(),
      "2026-11-08",
    ).departureDate,
  ).toBeTruthy();
  expect(
    validateRegistration(
      { ...valid, country: "Other country", otherCountry: "" },
      receipt(),
      "2026-11-08",
    ).otherCountry,
  ).toBeTruthy();
});

it("accepts PDF/JPG/PNG up to 2 MiB, rejecting empty, mismatched and oversized files", () => {
  for (const [name, type] of [
    ["receipt.pdf", "application/pdf"],
    ["receipt.jpg", "image/jpeg"],
    ["receipt.png", "image/png"],
  ])
    expect(
      validateRegistrationReceipt(new File(["valid"], name, { type })),
    ).toBeUndefined();
  expect(
    validateRegistrationReceipt(
      new File(["text"], "spoof.pdf", { type: "text/plain" }),
    ),
  ).toBeTruthy();
  expect(
    validateRegistrationReceipt(
      new File(["x"], "receipt.exe", { type: "application/pdf" }),
    ),
  ).toBeTruthy();
  expect(
    validateRegistrationReceipt(
      new File([], "empty.jpg", { type: "image/jpeg" }),
    ),
  ).toBeTruthy();
  expect(
    validateRegistrationReceipt(
      new File([new Uint8Array(2 * 1024 * 1024)], "receipt.png", {
        type: "image/png",
      }),
    ),
  ).toBeUndefined();
  expect(
    validateRegistrationReceipt(
      new File([new Uint8Array(2 * 1024 * 1024 + 1)], "receipt.png", {
        type: "image/png",
      }),
    ),
  ).toBeTruthy();
});
