import type { ReactNode } from "react";
import SiteHeader from "../../components/aeetds/site-header";
import NewsTicker from "../../components/aeetds/news-ticker";
import SiteFooter from "../../components/aeetds/site-footer";
import { MembershipReceiptProvider } from "../../components/aeetds/membership/receipt-context";
import "../aeetds.css";
import "./membership.css";
export default function MembershipLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="aeetds-page aeetds-membership">
      <SiteHeader activePath="/membership" />
      <main id="main" tabIndex={-1}>
        <NewsTicker />
        <MembershipReceiptProvider>{children}</MembershipReceiptProvider>
      </main>
      <SiteFooter />
    </div>
  );
}
