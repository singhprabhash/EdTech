import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import {
  AwardCatalogue,
  AwardeeDirectory,
} from "../../src/components/aeetds/resources/award-catalogue";
import { AuthorChecklist } from "../../src/components/aeetds/resources/guidelines-experience";
import RegistrationForm from "../../src/components/aeetds/registration/form";
import { awardGroups, filterAwardees } from "../../src/content/aeetds-awards";
import { registrationCategories } from "../../src/domain/registration";
import { submitRegistration } from "../../src/services/registration";
vi.mock("../../src/services/registration", async (original) => ({
  ...(await original<typeof import("../../src/services/registration")>()),
  submitRegistration: vi.fn(),
}));
beforeEach(() => {
  vi.mocked(submitRegistration).mockReset();
});
function prepare() {
  for (const [label, value] of [
    ["Full name", "Test Applicant"],
    ["Designation", "Scholar"],
    ["Institution / organisation", "Example Institution"],
    ["Mobile", "+918000000000"],
    ["Email", "person@example.test"],
    ["State / province", "Delhi"],
    ["Amount paid", "5000"],
    ["Payment transaction", "UTR-example"],
    ["Payment date", "2026-01-01"],
  ])
    fireEvent.change(screen.getByLabelText(new RegExp(label)), {
      target: { value },
    });
  for (const [label, value] of [
    ["Country / region", "India"],
    ["Participant category", registrationCategories[0]],
    ["Participation mode", "Offline"],
    ["Presenting", "Attending only"],
  ])
    fireEvent.change(screen.getByLabelText(new RegExp(label)), {
      target: { value },
    });
  fireEvent.change(screen.getByLabelText("Payment receipt *"), {
    target: {
      files: [
        new File(["%PDF-1.4"], "receipt.pdf", { type: "application/pdf" }),
      ],
    },
  });
  fireEvent.click(screen.getByRole("checkbox"));
}
it("retains all eight full award lists and filters groups", () => {
  render(<AwardCatalogue />);
  for (const group of awardGroups)
    for (const award of group.awards)
      expect(screen.getByText(award)).toBeVisible();
  fireEvent.change(screen.getByLabelText("Award group"), {
    target: { value: "lifetime" },
  });
  expect(screen.getByRole("status")).toHaveTextContent("1 of 8");
  expect(
    screen.queryByRole("heading", { name: awardGroups[1].name }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Award group"), {
    target: { value: "" },
  });
  expect(screen.getByRole("status")).toHaveTextContent("8 of 8");
});
it("keeps awardee records empty, with operable filters and reset", () => {
  render(<AwardeeDirectory />);
  fireEvent.change(screen.getByLabelText("Year"), {
    target: { value: "2025" },
  });
  fireEvent.change(screen.getByLabelText("Search awardees"), {
    target: { value: "unconfirmed" },
  });
  expect(screen.getByRole("status")).toHaveTextContent(
    "0 confirmed records · Year: 2025 · Search: unconfirmed",
  );
  expect(
    screen.getByRole("heading", { name: "Confirmed Awardee Records Awaited" }),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
  expect(screen.getByLabelText("Year")).toHaveValue("");
  expect(screen.getByLabelText("Search awardees")).toHaveValue("");
  const records = [
    {
      year: "2025",
      groupId: "research",
      award: "Best Researcher",
      name: "Example Person",
      institution: "Example Institute",
    },
  ];
  expect(filterAwardees(records, "2025", "research", "PERSON")).toHaveLength(1);
  expect(filterAwardees(records, "2024", "research", "")).toHaveLength(0);
});
it("counts and resets author preparation without claiming validation", () => {
  render(<AuthorChecklist />);
  for (const checkbox of screen.getAllByRole("checkbox"))
    fireEvent.click(checkbox);
  expect(screen.getByRole("progressbar")).toHaveAttribute("value", "6");
  expect(
    screen.getByText(/no manuscript has been submitted or validated/),
  ).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Reset checklist" }));
  expect(screen.getByRole("status")).toHaveTextContent("0 of 6 complete");
});
it("focuses validation summary once and retains focus while correcting fields", () => {
  render(<RegistrationForm />);
  fireEvent.click(screen.getByRole("button", { name: "Submit Registration" }));
  expect(
    screen.getByRole("alert", { name: "Registration form errors" }),
  ).toHaveFocus();
  const input = screen.getByLabelText(/Full name/);
  input.focus();
  fireEvent.change(input, { target: { value: "Test" } });
  expect(input).toHaveFocus();
  expect(submitRegistration).not.toHaveBeenCalled();
});
it("rejects unsafe receipt selection and supports removal", () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText("Payment receipt *");
  fireEvent.change(input, {
    target: {
      files: [new File(["bad"], "receipt.pdf", { type: "text/plain" })],
    },
  });
  expect(input).toHaveAttribute("aria-invalid", "true");
  prepare();
  expect(screen.getByText("receipt.pdf")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Remove receipt" }));
  expect(screen.queryByText("receipt.pdf")).not.toBeInTheDocument();
});
it.each(["unavailable", "network", "rejected", "malformed", "accepted"])(
  "handles %s service response without fabricating payment confirmation",
  async (mode) => {
    const mock = vi.mocked(submitRegistration);
    if (mode === "network")
      mock.mockImplementation(async () => {
        throw new Error("offline");
      });
    else if (mode === "rejected")
      mock.mockResolvedValue({
        status: "rejected",
        message: "Check the receipt",
        fieldErrors: { utr: "Check transaction number" },
      });
    else if (mode === "unavailable")
      mock.mockResolvedValue({
        status: "unavailable",
        message: "Your registration has not been sent.",
      });
    else
      mock.mockResolvedValue({
        status: "accepted",
        receipt: {
          reference: mode === "accepted" ? "AEETDS/CONF-REG/2026/42" : "fake",
        },
      });
    render(<RegistrationForm />);
    prepare();
    fireEvent.click(
      screen.getByRole("button", { name: "Submit Registration" }),
    );
    await waitFor(() => expect(mock.mock.calls).toHaveLength(1));
    const feedback = await screen.findByRole("alert", {
      name: "Registration submission status",
    });
    if (mode === "accepted") {
      expect(feedback).toHaveTextContent("AEETDS/CONF-REG/2026/42");
      expect(feedback).toHaveTextContent("does not confirm payment");
      expect(
        screen.getByRole("button", { name: "Application received" }),
      ).toBeDisabled();
    } else {
      expect(screen.getByLabelText(/Full name/)).toHaveValue("Test Applicant");
      expect(screen.getByText("receipt.pdf")).toBeVisible();
      expect(
        screen.queryByText(/Application reference:/),
      ).not.toBeInTheDocument();
    }
  },
);

it("clears error links when conditional inputs are hidden", () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText("Country / region *"), {
    target: { value: "Other country" },
  });
  fireEvent.change(
    screen.getByLabelText("Accommodation required? (optional)"),
    { target: { value: "Yes" } },
  );
  fireEvent.change(screen.getByLabelText("Arrival date (optional)"), {
    target: { value: "2026-12-20" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit Registration" }));
  expect(
    document.querySelector('a[href="#registration-otherCountry"]'),
  ).not.toBeNull();
  expect(
    document.querySelector('a[href="#registration-departureDate"]'),
  ).not.toBeNull();
  fireEvent.change(screen.getByLabelText("Country / region *"), {
    target: { value: "India" },
  });
  fireEvent.change(
    screen.getByLabelText("Accommodation required? (optional)"),
    { target: { value: "No" } },
  );
  expect(
    document.querySelector('a[href="#registration-otherCountry"]'),
  ).toBeNull();
  expect(
    document.querySelector('a[href="#registration-departureDate"]'),
  ).toBeNull();
});
