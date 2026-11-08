import type { ReactNode } from "react";
import type { AboutPath } from "../../../content/aeetds-about-navigation";
import SiteHeader from "../site-header";
import NewsTicker from "../news-ticker";
import SiteFooter from "../site-footer";
import AboutSubNavigation from "./sub-navigation";
import "../../../app/aeetds.css";
import "../../../app/about/section.css";

export default function AboutLayout({
  currentPath,
  pageClassName,
  children,
}: {
  currentPath: AboutPath;
  pageClassName: string;
  children: ReactNode;
}) {
  return (
    <div className={`aeetds-page aeetds-about-section ${pageClassName}`}>
      <SiteHeader activePath="/about" />
      <main id="main" tabIndex={-1}>
        <NewsTicker />
        <AboutSubNavigation currentPath={currentPath} />
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
