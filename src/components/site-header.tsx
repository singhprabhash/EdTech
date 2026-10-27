"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, site } from "../config/site";
import Brand from "./brand";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    // Close if a mobile menu is open when the viewport becomes desktop.
    const desktop = window.matchMedia?.("(min-width: 64rem)");
    const handleResize = () => {
      if (desktop?.matches) setOpen(false);
    };
    desktop?.addEventListener("change", handleResize);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktop?.removeEventListener("change", handleResize);
    };
  }, [open]);

  const links = navigation.map(({ href, label }) => (
    <Link
      key={href}
      href={href}
      aria-current={pathname === href ? "page" : undefined}
      onClick={() => setOpen(false)}
    >
      {label}
    </Link>
  ));

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="site-container utility-inner">
          <span>
            Academic publishing{" "}
            <span className="utility-location">· {site.location}</span>
          </span>
          <a href={`tel:${site.telephone}`}>{site.telephoneLabel}</a>
          <a className="utility-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>
      <div className="masthead">
        <div className="site-container masthead-inner">
          <Brand />
          <nav className="desktop-navigation" aria-label="Main navigation">
            {links}
          </nav>
          <Link
            className="button button-primary header-cta"
            href="/publish-with-us"
          >
            Publishing enquiries <span aria-hidden="true">↗</span>
          </Link>
          <button
            className="menu-toggle"
            ref={trigger}
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            <span aria-hidden="true">{open ? "✕" : "☰"}</span>
          </button>
        </div>
        <nav
          id="mobile-navigation"
          className="mobile-navigation"
          aria-label="Mobile navigation"
          hidden={!open}
        >
          <div className="site-container">{links}</div>
        </nav>
      </div>
    </header>
  );
}
