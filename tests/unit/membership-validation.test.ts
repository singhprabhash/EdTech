import { describe, expect, it } from "vitest";
import {
  emptyMembershipValues,
  emptyMembershipDocuments,
  validateMembershipStep,
  validateDocument,
} from "../../src/domain/membership";

const jpg = (size = 20) =>
  new File([new Uint8Array(size)], "photo.jpg", { type: "image/jpeg" });
const valid = {
  ...emptyMembershipValues,
  category: "Student",
  designation: "Research scholar",
  institution: "Example institution",
  discipline: "Other",
  otherDiscipline: "Soil research",
  qualification: "Master's degree",
  title: "Ms.",
  fullName: "Test Applicant",
  address: "Example street",
  postalCode: "226001",
  email: "applicant@example.test",
  mobile: "+918000000000",
  dateOfBirth: "2000-01-01",
  nationality: "India",
  utr: "UTR-example",
  paymentDate: "2026-01-01",
  declaration: true,
};
const files = { photo: jpg(), studentProof: jpg(), receipt: jpg() };
describe("membership step validation", () => {
  it("validates every required field and never allows public Honorary applications", () => {
    expect(
      Object.keys(
        validateMembershipStep(
          0,
          emptyMembershipValues,
          emptyMembershipDocuments,
        ),
      ),
    ).toEqual(
      expect.arrayContaining([
        "category",
        "designation",
        "institution",
        "discipline",
        "qualification",
      ]),
    );
    expect(
      validateMembershipStep(0, { ...valid, category: "Honorary" }, files)
        .category,
    ).toBeTruthy();
  });
  it("requires Other details and preserves international postal/phone input", () => {
    expect(
      validateMembershipStep(0, { ...valid, otherDiscipline: "" }, files)
        .otherDiscipline,
    ).toBeTruthy();
    expect(
      validateMembershipStep(
        1,
        { ...valid, nationality: "Other", otherNationality: "" },
        files,
      ).otherNationality,
    ).toBeTruthy();
    expect(
      validateMembershipStep(
        1,
        { ...valid, postalCode: "SW1A 1AA", mobile: "+44 20 7946 0958" },
        files,
        "2026-11-07",
      ),
    ).toEqual({});
  });
  it("validates email, phone, dates and declaration without inventing age rules", () => {
    const errors = validateMembershipStep(
      1,
      { ...valid, email: "invalid", mobile: "123", dateOfBirth: "2027-01-01" },
      files,
      "2026-11-07",
    );
    expect(errors).toMatchObject({
      email: expect.any(String),
      mobile: expect.any(String),
      dateOfBirth: expect.any(String),
    });
    expect(
      validateMembershipStep(
        3,
        { ...valid, paymentDate: "2027-01-01", utr: "" },
        files,
        "2026-11-07",
      ),
    ).toMatchObject({
      utr: expect.any(String),
      paymentDate: expect.any(String),
    });
    expect(
      validateMembershipStep(4, { ...valid, declaration: false }, files)
        .declaration,
    ).toBeTruthy();
  });
  it("requires Student proof only for Students, photograph always, receipt always", () => {
    expect(
      validateMembershipStep(2, valid, emptyMembershipDocuments),
    ).toMatchObject({
      photo: expect.any(String),
      studentProof: expect.any(String),
    });
    expect(
      validateMembershipStep(
        2,
        { ...valid, category: "Life" },
        { ...emptyMembershipDocuments, photo: jpg() },
      ),
    ).toEqual({});
    expect(
      validateMembershipStep(3, valid, emptyMembershipDocuments).receipt,
    ).toBeTruthy();
  });
  it("accepts complete valid data for every step", () => {
    for (let step = 0; step < 5; step++)
      expect(validateMembershipStep(step, valid, files, "2026-11-07")).toEqual(
        {},
      );
  });
});
describe("membership documents", () => {
  it("accepts only JPG/PNG for photograph and PDF/JPG for proof and receipt", () => {
    expect(validateDocument("photo", jpg())).toBeUndefined();
    expect(
      validateDocument(
        "photo",
        new File(["png"], "photo.png", { type: "image/png" }),
      ),
    ).toBeUndefined();
    expect(
      validateDocument(
        "receipt",
        new File(["%PDF"], "receipt.pdf", { type: "application/pdf" }),
      ),
    ).toBeUndefined();
    expect(
      validateDocument(
        "studentProof",
        new File(["png"], "proof.png", { type: "image/png" }),
      ),
    ).toBeTruthy();
    expect(
      validateDocument(
        "photo",
        new File(["%PDF"], "file.pdf", { type: "application/pdf" }),
      ),
    ).toBeTruthy();
    expect(
      validateDocument(
        "photo",
        new File(["text"], "spoof.jpg", { type: "text/plain" }),
      ),
    ).toBeTruthy();
    expect(
      validateDocument(
        "receipt",
        new File(["x"], "receipt.exe", { type: "application/pdf" }),
      ),
    ).toBeTruthy();
  });
  it("enforces 1MB photograph and 2MB proof/receipt limits and rejects empty files", () => {
    expect(validateDocument("photo", jpg(1024 * 1024))).toBeUndefined();
    expect(validateDocument("photo", jpg(1024 * 1024 + 1))).toBeTruthy();
    expect(validateDocument("receipt", jpg(2 * 1024 * 1024))).toBeUndefined();
    expect(validateDocument("receipt", jpg(2 * 1024 * 1024 + 1))).toBeTruthy();
    expect(validateDocument("studentProof", jpg(0))).toBeTruthy();
  });
});
