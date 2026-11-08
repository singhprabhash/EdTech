import { society } from "../../../content/aeetds";
import { policies } from "../../../content/aeetds-support";
import { SupportBreadcrumb, SupportLabel } from "./shared";
import PolicyReader from "./policy-reader";
export default function PoliciesPageContent() {
  return (
    <>
      <SupportBreadcrumb title="Policies" />
      <section
        className="support-policy-hero"
        aria-labelledby="support-page-title"
      >
        <SupportLabel>SOCIETY WEBSITE POLICIES</SupportLabel>
        <h1 id="support-page-title" className="support-page-title">
          Policies
        </h1>
        <p className="support-introduction">
          Please review the policies governing the use of the AEETDS website,
          personal information, registrations and scholarly publications.
        </p>
        <dl className="support-policy-facts">
          {[
            { label: "SOCIETY REGISTRATION", value: society.registration },
            { label: "LOCATION", value: "Lucknow, India" },
            { label: "EDITED-VOLUME SIMILARITY", value: "Less than 10%" },
            { label: "POLICY SECTIONS", value: `${policies.length} Articles` },
          ].map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <PolicyReader />
    </>
  );
}
