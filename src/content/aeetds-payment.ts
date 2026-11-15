// Source: user-supplied CRAFNS-2026_Registration_and_Payment.pdf, 13 November 2026.
export const paymentDocument = {
  title: "CRAFNS-2026 Registration & Payment Details",
  href: "/aeetds/documents/crafns-2026-registration-payment.pdf",
  filename: "CRAFNS-2026-Registration-and-Payment.pdf",
  description:
    "Registration fees, deadlines, bank / UPI instructions and payment policies for CRAFNS-2026.",
} as const;
export const bankDetails = [
  {
    label: "Account name",
    value:
      "Agriculture, Entrepreneur, Environment and Technology Development Society (AEETDS), Lucknow",
  },
  { label: "Bank", value: "Bank of Baroda" },
  { label: "Branch", value: "Mohibullapur, Lucknow" },
  { label: "Account number", value: "77300100025568" },
  { label: "IFSC", value: "BARB0VJMOHI" },
  { label: "UPI", value: "Google Pay / PhonePe at 7408206291" },
] as const;
export const conferenceDeadlines = [
  {
    label: "Opening of registration and abstract submission",
    date: "25 October 2026",
  },
  { label: "Last date for abstract submission", date: "20 November 2026" },
  { label: "Communication of abstract acceptance", date: "25 November 2026" },
  { label: "Last date for award nominations", date: "25 November 2026" },
  {
    label: "Last date for registration (without late fee)",
    date: "30 November 2026",
  },
  {
    label: "Last date for submission of full-length book chapters",
    date: "05 December 2026",
  },
  { label: "Conference dates", date: "10–11 December 2026" },
] as const;
export const registrationIntroduction =
  "Registration is mandatory for all participants, presenters and award nominees. An abstract is included in the Book of Abstracts, and the author is eligible to present, only after the registration fee has been received.";
export const registrationFeeRows = [
  { category: "International Delegate", early: "US$ 60", spot: "US$ 75" },
  {
    category: "International Student / Research Scholar",
    early: "US$ 50",
    spot: "US$ 60",
  },
  {
    category: "National Delegate (Scientist / Faculty / Professional)",
    early: "₹2,500",
    spot: "₹3,000",
  },
  {
    category: "National Student / Research Scholar",
    early: "₹2,000",
    spot: "₹2,500",
  },
  {
    category: "Industry / Corporate Delegate",
    early: "₹4,000",
    spot: "₹4,500",
  },
  { category: "Farmer / Accompanying Person", early: "₹2,000", spot: "₹2,000" },
  {
    category: "Online Participation (all categories)",
    early: "₹1,500",
    spot: "₹2,000",
  },
] as const;
export const registrationInclusions = [
  {
    icon: "backpack",
    title: "Offline (In-person) Registration",
    text: "Conference kit; participation / presentation certificate; working lunches, tea / snacks; conference dinner.",
  },
  {
    icon: "public",
    title: "Online Registration",
    text: "Virtual access to all sessions; online presentation slot for accepted abstracts; e-certificate.",
  },
  {
    icon: "hotel",
    title: "Accommodation",
    text: "Accommodation is not included. Limited ICAR-NAARM guest house/hostel accommodation may be available on a payment basis, subject to availability and first-come, first-served. Nearby hotel details will be shared with registered delegates. Mention your accommodation requirement when registering.",
  },
] as const;
export const sponsorshipOptions = [
  {
    title: "Platinum Sponsor",
    amount: "₹1,50,000",
    benefits:
      "Logo on main backdrop, brochure, website and all publicity material; speaking slot in a plenary session; exhibition stall; full-page advertisement in Book of Abstracts; five complimentary registrations.",
  },
  {
    title: "Diamond Sponsor",
    amount: "₹1,00,000",
    benefits:
      "Logo on backdrop, brochure and website; exhibition stall; full-page advertisement; four complimentary registrations.",
  },
  {
    title: "Gold Sponsor",
    amount: "₹75,000",
    benefits:
      "Logo on brochure and website; exhibition stall; half-page advertisement; three complimentary registrations.",
  },
  {
    title: "Silver Sponsor",
    amount: "₹50,000",
    benefits:
      "Logo on brochure and website; half-page advertisement; two complimentary registrations.",
  },
  {
    title: "Bronze Sponsor",
    amount: "₹25,000",
    benefits:
      "Acknowledgement in brochure and website; one complimentary registration.",
  },
  {
    title: "Exhibition Stall",
    amount: "₹15,000",
    benefits: "One stall (approximately 3 m × 2 m) for both days.",
  },
] as const;
export const registrationSteps = [
  "Check the registration fee for your participant category and mode (offline/online).",
  "Pay the fee to the AEETDS bank account or by UPI as listed under Payment Details.",
  "Fill in the online registration form with the amount paid, transaction ID / UTR number and payment date, and upload your payment receipt (screenshot or PDF).",
  "Presenting authors: submit your abstract on or before 20 November 2026.",
  "Receive confirmation by email after the Society has verified the payment.",
] as const;
export const registrationTransferPolicy =
  "A registration may be transferred to another delegate of the same category only with prior written intimation to the organisers.";
export const paymentPolicies = [
  "Registration and award contribution fees, once paid, are non-refundable.",
  registrationTransferPolicy,
  "An abstract is included in the Book of Abstracts only after the registration fee has been received.",
  "Confirmation of registration is sent by email after the payment has been verified.",
  "No TA/DA will be paid to participants or awardees by the organisers or AEETDS.",
] as const;
export const registrationPolicyAcknowledgement =
  "I acknowledge that registration and award contribution fees are non-refundable, registration transfer requires prior written intimation and the same participant category, and registration confirmation follows payment verification.";
export const awardContributionFees = [
  { category: "Students", contribution: "₹5,000" },
  { category: "All other Indian participants", contribution: "₹6,000" },
  { category: "Foreign participants", contribution: "US$ 150" },
] as const;
