export const guidelinesSections = [
  { id: "abstract", label: "Abstract Protocol", icon: "description" },
  { id: "extended-summary", label: "Extended Summary", icon: "article" },
  { id: "oral", label: "Oral Presentation", icon: "slideshow" },
  { id: "poster", label: "Poster Presentation", icon: "dashboard" },
  { id: "checklist", label: "Author Checklist", icon: "fact_check" },
] as const;
export const abstractSpecifications = [
  { label: "Length", value: "150–250 words" },
  { label: "Keywords", value: "4–6 keywords" },
  {
    label: "Font and spacing",
    value: "Times New Roman, 12 pt, single spacing",
  },
  { label: "Title", value: "14 pt bold" },
  {
    label: "Authors and affiliations",
    value: "Author names, affiliations and corresponding email in 12 pt",
  },
  {
    label: "Conference theme",
    value: "Mention the theme under which the abstract is submitted",
  },
  { label: "File format", value: "MS Word (.doc or .docx)" },
  { label: "File name", value: "FirstAuthorSurname_Theme.docx" },
] as const;
export const summarySpecifications = [
  "Not more than 1,000 words, excluding one illustration and references.",
  "Times New Roman: title 14 pt bold; author names 12 pt; institute name 11 pt italic; text 11 pt.",
  "Give each author's name, email and place of work (university or organisation, state, PIN code and country). If an author's current address differs, give it as a footnote.",
  "Start with a short introduction and objectives (no heading), followed by METHODOLOGY, RESULTS, CONCLUSION and REFERENCES (maximum two), with headings in capital letters.",
  "Include exactly one illustration (figure or table).",
  "Summaries that do not follow this format will not be accepted for publication.",
] as const;
export const oralSpecifications = [
  {
    title: "Duration & Discussion",
    text: "Time and format follow the conference brochure (typically 7–12 minutes including discussion).",
  },
  {
    title: "Slide Format & Count",
    text: "MS PowerPoint only, 16:9 slide size; 7–10 slides including a summary slide.",
  },
  {
    title: "Required Logos",
    text: "Every slide carries the AEETDS logo, the host institution's logo and your own institution's logo.",
  },
  {
    title: "Text & Graphs",
    text: "Not more than 12 lines of text or 4 graph curves per slide; minimum 18 pt font; label all axes, units and legends.",
  },
  {
    title: "Contrast & Session Timing",
    text: "Avoid dark text on dark backgrounds or light text on light backgrounds. Session chairs strictly enforce the time.",
  },
] as const;
export const posterSpecifications = [
  {
    label: "Sheet and orientation",
    value:
      "Single sheet, portrait, 90 cm wide × 120 cm high, that can be rolled for transport",
  },
  {
    label: "Header",
    value:
      "Title exactly as in the accepted abstract, authors, affiliations, presenter's email and Abstract ID at the top-right",
  },
  {
    label: "Author identification",
    value:
      "Underline the presenter's name and mark the corresponding author with an asterisk (*)",
  },
  {
    label: "Logos and photograph",
    value:
      "AEETDS and host institution logos at top-left; presenter passport-size photograph near the Abstract ID",
  },
  {
    label: "Body layout",
    value:
      "Two columns: Introduction, Materials and Methods, Results and Discussion, Conclusions",
  },
  { label: "Footer", value: "References and acknowledgements" },
  { label: "Font family", value: "Times New Roman throughout" },
  { label: "Title font", value: "72 pt" },
  {
    label: "Author and section fonts",
    value: "Author names 28 pt; section headings 28 pt",
  },
  { label: "Body font", value: "24 pt" },
  { label: "Figure and table fonts", value: "20–24 pt" },
  {
    label: "Figures and margins",
    value:
      "Graphs are preferred to tables. Keep the poster uncluttered with clear margins",
  },
] as const;
export const posterMounting =
  "Mount the poster at your assigned session and remove it immediately afterwards.";
export const authorChecklist = [
  "My abstract follows the word, keyword, font and Word-file requirements.",
  "I have included the theme, author affiliations, corresponding email and required file name.",
  "If submitting an extended summary, I have checked the 1,000-word limit, headings, one illustration and maximum two references.",
  "Where applicable, my oral slides follow the brochure timing, 16:9 layout, slide count, logo and readability requirements.",
  "Where applicable, my poster follows the 90 × 120 cm portrait layout, identification and typography requirements.",
  "I have checked the conference registration requirements and the relevant instructions before submission.",
] as const;
export {
  registrationIntroduction,
  registrationFeeRows,
  registrationInclusions,
  registrationSteps,
  paymentPolicies,
  registrationPolicyAcknowledgement,
} from "./aeetds-payment";
