// Canonical AEETDS content, PDF pages 15–16. Shorthand award lists retain the
// source's grouping and wording rather than inventing additional designations.
export type AwardGroup = {
  id: string;
  name: string;
  icon: string;
  awards: readonly string[];
};
export const awardsIntroduction =
  "AEETDS recognises outstanding contributions to agriculture and allied sciences through its Society Awards, presented every year at the Society's conferences. Awards are decided on the basis of the nominee's Academic Performance Indicator (API) score by the Awards Committee.";
export const awardGroups: readonly AwardGroup[] = [
  {
    id: "lifetime",
    name: "Lifetime and Senior",
    icon: "military_tech",
    awards: [
      "Lifetime Achievement Award (minimum age 55 years)",
      "Fellow Award",
      "Eminent Scientist Award",
      "Distinguished Scientist Award",
      "Outstanding Scientist Award",
      "Scientist of the Year Award",
      "Outstanding Achievement Award",
      "Global Scientist Award (Google Scholar i10-index of at least 10)",
    ],
  },
  {
    id: "research",
    name: "Research and Teaching",
    icon: "school",
    awards: [
      "Best Researcher Award",
      "Best Faculty Award",
      "Best Research Project Award",
      "Excellence in Research Award",
      "Best Teacher / Excellence in Teaching Award",
      "Best Academician Award",
      "Emerging Professor Award",
    ],
  },
  {
    id: "discipline",
    name: "Discipline Awards",
    icon: "science",
    awards: [
      "Best Veterinarian, Horticulturist, Floriculturist, Agronomist, Entomologist, Plant Pathologist, Plant Breeder, and Soil and Water Conservationist Awards",
    ],
  },
  {
    id: "extension",
    name: "Extension",
    icon: "agriculture",
    awards: [
      "Excellence in Extension Award",
      "Best Extension Scientist Award",
      "Best KVK Scientist Award",
    ],
  },
  {
    id: "young",
    name: "Young Professionals (below 45 years)",
    icon: "rocket_launch",
    awards: [
      "Young Scientist Award",
      "Young Women Scientist Award (in the disciplines listed)",
      "Young Entomologist, Plant Pathologist, Horticulturist, Agronomist, Biologist, Fisheries Scientist, Biotechnologist, Botanist, Zoologist and Microbiologist Awards",
      "Young Agriculturist Award",
      "Young Achiever Award",
      "Young Professional Award",
      "Young Scientist Associate Award",
      "Researcher Award",
    ],
  },
  {
    id: "students",
    name: "Students and Scholars",
    icon: "menu_book",
    awards: [
      "Best Research Scholar Award",
      "Innovative Young Researcher Award",
      "Best Student of the Year Award (academic record of the last two semesters)",
      "Best Master's Thesis, Best Dissertation and Best Ph.D. Thesis Awards",
    ],
  },
  {
    id: "women",
    name: "Women and Enterprise",
    icon: "business_center",
    awards: [
      "Best Woman Entrepreneur Award",
      "Woman of Excellence Award",
      "Best Entrepreneurship Award",
      "Entrepreneur of the Year Award",
    ],
  },
  {
    id: "environment",
    name: "Environment and Forestry",
    icon: "forest",
    awards: [
      "Best Forest Ranger Award",
      "Best Forestry Research Award",
      "Environmental Protection Research Award",
      "Environmentalist Award",
      "Best Ecologist Award",
    ],
  },
];
export const nominationSteps = [
  "Download the prescribed nomination form, or request it from the Secretary.",
  "Email your bio-data and completed nomination form to secretaryaeetds@gmail.com on or before the last date announced for the year.",
  "Registration for the conference at which the award is presented is compulsory for all nominees.",
  "Do not pay any fee at the time of nomination. Pay the award contribution fee only after you receive written confirmation of your award by email.",
  "For thesis and dissertation awards, send only the abstract, summary, conclusion and links to papers published from the thesis — not the full thesis. This protects your unpublished research.",
] as const;
export const awardFees = [
  { category: "Students", offline: "₹5,000", online: "₹5,000" },
  { category: "Other participants", offline: "₹6,000", online: "₹5,000" },
  { category: "Foreign participants", offline: "US$150", online: "US$150" },
] as const;
export const awardRules = [
  {
    title: "Young Professionals",
    text: "Young award nominees must be below 45 years of age on the last date of nomination.",
  },
  {
    title: "Lifetime Achievement",
    text: "Lifetime Achievement Award: minimum age 55 years.",
  },
  {
    title: "Number of Awards",
    text: "The Society reserves the right to decide the number of awards in each category.",
  },
  {
    title: "Travelling and Daily Allowance",
    text: "No travelling or daily allowance is paid to participants or awardees by the organisers or the Society.",
  },
  {
    title: "Presentation Awards",
    text: "Conference presentation awards (Best Oral and Best Poster) need no application; they are decided by session chairpersons and evaluators during the conference.",
  },
] as const;
export type Awardee = {
  year: string;
  groupId: string;
  award: string;
  name: string;
  institution: string;
};
export const awardees: readonly Awardee[] = [];
export function filterAwardees(
  records: readonly Awardee[],
  year: string,
  group: string,
  query: string,
) {
  const term = query.trim().toLocaleLowerCase();
  return records.filter(
    (record) =>
      (!year || record.year === year) &&
      (!group || record.groupId === group) &&
      (!term ||
        `${record.name} ${record.institution} ${record.award}`
          .toLocaleLowerCase()
          .includes(term)),
  );
}
