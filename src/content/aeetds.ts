import { crafnsConference } from "./aeetds-events";

// Canonical copy: AEETDS Website Content, v1.0, 30 October 2026, pp. 3–6,
// 13–17 and 22–24. Visual composition: references/aeetds/home.html.
export const society = {
  name: "Agriculture, Entrepreneur, Environment & Technology Development Society",
  shortName: "AEETDS",
  registration: "LUC/00238/2024-25",
  email: "secretaryaeetds@gmail.com",
  phones: ["+91-8009529170", "+91-7408206291", "+91-9198666776"],
  location: "Lucknow, Uttar Pradesh, India",
  headline:
    "Science, Enterprise and Environment for a Self-Reliant Farm Sector",
  introduction:
    "AEETDS brings scientists, educators, students, entrepreneurs and farmers together to turn agricultural research into livelihoods, enterprises and a cleaner, greener world.",
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Membership", href: "/membership" },
  { label: "Conferences & Events", href: "/events" },
  { label: "Awards & Fellowship", href: "/awards" },
  { label: "Publications", href: "/publications" },
  { label: "Submit / Register", href: "/submit" },
  { label: "Contact", href: "/contact" },
];

export const announcements = [
  {
    label: "CFP",
    text: "Call for Papers: 3rd International Conference CRAFNS-2026 — abstracts invited. 10-11 December, 2026 · ICAR-NAARM, Hyderabad.",
    href: "/submit/guidelines",
  },
  {
    label: "NEW",
    text: "Nominations open for AEETDS Society Awards 2026.",
    href: "/awards",
  },
  {
    label: "NEW",
    text: "Membership open: Life, Annual and Student membership of AEETDS.",
    href: "/membership/apply",
  },
  {
    label: "CFP",
    text: "Call for Book Chapters: edited volume with EdTech Publications, Lucknow (ISBN) — no publication fee.",
    href: "/publications",
  },
  {
    label: "REPORT",
    text: "NCFAHS-2026 held 15–16 July 2026 at ICAR-CAFRI, Jhansi.",
    href: "/events",
  },
  {
    label: "REPORT",
    text: "II International Conference FSTAT-2025 held 25–26 September 2025 at ICAR-NAARM, Hyderabad.",
    href: "/events",
  },
];

export const slides = [
  {
    image: "/aeetds/2026_01_group_photo.jpg",
    alt: "Delegates, scientists and organisers in front of ICAR-Central Agroforestry Research Institute, Jhansi.",
    label: "NCFAHS-2026 • ICAR-CAFRI JHANSI",
    caption: "Frontiers in Agroforestry and Horticultural Sciences",
    detail: "15–16 July 2026 • ICAR-CAFRI, Jhansi.",
  },
  {
    image: "/aeetds/2025_02_group_photo.jpg",
    alt: "Group photograph of delegates at the ICAR-NAARM campus, Hyderabad.",
    label: "FSTAT-2025 • ICAR-NAARM HYDERABAD",
    caption:
      "Frontiers in Science and Technology for Agricultural Transformation",
    detail: "II International Conference • 25–26 September 2025.",
  },
  {
    image: "/aeetds/2024_01_inauguration.jpg",
    alt: "Release of the conference publication at the inaugural session, ICAR-Indian Institute of Sugarcane Research, Lucknow.",
    label: "IACRSAEGNS-2024 • ICAR-IISR LUCKNOW",
    caption:
      "Climate Resilient Smart Agriculture for Global Food and Nutritional Security",
    detail: "First International Conference • 18–19 November 2024.",
  },
  {
    image: "/aeetds/2026_02_delegates.jpg",
    alt: "A full auditorium of delegates from across India at ICAR-CAFRI, Jhansi.",
    label: "NCFAHS-2026 • ICAR-CAFRI JHANSI",
    caption: "Scientific exchange across India",
    detail: "Delegates at the National Conference • 15–16 July 2026.",
  },
];

export const welcome = [
  "The Agriculture, Entrepreneur, Environment & Technology Development Society (AEETDS) is a national-level, non-profit scientific society based in Lucknow, Uttar Pradesh, registered in 2024 under the Societies Registration Act XXI of 1860.",
  "The Society works where science, policy and practice meet: it promotes research in agricultural and allied sciences, builds entrepreneurship among farmers and agricultural students, and supports the conservation of natural resources and the environment.",
  "Through national and international conferences, training programmes, publications and awards, AEETDS gives researchers a platform to share their work and gives farmers and young people access to the knowledge and skills they need to build agri-enterprises of their own.",
];

export const conference = {
  title:
    "3rd International Conference: Advances in Agricultural and Allied Sciences for Climate-Resilient Food and Nutritional Security (CRAFNS-2026)",
  dates: crafnsConference.dates,
  venue: crafnsConference.venue,
  description:
    "The conference brings together scientists, academicians, policy makers, industry, students and farmers to discuss advances in agricultural and allied sciences for climate-resilient food and nutritional security.",
};

export const initiatives = [
  {
    icon: "groups",
    title: "Conferences & Symposia",
    text: "National and international conferences with ICAR, CSIR and State institutions.",
    link: "Explore events",
    href: "/events",
  },
  {
    icon: "science",
    title: "Research Promotion",
    text: "Interdisciplinary work in agriculture, environment, biological and social sciences.",
    link: "Scientific focus",
    href: "/about",
  },
  {
    icon: "agriculture",
    title: "Agri-Entrepreneurship",
    text: "Mentoring farmers and students to start and grow agri-enterprises.",
    link: "Discover membership",
    href: "/membership",
  },
  {
    icon: "school",
    title: "Training & Skill Development",
    text: "Hands-on programmes for rural and urban farmers, youth and women.",
    link: "Trainings & workshops",
    href: "/events",
  },
  {
    icon: "menu_book",
    title: "Publications",
    text: "Books of abstracts, edited volumes and a planned magazine and journal.",
    link: "Explore publications",
    href: "/publications",
  },
  {
    icon: "workspace_premium",
    title: "Awards & Recognition",
    text: "Society awards and fellowship for researchers, teachers and innovators.",
    link: "Nomination criteria",
    href: "/awards",
  },
];

export const collaborators = [
  {
    icon: "psychology",
    category: "ICAR INSTITUTION",
    name: "ICAR-Indian Institute of Sugarcane Research",
    location: "Lucknow, Uttar Pradesh",
  },
  {
    icon: "school",
    category: "ICAR ACADEMY",
    name: "ICAR-National Academy of Agricultural Research Management",
    location: "Hyderabad, Telangana",
  },
  {
    icon: "forest",
    category: "ICAR AGROFORESTRY",
    name: "ICAR-Central Agroforestry Research Institute",
    location: "Jhansi, Uttar Pradesh",
  },
  {
    icon: "nature_people",
    category: "LEARNED SOCIETY",
    name: "Indian Society of Agroforestry",
    location: "Jhansi, Uttar Pradesh",
  },
  {
    icon: "corporate_fare",
    category: "STATE COUNCIL",
    name: "Uttar Pradesh Council of Agricultural Research",
    location: "Lucknow, Uttar Pradesh",
  },
  {
    icon: "grain",
    category: "ICAR SEED SCIENCE",
    name: "ICAR-Indian Institute of Seed Science",
    location: "Mau, Uttar Pradesh",
  },
  {
    icon: "biotech",
    category: "CSIR INSTITUTION",
    name: "CSIR-National Botanical Research Institute",
    location: "Lucknow, Uttar Pradesh",
  },
  {
    icon: "auto_stories",
    category: "PUBLISHING PARTNER",
    name: "EdTech Publications",
    location: "Lucknow, Uttar Pradesh",
  },
];

export const news = [
  {
    category: "CONFERENCE REPORT",
    title: "NCFAHS-2026 National Conference at ICAR-CAFRI, Jhansi",
    summary:
      "Held 15–16 July 2026, the conference provided scientific exchange in agroforestry and horticultural sciences.",
    badge: ["JULY", "15–16", "2026"],
    note: "EVENT DATES • ICAR-CAFRI JHANSI",
    action: "Conference details",
    href: "/events",
  },
  {
    category: "CALL FOR PAPERS",
    title: "Call for Papers: CRAFNS-2026",
    summary:
      "Abstracts invited for the hybrid international conference on climate-resilient food and nutritional security. 10-11 December, 2026 at ICAR-NAARM, Hyderabad.",
    badge: ["CRAFNS", "2026", "CALL FOR PAPERS"],
    note: "10–11 DECEMBER 2026 • ICAR-NAARM HYDERABAD",
    action: "Submit Abstract",
    href: "/submit/guidelines",
  },
  {
    category: "AWARDS & RECOGNITION",
    title: "AEETDS Society Awards 2026 — nominations open",
    summary:
      "Society awards and fellowship recognise researchers, teachers and innovators. Contact the Secretary for the nomination notice and requirements.",
    badge: ["AWARDS", "2026", "NOMINATIONS"],
    note: "ENQUIRIES: SOCIETY SECRETARIAT",
    action: "Award nominations",
    href: "/awards#nomination",
  },
];

export const quickLinks = [
  {
    icon: "card_membership",
    label: "Membership Form",
    description: "Life, Annual and Student membership",
    href: "/membership/apply",
  },
  {
    icon: "event_available",
    label: "Conference Registration",
    description: "CRAFNS-2026 delegate registration",
    href: "/submit/registration",
  },
  {
    icon: "upload_file",
    label: "Abstract Submission",
    description: "Share your research with the conference",
    href: "/submit/guidelines",
  },
  {
    icon: "military_tech",
    label: "Award Nomination",
    description: "Society awards and fellowship",
    href: "/awards#nomination",
  },
  {
    icon: "download",
    label: "Downloads & Brochures",
    description: "Society documents and event information",
    href: "/downloads",
  },
  {
    icon: "contact_support",
    label: "Contact Secretariat",
    description: "Reach the Society Secretariat",
    href: "/contact",
  },
];
