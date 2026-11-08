import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import MembershipBreadcrumb from "../../../components/aeetds/membership/breadcrumb";
import MembershipApplicationForm from "../../../components/aeetds/membership/application-form";
import { publicCategories } from "../../../domain/membership";
import { Eyebrow } from "../../../components/aeetds/ui";
export const metadata: Metadata = pageMetadata(
  "/membership/apply",
  "Membership Application | AEETDS",
  "Prepare and review your AEETDS membership application. Online submission is pending integration.",
);
export default async function MembershipApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const query = await searchParams;
  const category =
    typeof query.category === "string" &&
    (publicCategories as readonly string[]).includes(query.category)
      ? query.category
      : "";
  return (
    <>
      <MembershipBreadcrumb current="Application" />
      <section className="membership-section bg-background">
        <div className="aeetds-container">
          <Eyebrow>MEMBERSHIP APPLICATION</Eyebrow>
          <h1 className="membership-heading mb-3">Apply for Membership</h1>
          <p className="max-w-3xl text-on-surface-variant">
            Complete your membership details, personal information, documents
            and payment reference, then review your application.
          </p>
          <p className="membership-note mt-5 max-w-3xl">
            Online submission is not yet available. You can prepare and review
            the form, but it will not send an application.
          </p>
        </div>
      </section>
      <MembershipApplicationForm initialCategory={category} />
    </>
  );
}
