import type { ReactNode } from "react";
import SiteHeader from "../../components/aeetds/site-header";
import NewsTicker from "../../components/aeetds/news-ticker";
import SiteFooter from "../../components/aeetds/site-footer";
import "../aeetds.css";
import "./events.css";
export default function EventsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="aeetds-page aeetds-events">
      <SiteHeader activePath="/events" />
      <main id="main" tabIndex={-1}>
        <NewsTicker />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
