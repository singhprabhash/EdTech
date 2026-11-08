import { pageMetadata } from "../../config/seo";
import type { Metadata } from "next";
import MembershipOverview from "../../components/aeetds/membership/overview";
export const metadata: Metadata = pageMetadata(
  "/membership",
  "Membership | AEETDS",
  "Explore AEETDS membership categories, benefits and the application process for individuals and institutions in India and abroad.",
);
export default function MembershipPage() {
  return <MembershipOverview />;
}
