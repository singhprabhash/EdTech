import { society } from "./aeetds";

// Canonical About content: supplied implementation brief and AEETDS Website
// Content v1.0, page 7. Extra prose in Stitch is not verified website content.
export const aboutIntroduction =
  "Fostering agricultural resilience, scholarly innovation, ecological stewardship, and grassroots entrepreneurial leadership.";

export const backgroundParagraphs = [
  `The ${society.name} (AEETDS), Uttar Pradesh, India, is an autonomous research and educational organisation based in Lucknow. It was founded in 2024 as a national-level non-governmental organisation and is registered under the Societies Registration Act XXI of 1860 (Reg. No. ${society.registration}).`,
  "The Society promotes research in agricultural and allied sciences, social sciences and biological sciences for the welfare of farmers and society at large. It works to develop entrepreneurship among farmers and agricultural students and to conserve nature and the environment. It organises conferences, workshops, training programmes and symposia on pressing national and international issues, and extends its support to educators, researchers and farmers across India and abroad.",
  "AEETDS believes that lasting change begins with young minds. It therefore works to show students and rural youth what agricultural science can offer them, and to build their confidence and capacity to become self-reliant by establishing agri-enterprises.",
];

type SocietyProfileEntry = {
  label: string;
  value: string;
  icon: string;
  kind?: "registration" | "email";
};
export const societyProfile: readonly SocietyProfileEntry[] = [
  { label: "Full Name", value: `${society.name} (AEETDS)`, icon: "badge" },
  {
    label: "Legal Status",
    value: "Registered society, Societies Registration Act XXI of 1860",
    icon: "gavel",
  },
  {
    label: "Registration No.",
    value: society.registration,
    icon: "confirmation_number",
    kind: "registration",
  },
  { label: "Year of Establishment", value: "2024", icon: "calendar_today" },
  { label: "Headquarters", value: society.location, icon: "location_on" },
  {
    label: "Nature of Body",
    value: "National-level, non-profit scientific and educational society",
    icon: "category",
  },
  {
    label: "Official Email",
    value: society.email,
    icon: "mail",
    kind: "email",
  },
];

type SocietyMilestone = {
  date: string;
  dateTime: string;
  title: string;
  description: string;
  icon: string;
};
export const societyMilestones: readonly SocietyMilestone[] = [
  {
    date: "2024",
    dateTime: "2024",
    title: "Society Registered",
    description:
      "AEETDS registered at Lucknow under the Societies Registration Act XXI of 1860.",
    icon: "account_balance",
  },
  {
    date: "Nov 2024",
    dateTime: "2024-11",
    title: "First International Conference",
    description:
      "First International Conference (IACRSAEGNS-2024) at ICAR-IISR, Lucknow, with UPCAR, ICAR-IISS Mau and CSIR-NBRI Lucknow.",
    icon: "groups",
  },
  {
    date: "Sep 2025",
    dateTime: "2025-09",
    title: "II International Conference (FSTAT-2025)",
    description:
      "II International Conference on Frontiers in Science and Technology for Agricultural Transformation (FSTAT-2025) with ICAR-NAARM, Hyderabad.",
    icon: "science",
  },
  {
    date: "Jul 2026",
    dateTime: "2026-07",
    title: "National Conference (NCFAHS-2026)",
    description:
      "National Conference on Frontiers in Agroforestry and Horticultural Sciences (NCFAHS-2026) with ICAR-CAFRI and ISAF, Jhansi.",
    icon: "nature_people",
  },
  {
    date: "2026",
    dateTime: "2026",
    title: "3rd International Conference (CRAFNS-2026)",
    description: "3rd International Conference CRAFNS-2026 (in preparation).",
    icon: "rocket_launch",
  },
];
