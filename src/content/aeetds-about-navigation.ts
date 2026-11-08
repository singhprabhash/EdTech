export const aboutNavigation = [
  { label: "About the Society", href: "/about" },
  { label: "Vision, Mission and Objectives", href: "/about/vision-mission" },
  { label: "Governance", href: "/about/governance" },
  { label: "Partners and Collaborators", href: "/about/partners" },
] as const;
export type AboutPath = (typeof aboutNavigation)[number]["href"];
