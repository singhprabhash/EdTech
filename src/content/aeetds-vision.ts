// Canonical factual copy: AEETDS Website Content v1.0, pages 8–9.
// Editorial headings/CTA copy: supplied Vision implementation brief.
export const visionIntroduction =
  "Bringing agricultural science, entrepreneurship and environmental responsibility together to build sustainable and self-reliant rural livelihoods.";
export const visionStatement =
  "A knowledge-driven, entrepreneurship-enabled and environmentally secure rural economy in which every farmer and agricultural graduate can draw on science to build a sustainable and self-reliant livelihood.";
export const missionStatement =
  "To connect agricultural research with the field and the marketplace — by giving scientists a credible platform to share their findings, by equipping farmers, students and women with practical skills and enterprise opportunities, and by promoting the wise use of soil, water and biological resources for present and future generations.";
export const whyParagraphs = [
  "Indian agriculture has moved well beyond the production targets of the Green Revolution. The challenge now is to hold those gains under a changing climate, falling natural resources and a rural economy that is fast diversifying into agri-business. Meeting it needs science, enterprise and environmental care to work together rather than in separate compartments. AEETDS was set up to bring them together.",
  "The Society promotes climate-resilient crop production, sustainable resource management and technology-led farm practices. It identifies agri-entrepreneurship models that work, develops skill-based training for farmers and students, and encourages the conservation of biological resources, water and rainwater harvesting, and the use of digital tools in modern farming. Its aim is to carry ideas from the laboratory to the village, so that research reduces the vulnerability of rural households and opens the way to self-reliance for farming communities and agricultural students alike.",
  "AEETDS serves a broad community of scientists, educators, entrepreneurs and farmers. It provides reliable, usable information on agricultural and environmental wellbeing; takes part in the exchange of knowledge among the public, policy makers and the scientific and farming communities; and creates opportunities for scientific communication, enterprise skill-building and professional growth for its members, with special attention to gender inclusion and the improvement of rural and urban livelihoods.",
];

type Objective = { text: string; icon: string };
export const objectives: readonly Objective[] = [
  {
    text: "promote and disseminate knowledge in agricultural and allied sciences, medical sciences, social sciences, and biological and physical sciences for sustainable development and a cleaner, greener world;",
    icon: "science",
  },
  {
    text: "publish a monthly magazine for quality popular articles and establish peer-reviewed journals for outstanding research;",
    icon: "menu_book",
  },
  {
    text: "create awareness among youth about self-reliance through the establishment of agri-enterprises;",
    icon: "storefront",
  },
  {
    text: "organise educational and extension activities, including national and international conferences, seminars, workshops and training programmes;",
    icon: "groups",
  },
  {
    text: "improve rural and urban livelihood conditions;",
    icon: "trending_up",
  },
  {
    text: "create awareness about water conservation and rainwater harvesting;",
    icon: "water_drop",
  },
  {
    text: "promote the empowerment of women through educational and training programmes;",
    icon: "diversity_1",
  },
  {
    text: "organise skill-development schemes for rural and urban farmers;",
    icon: "psychology",
  },
  {
    text: "promote digital education and modern agricultural practices.",
    icon: "devices",
  },
];

type ThrustArea = { title: string; focus: string; icon: string };
export const thrustAreas: readonly ThrustArea[] = [
  {
    title: "Climate-resilient agriculture",
    focus:
      "Stress-tolerant crops, climate-smart practices, agroforestry, carbon-negative farming",
    icon: "nest_eco_leaf",
  },
  {
    title: "Agri-entrepreneurship",
    focus:
      "Start-up models, incubation, mentoring and investment-readiness for agri-SMEs and FPOs",
    icon: "finance",
  },
  {
    title: "Natural resource management",
    focus:
      "Soil health, water use efficiency, rainwater harvesting, ecosystem services",
    icon: "water_voc",
  },
  {
    title: "Technology dissemination",
    focus:
      "Precision and digital agriculture, biotechnology, extension and farmer-scientist interface",
    icon: "biotech",
  },
  {
    title: "Inclusive livelihoods",
    focus:
      "Women's empowerment, rural youth, skill development, nutrition security",
    icon: "diversity_3",
  },
];

export const coreValues = [
  { name: "Scientific integrity", icon: "verified_user" },
  { name: "Service to farmers", icon: "agriculture" },
  { name: "Inclusiveness", icon: "handshake" },
  { name: "Environmental responsibility", icon: "eco" },
  { name: "Transparency", icon: "visibility" },
] as const;
