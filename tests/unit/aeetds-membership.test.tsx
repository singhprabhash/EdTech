import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import MembershipOverview from "../../src/components/aeetds/membership/overview";
import MembershipApplicationForm from "../../src/components/aeetds/membership/application-form";
import { MembershipReceiptProvider } from "../../src/components/aeetds/membership/receipt-context";
import { MembershipAcknowledgement } from "../../src/components/aeetds/membership/acknowledgement";
import {
  membershipBenefits,
  membershipIntroduction,
  membershipDeclaration,
} from "../../src/content/aeetds-membership";
import {
  isMembershipReceipt,
  submitMembership,
} from "../../src/services/membership";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("../../src/services/membership", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../src/services/membership")>()),
  submitMembership: vi.fn(),
}));
const submitted = {
  reference: "AEETDS/MEMBERSHIP/2026/9234",
  category: "Student" as const,
  submittedAt: "2026-11-07T06:00:00.000Z",
  acknowledgementEmail: "pending" as const,
};
beforeEach(() => {
  push.mockReset();
  vi.mocked(submitMembership).mockResolvedValue({
    status: "unavailable",
    message:
      "Your application has not been sent. Online submission is awaiting integration.",
  });
  vi.stubGlobal(
    "URL",
    Object.assign(URL, {
      createObjectURL: vi.fn(() => "blob:local-photo"),
      revokeObjectURL: vi.fn(),
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());
function form() {
  return render(
    <MembershipReceiptProvider>
      <MembershipApplicationForm />
    </MembershipReceiptProvider>,
  );
}
function fill(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
function file(label: RegExp, name: string, type: string) {
  fireEvent.change(screen.getByLabelText(label), {
    target: { files: [new File(["test"], name, { type })] },
  });
}
function next() {
  fireEvent.click(screen.getByRole("button", { name: "Next" }));
}
function details(category = "Student") {
  fill(/^Membership category/, category);
  fill(/^Designation/, "Research scholar");
  fill(/^Institution \/ organisation/, "Example institution");
  fill(/^Highest qualification/, "Master's degree");
  fill(/^Discipline \/ specialisation/, "Other");
  fill(/^Other discipline/, "Soil research");
}
function personal() {
  fill(/^Title/, "Ms.");
  fill(/^Full name/, "Test Applicant");
  fill(/^Email/, "applicant@example.test");
  fill(/^Mobile/, "+918000000000");
  fill(/^Date of birth/, "2000-01-01");
  fill(/^Nationality/, "India");
  fill(/^Postal address/, "Example street");
  fill(/^PIN \/ postal code/, "226001");
}
function review() {
  details();
  next();
  personal();
  next();
  file(/^Passport-size photograph/, "photo.jpg", "image/jpeg");
  file(/^Student ID/, "proof.pdf", "application/pdf");
  next();
  fill(/^Payment transaction/, "UTR-example");
  fill(/^Payment date/, "2026-01-01");
  file(/^Payment receipt/, "receipt.pdf", "application/pdf");
  next();
  fireEvent.click(
    screen.getByLabelText(membershipDeclaration, { exact: false }),
  );
}
it("renders six categories, seven exact benefits, true fees and no Honorary application", () => {
  render(<MembershipOverview />);
  const list = screen.getByRole("list", { name: "Membership categories" });
  const entries = within(list).getAllByRole("listitem");
  expect(entries).toHaveLength(6);
  expect(within(entries[5]).queryByRole("link")).toBeNull();
  expect(entries[5]).toHaveTextContent("Invitation only");
  expect(entries[3]).toHaveTextContent("Not specified");
  for (const benefit of membershipBenefits)
    expect(screen.getByText(benefit.text)).toBeInTheDocument();
  expect(screen.getByText(membershipIntroduction)).toBeInTheDocument();
  expect(document.body).not.toHaveTextContent(
    /ISBN Indexed|editorial peerage|2026–2027|guaranteed publication/,
  );
  expect(document.querySelector("a[download]")).toBeNull();
});
it("validates missing fields, excludes Honorary and shows Other inputs", () => {
  form();
  expect(screen.queryByRole("option", { name: "Honorary" })).toBeNull();
  next();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Select a membership category.",
  );
  expect(screen.getByRole("alert")).toHaveFocus();
  const designation = screen.getByLabelText(/^Designation/);
  designation.focus();
  fireEvent.change(designation, { target: { value: "R" } });
  expect(designation).toHaveFocus();
  fill(/^Discipline \/ specialisation/, "Other");
  expect(screen.getByLabelText(/^Other discipline/)).toBeVisible();
});
it("retains values/files across steps, rejects PNG student proof and allows remove/replace", () => {
  form();
  details();
  next();
  personal();
  next();
  file(/^Passport-size photograph/, "photo.jpg", "image/jpeg");
  file(/^Student ID/, "proof.png", "image/png");
  expect(screen.getByRole("alert")).toHaveTextContent("Choose a PDF/JPG file.");
  file(/^Student ID/, "proof.pdf", "application/pdf");
  expect(screen.getByText("proof.pdf")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Previous" }));
  expect(screen.getByLabelText(/^Full name/)).toHaveValue("Test Applicant");
  next();
  expect(screen.getByText("photo.jpg")).toBeVisible();
  expect(
    screen.getByAltText("Selected passport photograph preview"),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: /Remove passport/ }));
  expect(screen.queryByText("photo.jpg")).toBeNull();
  expect(URL.revokeObjectURL).toHaveBeenCalled();
});
it("hides Student proof for other categories", () => {
  form();
  details("Life");
  next();
  personal();
  next();
  expect(screen.queryByLabelText(/^Student ID/)).toBeNull();
});
it("retains a reviewed application when submission is unavailable", async () => {
  form();
  review();
  expect(screen.getByText("Test Applicant", { exact: false })).toBeVisible();
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Submit Application" })),
  );
  expect(submitMembership).toHaveBeenCalledOnce();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Your application has not been sent",
  );
  expect(push).not.toHaveBeenCalled();
  fireEvent.click(
    screen.getByRole("button", { name: "Edit personal information" }),
  );
  expect(screen.getByLabelText(/^Full name/)).toHaveValue("Test Applicant");
});
it("shows loading, retains failed entries and navigates only on validated acceptance", async () => {
  let resolve!: (value: Awaited<ReturnType<typeof submitMembership>>) => void;
  vi.mocked(submitMembership).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  form();
  review();
  fireEvent.click(screen.getByRole("button", { name: "Submit Application" }));
  expect(screen.getByRole("button", { name: "Submitting…" })).toBeDisabled();
  expect(push).not.toHaveBeenCalled();
  await act(async () =>
    resolve({
      status: "rejected",
      message: "Please check your payment reference.",
      fieldErrors: { utr: "Payment reference requires correction." },
    }),
  );
  expect(screen.getByLabelText(/^Payment transaction/)).toHaveValue(
    "UTR-example",
  );
  expect(
    screen.getByText("Please check your payment reference."),
  ).toBeVisible();
  fill(/^Payment transaction/, "UTR-corrected");
  next();
  vi.mocked(submitMembership).mockRejectedValueOnce(
    new Error("network unavailable"),
  );
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Submit Application" })),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Submission could not be confirmed",
  );
  expect(push).not.toHaveBeenCalled();
  expect(screen.getByText("UTR-corrected")).toBeVisible();
  vi.mocked(submitMembership).mockResolvedValueOnce({
    status: "accepted",
    receipt: { ...submitted, reference: "invalid-response" },
  });
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Submit Application" })),
  );
  expect(screen.getByRole("alert")).toHaveTextContent(
    "response could not be verified",
  );
  expect(push).not.toHaveBeenCalled();
  vi.mocked(submitMembership).mockResolvedValueOnce({
    status: "accepted",
    receipt: submitted,
  });
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Submit Application" })),
  );
  expect(push).toHaveBeenCalledWith("/membership/acknowledgement");
});
it("keeps acknowledgement honest without a receipt and rejects malformed result references", () => {
  render(<MembershipAcknowledgement receipt={null} />);
  expect(
    screen.queryByRole("heading", {
      name: "Application Submitted Successfully",
    }),
  ).toBeNull();
  expect(screen.getByText(/No reference has been generated/)).toBeVisible();
  expect(screen.queryByRole("button", { name: "Copy reference" })).toBeNull();
  expect(
    isMembershipReceipt({
      ...submitted,
      reference: "AEETDS/MEMBERSHIP/2026/8419<script>",
    }),
  ).toBe(false);
  expect(isMembershipReceipt({ ...submitted, category: "Honorary" })).toBe(
    false,
  );
});
it("uses only actual response details and copies reference only after clipboard success", async () => {
  const writeText = vi
    .fn()
    .mockRejectedValueOnce(new Error("unavailable"))
    .mockResolvedValueOnce(undefined);
  vi.stubGlobal("navigator", { clipboard: { writeText } });
  render(<MembershipAcknowledgement receipt={submitted} />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Application Submitted Successfully",
  );
  expect(screen.getByText(submitted.reference)).toBeVisible();
  expect(
    screen.getByText(/email delivery is pending confirmation/),
  ).toBeVisible();
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy reference" })),
  );
  expect(screen.getByRole("status")).toHaveTextContent("Could not copy");
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: "Copy reference" })),
  );
  expect(screen.getByRole("status")).toHaveTextContent("Reference copied.");
  expect(writeText).toHaveBeenCalledWith(submitted.reference);
});
