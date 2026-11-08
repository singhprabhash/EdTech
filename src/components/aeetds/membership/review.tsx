import {
  type MembershipValues,
  type MembershipDocuments,
} from "../../../domain/membership";
export default function MembershipReview({
  values,
  documents,
  edit,
}: {
  values: MembershipValues;
  documents: MembershipDocuments;
  edit: (step: number) => void;
}) {
  const groups = [
    {
      title: "Membership and professional information",
      step: 0,
      items: [
        ["Category", values.category],
        ["Designation", values.designation],
        ["Institution / organisation", values.institution],
        [
          "Discipline / specialisation",
          values.discipline === "Other"
            ? values.otherDiscipline
            : values.discipline,
        ],
        [
          "Highest qualification",
          values.qualification === "Other"
            ? values.otherQualification
            : values.qualification,
        ],
      ],
    },
    {
      title: "Personal information",
      step: 1,
      items: [
        ["Full name", `${values.title} ${values.fullName}`],
        ["Email", values.email],
        ["Mobile (WhatsApp)", values.mobile],
        ["Date of birth", values.dateOfBirth],
        [
          "Nationality",
          values.nationality === "Other"
            ? values.otherNationality
            : values.nationality,
        ],
        ["Postal address", values.address],
        ["PIN / postal code", values.postalCode],
      ],
    },
    {
      title: "Documents",
      step: 2,
      items: [
        ["Passport-size photograph", documents.photo?.name ?? "Not selected"],
        ...(values.category === "Student"
          ? [
              [
                "Student ID / enrolment proof",
                documents.studentProof?.name ?? "Not selected",
              ],
            ]
          : []),
      ],
    },
    {
      title: "Payment details",
      step: 3,
      items: [
        ["Payment transaction (UTR) number", values.utr],
        ["Payment date", values.paymentDate],
        ["Payment receipt", documents.receipt?.name ?? "Not selected"],
      ],
    },
  ];
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section key={group.title} className="membership-review-group">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{group.title}</h3>
            <button
              type="button"
              className="membership-text-button"
              onClick={() => edit(group.step)}
              aria-label={`Edit ${group.title.toLowerCase()}`}
            >
              Edit
            </button>
          </div>
          <dl className="space-y-3">
            {group.items.map(([label, value]) => (
              <div key={label} className="membership-review-row">
                <dt className="text-on-surface-variant">{label}</dt>
                <dd className="whitespace-pre-wrap font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
