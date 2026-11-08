import type { ReactNode } from "react";
import SiteHeader from "../site-header";
import NewsTicker from "../news-ticker";
import SiteFooter from "../site-footer";
import "../../../app/aeetds.css";
import "../../../app/resources.css";
export default function ResourceShell({
  activePath,
  children,
}: {
  activePath: string;
  children: ReactNode;
}) {
  return (
    <div className="aeetds-page aeetds-resources">
      <SiteHeader activePath={activePath} />
      <main id="main" tabIndex={-1}>
        <NewsTicker />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
