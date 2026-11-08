import { readFileSync } from "node:fs";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import ContactForm from "../../src/components/aeetds/support/contact-form";
import FaqExperience from "../../src/components/aeetds/support/faq-experience";
import SecretariatInformation from "../../src/components/aeetds/support/contact-information";
import {
  contactInformation,
  faqs,
  faqCategories,
  filterFaqs,
  faqStructuredData,
  policies,
} from "../../src/content/aeetds-support";
import { submitContact } from "../../src/services/contact";
vi.mock("../../src/services/contact", async (original) => ({
  ...(await original<typeof import("../../src/services/contact")>()),
  submitContact: vi.fn(),
}));
beforeEach(() => {
  vi.mocked(submitContact).mockReset();
});
function prepare() {
  for (const [label, value] of [
    ["Full Name *", "Test Applicant"],
    ["Email Address *", "person@example.test"],
    ["Subject / Enquiry Category *", "Other"],
    ["Message *", "A question for the Society."],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
}
it("preserves all official questions/answers and policy wording exactly", () => {
  const source = readFileSync(
    "tests/fixtures/aeetds-support-source.txt",
    "utf8",
  ).replace(/\s+/g, " ");
  expect(faqs).toHaveLength(11);
  expect(policies).toHaveLength(5);
  for (const faq of faqs) {
    expect(source).toContain(faq.question);
    expect(source).toContain(faq.answer);
  }
  for (const policy of policies) {
    expect(source).toContain(policy.title);
    expect(source).toContain(policy.paragraphs.join(" "));
  }
  const schema = faqStructuredData();
  expect(schema.mainEntity).toHaveLength(11);
  schema.mainEntity.forEach((item, index) =>
    expect(item.acceptedAnswer.text).toBe(faqs[index].answer),
  );
});
it("filters by question and answer with category and trimmed case-insensitive search", () => {
  expect(filterFaqs("all", "  CONCESSIONAL  ").map((item) => item.id)).toEqual([
    "conference-membership",
  ]);
  expect(filterFaqs("awards", "concessional")).toHaveLength(0);
  expect(
    filterFaqs("abstracts", "registration fee").map((item) => item.id),
  ).toEqual(["abstract-registration"]);
  expect(filterFaqs("all", "missing search text")).toHaveLength(0);
  expect(
    faqCategories
      .slice(1)
      .reduce(
        (count, category) => count + filterFaqs(category.id, "").length,
        0,
      ),
  ).toBe(faqs.length);
});
it("provides all four official phone links without invented responsibilities", () => {
  render(<SecretariatInformation />);
  for (const phone of contactInformation.phones)
    expect(
      screen.getByRole("link", {
        name: new RegExp(phone.replace(/[+]/g, "\\+")),
      }),
    ).toHaveAttribute("href", `tel:${phone.replaceAll("-", "")}`);
  expect(screen.getByText(/Monday to Saturday/)).toHaveTextContent(
    contactInformation.hours,
  );
  expect(screen.getByText(/Full office address to be provided/)).toBeVisible();
});
it("opens and closes numbered FAQ answers, combines filters and clears empty results", () => {
  render(<FaqExperience />);
  const question = screen.getByRole("button", {
    name: new RegExp(faqs[0].question.replace("?", "\\?")),
  });
  expect(question).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(question);
  expect(question).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByText(faqs[0].answer)).toBeVisible();
  fireEvent.click(question);
  expect(screen.getByText(faqs[0].answer)).not.toBeVisible();
  fireEvent.click(
    within(screen.getByRole("group", { name: "FAQ categories" })).getByRole(
      "button",
      { name: /Abstract Submissions/ },
    ),
  );
  expect(screen.getByRole("status")).toHaveTextContent("2 of 11");
  fireEvent.change(screen.getByLabelText("Search questions and answers"), {
    target: { value: "concessional" },
  });
  expect(screen.getByText("No matching questions found.")).toBeVisible();
  fireEvent.click(
    screen.getByRole("button", { name: "Clear search and filters" }),
  );
  expect(screen.getByRole("status")).toHaveTextContent("11 of 11");
});
it("focuses validation summary only on submit and keeps focus while correcting fields", () => {
  render(<ContactForm />);
  fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
  expect(
    screen.getByRole("alert", { name: "Contact form errors" }),
  ).toHaveFocus();
  const input = screen.getByLabelText("Full Name *");
  input.focus();
  fireEvent.change(input, { target: { value: "Test" } });
  expect(input).toHaveFocus();
  expect(submitContact).not.toHaveBeenCalled();
});
it.each(["unavailable", "network", "rejected", "malformed", "accepted"])(
  "handles %s enquiry response honestly and retains failed input",
  async (mode) => {
    const mock = vi.mocked(submitContact);
    if (mode === "network") mock.mockRejectedValueOnce(new Error("offline"));
    else if (mode === "rejected")
      mock.mockResolvedValue({
        status: "rejected",
        message: "Check the email address.",
        fieldErrors: { email: "Check the email address." },
      });
    else if (mode === "unavailable")
      mock.mockResolvedValue({
        status: "unavailable",
        message: "Your enquiry has not been sent.",
      });
    else
      mock.mockResolvedValue({
        status: "accepted",
        receipt: {
          reference: mode === "accepted" ? "AEETDS/ENQUIRY/2026/42" : "fake",
        },
      });
    render(<ContactForm />);
    prepare();
    fireEvent.click(screen.getByRole("button", { name: "Send Message" }));
    const feedback = await screen.findByRole("alert", {
      name: "Contact submission status",
    });
    await waitFor(() => expect(mock.mock.calls).toHaveLength(1));
    if (mode === "accepted") {
      expect(feedback).toHaveTextContent("AEETDS/ENQUIRY/2026/42");
      expect(feedback).toHaveTextContent(
        "Email acknowledgement delivery is a separate step",
      );
      expect(
        screen.getByRole("button", { name: "Enquiry received" }),
      ).toBeDisabled();
    } else {
      expect(screen.getByLabelText("Message *")).toHaveValue(
        "A question for the Society.",
      );
      expect(screen.getByLabelText("Email Address *")).toHaveValue(
        "person@example.test",
      );
      expect(
        within(feedback).queryByText(/Enquiry reference:/),
      ).not.toBeInTheDocument();
    }
  },
);
it("prevents duplicate enquiries while loading and trims outgoing values", async () => {
  let finish: (
    value: Awaited<ReturnType<typeof submitContact>>,
  ) => void = () => {};
  vi.mocked(submitContact).mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  render(<ContactForm />);
  prepare();
  fireEvent.change(screen.getByLabelText("Full Name *"), {
    target: { value: "  Test Applicant  " },
  });
  const form = screen.getByRole("form");
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(submitContact).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
  expect(vi.mocked(submitContact).mock.calls[0][0].fullName).toBe(
    "Test Applicant",
  );
  await act(async () =>
    finish({ status: "unavailable", message: "Not sent." }),
  );
  expect(screen.getByRole("button", { name: "Send Message" })).toBeEnabled();
});

it("keeps FAQ structured data limited to the current official results", () => {
  render(<FaqExperience />);
  const schema = () =>
    JSON.parse(
      document.querySelector('script[type="application/ld+json"]')
        ?.textContent ?? "null",
    );
  expect(schema().mainEntity).toHaveLength(11);
  fireEvent.change(screen.getByLabelText("Search questions and answers"), {
    target: { value: "concessional" },
  });
  expect(schema().mainEntity).toHaveLength(1);
  expect(schema().mainEntity[0].name).toBe(faqs[1].question);
  fireEvent.change(screen.getByLabelText("Search questions and answers"), {
    target: { value: "nonexistent-question" },
  });
  expect(schema()).toBeNull();
});
