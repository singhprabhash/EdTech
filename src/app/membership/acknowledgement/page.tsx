import { pageMetadata } from "../../../config/seo";
import type { Metadata } from "next";
import MembershipBreadcrumb from "../../../components/aeetds/membership/breadcrumb";
import MembershipAcknowledgementScreen from "../../../components/aeetds/membership/acknowledgement";
export const metadata: Metadata = pageMetadata(
  "/membership/acknowledgement",
  "Membership Acknowledgement | AEETDS",
  "View the confirmed membership application receipt when available, or the pending integration preview.",
);
export default function MembershipAcknowledgementPage() {
  return (
    <>
      <MembershipBreadcrumb current="Acknowledgement" />
      <MembershipAcknowledgementScreen />
    </>
  );
}
