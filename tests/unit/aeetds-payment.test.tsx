import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { PaymentDetailsPanel } from "../../src/components/aeetds/resources/registration-page";
import {
  registrationFeeRows,
  paymentPolicies,
  awardContributionFees,
  conferenceDeadlines,
} from "../../src/content/aeetds-payment";

it("renders the Society bank coordinates and the supplied payment QR without pending placeholders", () => {
  render(<PaymentDetailsPanel />);
  for (const value of [
    "77300100025568",
    "BARB0VJMOHI",
    "Bank of Baroda",
    "Mohibullapur, Lucknow",
    "Google Pay / PhonePe at 7408206291",
  ])
    expect(screen.getByText(value)).toBeVisible();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    "/aeetds/documents/crafns-2026-payment-qr.png",
  );
  expect(document.body).not.toHaveTextContent(
    /withheld|pending verification|unavailable/i,
  );
});
it("keeps early and spot fees distinct and does not confuse online participation with spot registration", () => {
  expect(registrationFeeRows).toHaveLength(7);
  expect(registrationFeeRows[0]).toMatchObject({
    early: "US$ 60",
    spot: "US$ 75",
  });
  expect(registrationFeeRows[2]).toMatchObject({
    early: "₹2,500",
    spot: "₹3,000",
  });
  expect(registrationFeeRows[6]).toEqual({
    category: "Online Participation (all categories)",
    early: "₹1,500",
    spot: "₹2,000",
  });
  expect(awardContributionFees[1]).toEqual({
    category: "All other Indian participants",
    contribution: "₹6,000",
  });
  expect(conferenceDeadlines).toContainEqual({
    label: "Last date for abstract submission",
    date: "20 November 2026",
  });
  expect(paymentPolicies).toContain(
    "A registration may be transferred to another delegate of the same category only with prior written intimation to the organisers.",
  );
});
