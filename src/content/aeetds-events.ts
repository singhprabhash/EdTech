import provenance from "../../public/aeetds/provenance.json";
export type EventPhoto = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};
export type EventTheme = { title: string; icon: string; description?: string };
export type Conference = {
  slug: string;
  shortName: string;
  title: string;
  subtitle?: string;
  category: "international" | "national";
  status: "upcoming" | "completed";
  dates: string;
  startDate?: string;
  endDate?: string;
  venue: string;
  shortVenue: string;
  mode: string;
  host: string;
  organiser: string;
  collaborators: readonly string[];
  overview: string;
  themes: readonly EventTheme[];
  themesHeading: string;
  highlights?: readonly string[];
  people: readonly { name: string; role: string }[];
  photos: readonly EventPhoto[];
  stats?: readonly { value: string; label: string }[];
};
function photo(file: string, width: number, height: number): EventPhoto {
  const asset = provenance.assets.find((item) => item.file === file);
  if (!asset) throw new Error(`Missing approved event asset: ${file}`);
  return {
    src: `/aeetds/${file}`,
    caption: asset.caption,
    alt: asset.caption,
    width,
    height,
  };
}
export const eventPhotos = {
  ncfahs: [
    photo("2026_01_group_photo.jpg", 2560, 1700),
    photo("2026_03_release.jpg", 3102, 2060),
    photo("2026_02_delegates.jpg", 2560, 1700),
  ],
  fstat: [
    photo("2025_01_release.jpg", 2992, 1996),
    photo("2025_02_group_photo.jpg", 2560, 1706),
  ],
  iacrsaegns: [
    photo("2024_01_inauguration.jpg", 2270, 1470),
    photo("2024_02_delegates.jpg", 2560, 1706),
  ],
} as const;
export const eventsIntroduction =
  "AEETDS organises national and international conferences, seminars, workshops and training programmes that bring together scientists, academicians, policy makers, industry, students and farmers to exchange knowledge and advance agricultural and allied sciences.";
// Conference participation destinations supplied by the Society on 13 November 2026.
export const crafnsBrochure = {
  title: "CRAFNS-2026 Conference Brochure",
  href: "/aeetds/documents/crafns-2026-brochure.pdf",
  filename: "CRAFNS-2026-Brochure.pdf",
  description:
    "3rd International Conference · 10–11 December 2026 · ICAR-NAARM, Hyderabad.",
} as const;
export const crafnsForms = {
  registration: "https://forms.gle/AyASGfqcDvEtHaTV8",
  abstractSubmission: "https://forms.gle/3CD99LypP1iszLF16",
} as const;
export const crafnsConference: Conference = {
  slug: "crafns-2026",
  shortName: "CRAFNS-2026",
  title:
    "International Conference on Advances in Agricultural and Allied Sciences for Climate-Resilient Food and Nutritional Security",
  subtitle:
    "Advancing agricultural science for climate-resilient food and nutritional security.",
  category: "international",
  status: "upcoming",
  dates: "10-11 December, 2026",
  startDate: "2026-12-10",
  endDate: "2026-12-11",
  venue:
    "ICAR - National Academy of Agricultural Research Management (ICAR-NAARM), Rajendranagar, Hyderabad – 500030, Telangana, India",
  shortVenue: "ICAR-NAARM, Hyderabad",
  host: "To be announced",
  mode: "Hybrid — offline and online",
  organiser:
    "AEETDS, Lucknow, in technical collaboration with the host institution",
  collaborators: [],
  overview:
    "Food and nutritional security is under pressure from rising temperatures, erratic rainfall, degraded soils and shrinking water supplies. CRAFNS-2026 brings together scientists, academicians, policy makers, industry, students and farmers to discuss advances across the agricultural and allied sciences — crop improvement, horticulture, natural resource management, plant protection, animal and fisheries sciences, food technology, digital agriculture and agri-business — that can keep farms productive and diets nutritious under a changing climate.",
  themesHeading: "Suggested Scientific Sub-Themes",
  themes: [
    {
      title: "Climate-Resilient Crops",
      icon: "grass",
      description:
        "Climate-resilient crops: breeding, biotechnology and genome editing",
    },
    {
      title: "Horticulture & Food Processing",
      icon: "nutrition",
      description:
        "Horticulture, food processing, value addition and nutrition security",
    },
    {
      title: "Soil, Water & Natural Resources",
      icon: "water_drop",
      description: "Soil, water and natural resource management",
    },
    {
      title: "Plant Health & Biosecurity",
      icon: "pest_control",
      description: "Plant health: pests, diseases and biosecurity",
    },
    {
      title: "Livestock & Fisheries Sectors",
      icon: "phishing",
      description: "Livestock, fisheries and allied sectors",
    },
    {
      title: "Digital & Precision Agriculture",
      icon: "satellite_alt",
      description: "Digital, precision and dryland agriculture",
    },
    {
      title: "Agroforestry & Carbon-Negative Agri",
      icon: "forest",
      description: "Agroforestry, environment and carbon-negative agriculture",
    },
    {
      title: "Economics, Policy & Agripreneurship",
      icon: "analytics",
      description:
        "Agricultural economics, extension, policy and entrepreneurship",
    },
  ],
  highlights: [
    "Plenary, keynote and invited lectures by national and international experts",
    "Technical sessions with lead, oral and poster presentations",
    "Best Oral and Best Poster Presentation Awards in every technical session",
    "Farmer-industry-scientist interface and panel discussions",
    "AEETDS Society Awards and felicitation ceremony",
    "Book of Abstracts and edited volume (EdTech Publications, Lucknow)",
  ],
  people: [],
  photos: [],
};
export const pastConferences: readonly Conference[] = [
  {
    slug: "ncfahs-2026",
    shortName: "NCFAHS-2026",
    title:
      "National Conference on Frontiers in Agroforestry and Horticultural Sciences",
    subtitle: "Integrating Innovation, Resilience & Sustainability.",
    category: "national",
    status: "completed",
    dates: "15–16 July 2026",
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    venue: "ICAR-Central Agroforestry Research Institute (ICAR-CAFRI), Jhansi",
    shortVenue: "ICAR-CAFRI, Jhansi",
    host: "ICAR-CAFRI, Jhansi",
    mode: "Hybrid",
    organiser:
      "AEETDS with ICAR-CAFRI and the Indian Society of Agroforestry, Jhansi",
    collaborators: [
      "ICAR-CAFRI",
      "Indian Society of Agroforestry (ISAF), Jhansi",
    ],
    overview:
      "Organised at ICAR-CAFRI, Jhansi with the Indian Society of Agroforestry and AEETDS, the conference focused on horticulture-based agroforestry models, tree-crop interactions, carbon sequestration, ecosystem services and sustainable land use.",
    themesHeading: "Conference Focus",
    themes: [
      { title: "Horticulture-based agroforestry models", icon: "forest" },
      { title: "Tree-crop interactions", icon: "agriculture" },
      { title: "Carbon sequestration", icon: "eco" },
      { title: "Ecosystem services", icon: "nature_people" },
      { title: "Sustainable land use", icon: "landscape" },
    ],
    people: [
      { name: "Dr. A. Arunachalam", role: "Patron · President, ISAF" },
      { name: "Dr. F.A. Khan", role: "Patron · President, AEETDS" },
      {
        name: "Dr. R. Viswanathan",
        role: "Patron · Former Director, ICAR-IISR",
      },
      { name: "Dr. Naresh Kumar", role: "Convener · ICAR-CAFRI" },
    ],
    photos: eventPhotos.ncfahs,
  },
  {
    slug: "fstat-2025",
    shortName: "FSTAT-2025",
    title:
      "II International Conference on Frontiers in Science and Technology for Agricultural Transformation",
    category: "international",
    status: "completed",
    dates: "25–26 September 2025",
    startDate: "2025-09-25",
    endDate: "2025-09-26",
    venue:
      "ICAR-National Academy of Agricultural Research Management (ICAR-NAARM), Hyderabad",
    shortVenue: "ICAR-NAARM, Hyderabad",
    host: "ICAR-NAARM, Hyderabad",
    mode: "Hybrid",
    organiser: "AEETDS in collaboration with ICAR-NAARM, Hyderabad",
    collaborators: [
      "ICAR-National Academy of Agricultural Research Management (ICAR-NAARM), Hyderabad",
    ],
    overview:
      "Held at ICAR-NAARM, Hyderabad with nine themes ranging from dryland, digital and precision agriculture to carbon-negative agriculture.",
    themesHeading: "Nine Thematic Deliberation Tracks",
    themes: [
      { title: "Dryland Agriculture & Climate Adaptation", icon: "sunny" },
      { title: "Digital & Precision Agro-Technologies", icon: "satellite_alt" },
      { title: "Carbon-Negative Agro-Ecosystems", icon: "eco" },
      { title: "Microbiome & Microbial Biotechnology", icon: "biotech" },
      { title: "Agri-Entrepreneurship & Incubation", icon: "rocket_launch" },
      {
        title: "Post-Harvest & Food Processing Value Chains",
        icon: "inventory_2",
      },
      { title: "Plant Protection & IPM Strategies", icon: "pest_control" },
      { title: "Natural Resource Management & Ecology", icon: "water_drop" },
      { title: "Policy, Institutional Reform & Extension", icon: "policy" },
    ],
    people: [
      { name: "Dr. R. Viswanathan", role: "Conference Chair" },
      {
        name: "Dr. F.A. Khan",
        role: "Conference Secretariat · President, AEETDS",
      },
      { name: "Dr. Anand Singh", role: "Organising Secretary · BUAT, Banda" },
      { name: "Dr. P.K. Sahu", role: "Organising Secretary · ICAR-NBAIM, Mau" },
    ],
    photos: eventPhotos.fstat,
  },
  {
    slug: "iacrsaegns-2024",
    shortName: "IACRSAEGNS-2024",
    title:
      "First International Conference on Innovations to Achieve Climate Resilient Smart Agriculture for Ensuring Global Food and Nutritional Security",
    category: "international",
    status: "completed",
    dates: "18–19 November 2024",
    startDate: "2024-11-18",
    endDate: "2024-11-19",
    venue: "ICAR-Indian Institute of Sugarcane Research (ICAR-IISR), Lucknow",
    shortVenue: "ICAR-IISR, Lucknow",
    host: "ICAR-IISR, Lucknow",
    mode: "Hybrid",
    organiser:
      "AEETDS in collaboration with ICAR-IISR, UPCAR, ICAR-IISS and CSIR-NBRI",
    collaborators: [
      "ICAR-IISR, Lucknow",
      "UPCAR, Lucknow",
      "ICAR-IISS, Mau",
      "CSIR-NBRI, Lucknow",
    ],
    overview:
      "The Society's first international conference, on the theme of climate change, held at the ICAR-IISR auditorium, Lucknow. Chief Patron: Dr. R. Viswanathan, then Director, ICAR-IISR. It covered seven themes from climate change mitigation to life sciences, social sciences and multidisciplinary studies.",
    themesHeading: "The Seven Thematic Research Divisions",
    themes: [
      {
        title: "Climate Change Mitigation & Carbon Sequestration",
        icon: "eco",
      },
      {
        title: "Smart Irrigation & Water Resource Optimization",
        icon: "water_drop",
      },
      {
        title: "Genomic Innovations & Stress Tolerant Breeding",
        icon: "genetics",
      },
      {
        title: "Global Nutritional Security & Biofortification",
        icon: "nutrition",
      },
      { title: "Botanical Therapeutics & Life Sciences", icon: "biotech" },
      { title: "Agri-Entrepreneurship & Social Sciences", icon: "groups" },
      { title: "Multidisciplinary Studies", icon: "hub" },
    ],
    people: [
      {
        name: "Dr. R. Viswanathan",
        role: "Chief Patron · then Director, ICAR-IISR",
      },
    ],
    photos: eventPhotos.iacrsaegns,
  },
];
export const conferences: readonly Conference[] = [
  crafnsConference,
  ...pastConferences,
];
export const calendarConferences = conferences.map(
  ({ slug, shortName, title, startDate, endDate, dates, shortVenue }) => ({
    slug,
    shortName,
    title,
    startDate,
    endDate,
    dates,
    shortVenue,
  }),
);
export const trainingIntroduction =
  "AEETDS runs short training programmes and workshops on agricultural entrepreneurship, practical farming skills, natural resource management and scientific research.";
export const trainingOfficialCopy =
  "AEETDS runs short training programmes and workshops on agri-entrepreneurship, mushroom cultivation, beekeeping, vermicomposting, nursery management, value addition and food processing, rainwater harvesting, digital tools for farmers, and scientific writing and research methodology for scholars. Institutions wishing to host a programme with the Society can write to the Secretary.";
export const trainingPillars: readonly EventTheme[] = [
  { title: "Agri-entrepreneurship", icon: "rocket_launch" },
  { title: "Mushroom cultivation", icon: "compost" },
  { title: "Beekeeping", icon: "hive" },
  { title: "Vermicomposting", icon: "recycling" },
  { title: "Nursery management", icon: "potted_plant" },
  { title: "Value addition and food processing", icon: "inventory_2" },
  { title: "Rainwater harvesting", icon: "water_drop" },
  { title: "Digital tools for farmers", icon: "smartphone" },
  {
    title: "Scientific writing and research methodology",
    icon: "edit_document",
  },
];
export const trainingInvitation =
  "Institutions, universities, KVKs, and organisations wishing to host a training programme or workshop with the Society can write directly to the Secretary.";
