import Image from "next/image";
import Link from "next/link";
import { navigation, society } from "../../content/aeetds";
import { Icon } from "./ui";

const portals = [
  { label: "Apply for Membership", href: "/membership/apply" },
  { label: "CRAFNS-2026 Delegate Registration", href: "/submit/registration" },
  { label: "Submit Research Abstract", href: "/submit/guidelines" },
  { label: "Award Nominations", href: "/awards#nomination" },
  { label: "Downloads", href: "/downloads" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-primary-dark pt-14 text-white">
      <div className="aeetds-container">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <Link
              prefetch={false}
              href="/"
              aria-label="AEETDS home"
              className="mb-4 inline-flex items-center gap-3"
            >
              <Image
                src="/aeetds/logo.png"
                alt="AEETDS"
                width={64}
                height={59}
                className="h-auto w-16 rounded bg-white p-1"
              />
              <span className="font-headline-sm text-headline-sm">AEETDS</span>
            </Link>
            <p className="max-w-sm text-title-sm leading-relaxed">
              {society.name}
            </p>
            <p className="mt-4 text-body-sm leading-relaxed text-primary-fixed-dim">
              Registration No. {society.registration}
              <br />
              Societies Registration Act XXI of 1860
              <br />
              {society.location}
            </p>
            <a
              href={`mailto:${society.email}`}
              className="mt-4 inline-flex min-h-11 max-w-full items-center gap-2 text-body-sm text-surface-variant hover:text-white"
            >
              <Icon name="mail" className="shrink-0 text-[18px]" />
              <span className="break-all">{society.email}</span>
            </a>
          </div>
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-title-sm font-semibold">Navigation</h2>
            <ul className="space-y-1 text-body-sm text-primary-fixed-dim">
              {navigation
                .filter((item) => item.href !== "/" && item.href !== "/submit")
                .map((item) => (
                  <li key={item.href}>
                    <Link
                      prefetch={false}
                      href={item.href}
                      className="inline-flex min-h-11 items-center hover:text-white"
                    >
                      {item.label === "About" ? "About Society" : item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-title-sm font-semibold">
              Portals &amp; Submissions
            </h2>
            <ul className="space-y-1 text-body-sm text-primary-fixed-dim">
              {portals.map((item) => (
                <li key={item.href}>
                  <Link
                    prefetch={false}
                    href={item.href}
                    className="inline-flex min-h-11 items-center hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <h2 className="mb-4 text-title-sm font-semibold">
              Publishing Partnership
            </h2>
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded bg-primary-container">
              <Icon name="auto_stories" className="text-tertiary-fixed-dim" />
            </div>
            <p className="text-body-sm leading-relaxed text-primary-fixed-dim">
              EdTech Publications, Lucknow is the Society&apos;s publishing
              partner. AEETDS collaborates with institutions across the ICAR and
              CSIR networks.
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 border-t border-white/15 py-6 text-[11px] leading-relaxed text-primary-fixed-dim md:flex-row">
          <p>
            © 2026 AEETDS Lucknow • Registered under Societies Registration Act
            XXI of 1860 • All Rights Reserved.
          </p>
          <p className="shrink-0">Lucknow, U.P. • India</p>
        </div>
      </div>
    </footer>
  );
}
