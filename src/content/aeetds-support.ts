// Official Website Content PDF pp.27–29; enquiry categories/fields p.33 (B8).
import { society } from "./aeetds";
export const contactInformation = {
  introduction:
    "We welcome your questions, suggestions and proposals for collaboration. Write to us and the Secretary's office will respond within three working days.",
  phones: [...society.phones, "+91-7042360966"],
  hours: "Monday to Saturday, 10:00 am – 5:00 pm IST",
  website: "https://www.aeetds.com",
  websiteLabel: "www.aeetds.com",
} as const;
export const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "membership", label: "Membership & Attendance" },
  { id: "abstracts", label: "Abstract Submissions" },
  { id: "awards", label: "Awards & Honors" },
  { id: "publications", label: "Publications & Ethics" },
  { id: "logistics", label: "Logistics & Contact" },
] as const;
export type FaqCategory = (typeof faqCategories)[number]["id"];
export type Faq = {
  id: string;
  category: Exclude<FaqCategory, "all">;
  question: string;
  answer: string;
};
export const faqs: readonly Faq[] = [
  {
    id: "membership-eligibility",
    category: "membership",
    question: "Who can become a member of AEETDS?",
    answer:
      "Anyone interested in agriculture, allied sciences, environment, technology or rural development, in India or abroad — including students, farmers and entrepreneurs.",
  },
  {
    id: "conference-membership",
    category: "membership",
    question: "Is membership required to attend a conference?",
    answer:
      "No. Non-members can register for any event. Members pay concessional fees where announced.",
  },
  {
    id: "abstract-receipt",
    category: "abstracts",
    question: "How do I know my abstract has been received?",
    answer:
      "You receive an automatic acknowledgement email with a reference number immediately after submission. Acceptance is communicated by email by the date given in the brochure.",
  },
  {
    id: "abstract-registration",
    category: "abstracts",
    question: "Will my abstract be published if I do not register?",
    answer:
      "No. Abstracts are published only after the registration fee is received.",
  },
  {
    id: "award-payment",
    category: "awards",
    question: "When should I pay the award fee?",
    answer:
      "Only after you receive email confirmation that your award has been approved. Do not pay at the time of nomination.",
  },
  {
    id: "online-presentation",
    category: "membership",
    question: "Can I present online?",
    answer:
      "Yes. AEETDS conferences are held in hybrid mode; choose the online category while registering.",
  },
  {
    id: "travel-allowance",
    category: "logistics",
    question: "Are travel and daily allowances paid?",
    answer:
      "No. The Society and organisers do not pay TA or DA to participants or awardees.",
  },
  {
    id: "registration-refund",
    category: "logistics",
    question: "Is the registration fee refundable?",
    answer:
      "No. Registration and award contribution fees are non-refundable and non-transferable.",
  },
  {
    id: "participant-certificate",
    category: "awards",
    question: "Will I get a certificate?",
    answer:
      "Yes. All registered participants receive a participation certificate; presenters receive a presentation certificate.",
  },
  {
    id: "chapter-fee",
    category: "publications",
    question: "Is there a fee for publishing a book chapter?",
    answer:
      "No. Chapters accepted for the Society's edited volumes are published without charge.",
  },
  {
    id: "society-contact",
    category: "logistics",
    question: "How do I contact the Society?",
    answer:
      "Write to secretaryaeetds@gmail.com or use the Contact form. We aim to reply within three working days.",
  },
];
export function filterFaqs(category: FaqCategory, query: string) {
  const term = query.trim().toLocaleLowerCase();
  return faqs.filter(
    (faq) =>
      (category === "all" || faq.category === category) &&
      (!term ||
        `${faq.question} ${faq.answer}`.toLocaleLowerCase().includes(term)),
  );
}
export function faqStructuredData(records: readonly Faq[] = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: records.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
export type Policy = {
  id: string;
  title: string;
  icon: string;
  paragraphs: readonly string[];
  highlight?: number;
};
export const policies: readonly Policy[] = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    icon: "privacy_tip",
    paragraphs: [
      "AEETDS collects only the personal information you give us through our forms — such as name, institution, email, phone number and uploaded documents — and uses it solely to process your membership, registration, submission, nomination or enquiry, and to inform you about Society activities.",
      "We do not sell, rent or share your information with third parties, except with the host institution of a conference where needed to organise the event.",
      "You may ask us to correct or delete your information by writing to secretaryaeetds@gmail.com.",
    ],
    highlight: 2,
  },
  {
    id: "terms-of-use",
    title: "Terms of Use",
    icon: "gavel",
    paragraphs: [
      "All content on this website, including text, logos and photographs, belongs to AEETDS or is used with permission, and may not be reproduced for commercial purposes without written consent.",
      "By submitting material to AEETDS, authors confirm that it is original, that all co-authors have agreed to its submission, and that it does not infringe anyone else's rights.",
    ],
    highlight: 1,
  },
  {
    id: "refund-policy",
    title: "Refund and Cancellation Policy",
    icon: "receipt_long",
    paragraphs: [
      "Registration fees, membership fees and award contribution fees are non-refundable and non-transferable.",
      "If AEETDS cancels an event, registered participants will be offered a full refund or a transfer to the next event.",
      "Payments made twice by mistake are refunded after verification, less bank charges.",
    ],
    highlight: 0,
  },
  {
    id: "publication-ethics",
    title: "Publication Ethics",
    icon: "fact_check",
    paragraphs: [
      "AEETDS expects all authors to follow accepted standards of research and publication ethics.",
      "Plagiarism, data fabrication, duplicate submission and improper authorship lead to rejection or withdrawal of the work.",
      "All submissions for edited volumes are checked for similarity, and must show less than 10% similarity.",
    ],
    highlight: 2,
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    icon: "info",
    paragraphs: [
      "The views expressed in papers, presentations and publications are those of the authors and not necessarily of AEETDS.",
      "While we make every effort to keep information on this website accurate and current, programme details may change; the latest brochure and notices on this website prevail.",
    ],
  },
];
