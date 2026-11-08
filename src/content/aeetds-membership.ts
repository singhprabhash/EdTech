// Official AEETDS Website Content, pages 12 and 30. Input options are broad
// presentation aids, not additional eligibility requirements.
export const membershipIntroduction =
  "Membership of AEETDS is open to every person and institution interested in agricultural and allied sciences, environment, technology and rural development — scientists, teachers, research scholars, students, extension workers, entrepreneurs, farmers and industry professionals, in India and abroad.";
export const membershipCategories = [
  {
    value: "Life",
    name: "Life Member",
    icon: "workspace_premium",
    eligibility: "Scientists, faculty, professionals",
    india: "To be announced",
    foreign: "To be announced",
  },
  {
    value: "Annual",
    name: "Annual Member",
    icon: "calendar_month",
    eligibility: "Scientists, faculty, professionals",
    india: "To be announced per year",
    foreign: "To be announced",
  },
  {
    value: "Student",
    name: "Student Member",
    icon: "school",
    eligibility: "UG, PG and Ph.D. students; proof of enrolment required",
    india: "To be announced per year",
    foreign: "To be announced",
  },
  {
    value: "Institutional",
    name: "Institutional Member",
    icon: "account_balance",
    eligibility: "Universities, institutes, colleges and KVKs",
    india: "To be announced",
    foreign: "Not specified",
  },
  {
    value: "Corporate",
    name: "Corporate Member",
    icon: "business_center",
    eligibility: "Companies, start-ups and FPOs",
    india: "To be announced",
    foreign: "To be announced",
  },
  {
    value: "Honorary",
    name: "Honorary Member",
    icon: "military_tech",
    eligibility: "By invitation of the Executive Council",
    india: "Nil",
    foreign: "Nil",
  },
] as const;
export const membershipBenefits = [
  {
    icon: "confirmation_number",
    text: "Concessional registration at all AEETDS conferences, seminars and workshops.",
  },
  {
    icon: "emoji_events",
    text: "Eligibility for AEETDS Society Awards and Fellowship.",
  },
  {
    icon: "auto_stories",
    text: "Priority consideration for oral presentations and publication of book chapters in Society volumes.",
  },
  {
    icon: "badge",
    text: "Membership certificate and a listing in the online members' directory.",
  },
  {
    icon: "groups",
    text: "Opportunity to serve on organising, editorial and technical committees.",
  },
  {
    icon: "notifications_active",
    text: "Regular updates on conferences, calls for papers, trainings and opportunities.",
  },
  {
    icon: "hub",
    text: "Networking with scientists, policy makers, entrepreneurs and farmers.",
  },
] as const;
export const membershipAudiences = [
  { icon: "science", name: "Scientists" },
  { icon: "school", name: "Teachers and faculty" },
  { icon: "biotech", name: "Research scholars" },
  { icon: "menu_book", name: "Students" },
  { icon: "support_agent", name: "Extension workers" },
  { icon: "rocket_launch", name: "Entrepreneurs" },
  { icon: "agriculture", name: "Farmers" },
  { icon: "precision_manufacturing", name: "Industry professionals" },
  { icon: "account_balance", name: "Institutions" },
] as const;
export const membershipProcess = [
  "Fill in the online membership form.",
  "Pay the membership fee to the Society bank account (details on the Registration page) and upload the payment receipt.",
  "Receive an acknowledgement email with your application reference number.",
  "After verification, the Secretary issues your membership number and certificate by email, usually within 15 working days.",
] as const;
export const membershipDeclaration =
  "I agree to abide by the Rules and Regulations of AEETDS.";
export const paymentNote =
  "Pay the membership fee to the Society bank account. Bank details are available on the Registration page.";
export const integrationNotice =
  "Online submission is not yet connected. You can complete and review this form, but it will not send an application or upload documents. Your entries remain only in this page and are cleared if you leave or reload it.";
export const disciplines = [
  "Agricultural sciences",
  "Environment",
  "Technology",
  "Rural development",
  "Other",
] as const;
export const qualifications = [
  "Doctorate",
  "Master's degree",
  "Bachelor's degree",
  "Diploma",
  "Other",
] as const;
