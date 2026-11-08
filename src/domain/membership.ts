import { isPlainMailbox } from "../shared/email.mjs";
export const publicCategories = [
  "Life",
  "Annual",
  "Student",
  "Institutional",
  "Corporate",
] as const;
export type MembershipCategory = (typeof publicCategories)[number];
export type MembershipValues = {
  category: string;
  designation: string;
  institution: string;
  discipline: string;
  otherDiscipline: string;
  qualification: string;
  otherQualification: string;
  title: string;
  fullName: string;
  address: string;
  postalCode: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  nationality: string;
  otherNationality: string;
  utr: string;
  paymentDate: string;
  declaration: boolean;
};
export type DocumentKind = "photo" | "studentProof" | "receipt";
export type MembershipDocuments = Record<DocumentKind, File | null>;
export type MembershipField = keyof MembershipValues | DocumentKind;
export type MembershipErrors = Partial<Record<MembershipField, string>>;
export const emptyMembershipValues: MembershipValues = {
  category: "",
  designation: "",
  institution: "",
  discipline: "",
  otherDiscipline: "",
  qualification: "",
  otherQualification: "",
  title: "",
  fullName: "",
  address: "",
  postalCode: "",
  email: "",
  mobile: "",
  dateOfBirth: "",
  nationality: "",
  otherNationality: "",
  utr: "",
  paymentDate: "",
  declaration: false,
};
export const emptyMembershipDocuments: MembershipDocuments = {
  photo: null,
  studentProof: null,
  receipt: null,
};

export const documentRules = {
  photo: {
    label: "Passport-size photograph",
    accept: ".jpg,.jpeg,.png",
    formats: "JPG/PNG",
    megabytes: 1,
  },
  studentProof: {
    label: "Student ID / enrolment proof",
    accept: ".pdf,.jpg,.jpeg",
    formats: "PDF/JPG",
    megabytes: 2,
  },
  receipt: {
    label: "Payment receipt",
    accept: ".pdf,.jpg,.jpeg",
    formats: "PDF/JPG",
    megabytes: 2,
  },
} as const;
export function validateDocument(
  kind: DocumentKind,
  file: File,
): string | undefined {
  const rule = documentRules[kind];
  const extension = file.name.toLowerCase().split(".").pop();
  const expected =
    extension === "jpg" || extension === "jpeg"
      ? "image/jpeg"
      : extension === "png" && kind === "photo"
        ? "image/png"
        : extension === "pdf" && kind !== "photo"
          ? "application/pdf"
          : undefined;
  if (!expected || file.type !== expected)
    return `Choose a ${rule.formats} file.`;
  if (file.size === 0) return "The file is empty. Choose another file.";
  if (file.size > rule.megabytes * 1024 * 1024)
    return `The file must be ${rule.megabytes} MB or smaller.`;
}
export const membershipSteps = [
  "Membership Details",
  "Personal and Professional Details",
  "Documents",
  "Payment Details",
  "Declaration and Review",
] as const;
export const stepFields: readonly (readonly MembershipField[])[] = [
  [
    "category",
    "designation",
    "institution",
    "discipline",
    "otherDiscipline",
    "qualification",
    "otherQualification",
  ],
  [
    "title",
    "fullName",
    "address",
    "postalCode",
    "email",
    "mobile",
    "dateOfBirth",
    "nationality",
    "otherNationality",
  ],
  ["photo", "studentProof"],
  ["utr", "paymentDate", "receipt"],
  ["declaration"],
];
export function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function validPastDate(value: string, today: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > today) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function validateMembershipStep(
  step: number,
  values: MembershipValues,
  files: MembershipDocuments,
  today = localDate(),
): MembershipErrors {
  const errors: MembershipErrors = {};
  const requireText = (key: keyof MembershipValues, label: string) => {
    if (!String(values[key]).trim()) errors[key] = `${label} is required.`;
    else if (String(values[key]).length > (key === "address" ? 2000 : 250))
      errors[key] = `${label} is too long.`;
  };
  const requireFile = (kind: DocumentKind) => {
    const file = files[kind];
    const error = file
      ? validateDocument(kind, file)
      : `${documentRules[kind].label} is required.`;
    if (error) errors[kind] = error;
  };
  if (step === 0) {
    if (!(publicCategories as readonly string[]).includes(values.category))
      errors.category = "Select a membership category.";
    requireText("designation", "Designation");
    requireText("institution", "Institution / organisation");
    requireText("discipline", "Discipline / specialisation");
    requireText("qualification", "Highest qualification");
    if (values.discipline === "Other")
      requireText("otherDiscipline", "Other discipline / specialisation");
    if (values.qualification === "Other")
      requireText("otherQualification", "Other qualification");
  }
  if (step === 1) {
    if (!["Dr.", "Prof.", "Mr.", "Ms."].includes(values.title))
      errors.title = "Select your title.";
    for (const [key, label] of [
      ["fullName", "Full name"],
      ["address", "Postal address"],
      ["postalCode", "PIN / postal code"],
      ["email", "Email"],
      ["mobile", "Mobile (WhatsApp)"],
      ["nationality", "Nationality"],
    ] as const)
      requireText(key, label);
    if (values.email && !isPlainMailbox(values.email))
      errors.email = "Enter a valid email address.";
    const digits = values.mobile.replace(/[\s()+.-]/g, "");
    if (values.mobile && !/^\d{8,15}$/.test(digits))
      errors.mobile = "Enter a valid mobile number, including country code.";
    if (!validPastDate(values.dateOfBirth, today))
      errors.dateOfBirth =
        "Enter a valid date of birth that is not in the future.";
    if (values.nationality === "Other")
      requireText("otherNationality", "Nationality details");
  }
  if (step === 2) {
    requireFile("photo");
    if (values.category === "Student") requireFile("studentProof");
  }
  if (step === 3) {
    requireText("utr", "Payment transaction (UTR) number");
    if (!validPastDate(values.paymentDate, today))
      errors.paymentDate =
        "Enter a valid payment date that is not in the future.";
    requireFile("receipt");
  }
  if (step === 4 && !values.declaration)
    errors.declaration = "Please agree to the declaration before submitting.";
  return errors;
}
