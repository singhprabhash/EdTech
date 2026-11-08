import { collaborators } from "./aeetds";

export const partnersIntroduction =
  "AEETDS works with leading national institutions to organise its conferences and programmes. Our collaborators so far include:";
export const collaborationInvitation =
  "Institutions interested in collaborating with AEETDS on conferences, training or research can write to the Secretary.";

// PDF page 21 adds acronyms to the same institutional identities already used
// on the homepage. Derive names/locations instead of maintaining a second list.
const acronyms: Readonly<Record<string, string>> = {
  "ICAR-Indian Institute of Sugarcane Research": "IISR",
  "ICAR-National Academy of Agricultural Research Management": "NAARM",
  "ICAR-Central Agroforestry Research Institute": "CAFRI",
  "Indian Society of Agroforestry": "ISAF",
  "Uttar Pradesh Council of Agricultural Research": "UPCAR",
  "ICAR-Indian Institute of Seed Science": "IISS",
  "CSIR-National Botanical Research Institute": "NBRI",
};
export const partnerDirectory = collaborators.map((partner) => ({
  name: acronyms[partner.name]
    ? `${partner.name} (${acronyms[partner.name]})`
    : partner.name,
  city: partner.location.split(",")[0],
  location: partner.location,
  acronym: acronyms[partner.name],
  icon: partner.icon,
  designation:
    partner.category === "PUBLISHING PARTNER"
      ? "Publishing Partner"
      : undefined,
}));
