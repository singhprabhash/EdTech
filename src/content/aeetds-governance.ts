// Canonical source: AEETDS Website Content, pages 10–11. Names/statuses are
// not inferred from the visual reference. Pending names remain unconfirmed.
export const governanceIntroduction =
  "AEETDS is governed by its Memorandum of Association and Rules and Regulations. Policy decisions are taken by the Executive Council and approved by the General Body.";
export const generalBody =
  "The General Body consists of all members of the Society and meets at least once a year. It considers the annual report, approves the audited statement of accounts, appoints the auditor and decides any other matter placed before it. The President may call a special meeting of the General Body whenever necessary.";
export const executiveCouncil =
  "The Executive Council is the main policy-making body of the Society. It plans and carries out the Society's programmes, manages its affairs and property, and constitutes committees as required. Its office bearers and members are elected by the General Body for a fixed term as laid down in the Rules and Regulations.";

export const president = {
  name: "Prof. (Dr.) F.A. Khan",
  designation: "Professor, Department of Crop Physiology",
  institution:
    "Sher-e-Kashmir University of Agricultural Sciences and Technology of Kashmir (SKUAST-Kashmir)",
};
export const unconfirmedSecretary = {
  name: "Dr. Niyaz Ahmad",
  affiliation: "ANDUAT, Kumarganj, Ayodhya",
  status: "confirmation required",
};
export const pendingPositions = [
  "Vice-President(s)",
  "Joint Secretary",
  "Treasurer",
  "Editor(s)",
  "Executive Council members",
] as const;

type OfficeRole = { title: string; text: string; icon: string };
export const officeRoles: readonly OfficeRole[] = [
  {
    title: "President",
    text: "Chairs the Executive Council and the General Body, and is in overall charge of the Society's affairs. The President has a casting vote when votes are tied.",
    icon: "gavel",
  },
  {
    title: "Vice-President",
    text: "Exercises powers delegated by the President or the Council and presides in the President's absence.",
    icon: "supervisor_account",
  },
  {
    title: "Secretary",
    text: "The chief executive of the Society. Maintains the register of members, conducts correspondence, keeps records and minutes, convenes meetings and supervises day-to-day affairs under the direction of the Executive Council.",
    icon: "edit_document",
  },
  {
    title: "Treasurer",
    text: "Collects dues, keeps accurate accounts of receipts, expenditure, assets and liabilities, and deposits all funds in the Society's scheduled-bank account.",
    icon: "account_balance_wallet",
  },
  {
    title: "Editor",
    text: "responsible for the Society's publications, including books of abstracts, edited volumes and the magazine.",
    icon: "menu_book",
  },
];
export const committees = [
  {
    name: "Programme Committee",
    role: "Plans the annual calendar of conferences, trainings and publications.",
  },
  {
    name: "Awards Committee",
    role: "Screens nominations for Society awards and fellowship on the basis of the Academic Performance Indicator (API) score.",
  },
  { name: "Finance Committee", role: "Oversees budgets, accounts and audit." },
  {
    name: "Editorial Board",
    role: "Reviews and edits abstracts, chapters and articles for Society publications.",
  },
  {
    name: "Conference Organising Committees",
    role: "Constituted for each event with the host institution.",
  },
] as const;
