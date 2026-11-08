import Link from "next/link";
import type { ReactNode } from "react";
import { ResourceBreadcrumb } from "../resources/shared";
import ResourceShell from "../resources/shell";
import { Action, Icon } from "../ui";
import { society } from "../../../content/aeetds";
import "../../../app/support.css";
export function SupportShell({
  page,
  children,
}: {
  page: "contact" | "faqs" | "policies";
  children: ReactNode;
}) {
  return (
    <ResourceShell activePath={page === "policies" ? "" : "/contact"}>
      <div className={`aeetds-support support-${page}`}>
        <div className="aeetds-container support-content">
          {children}
          <nav aria-label="Contact and information" className="support-related">
            {[
              { id: "contact", href: "/contact", label: "Contact Us" },
              {
                id: "faqs",
                href: "/contact/faqs",
                label: "Frequently Asked Questions",
              },
              { id: "policies", href: "/policies", label: "Policies" },
            ].map((item) => (
              <Link
                key={item.id}
                prefetch={false}
                href={item.href}
                aria-current={page === item.id ? "page" : undefined}
              >
                {item.label}
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </ResourceShell>
  );
}
export function SupportBreadcrumb({
  title,
  contactParent = false,
}: {
  title: string;
  contactParent?: boolean;
}) {
  return (
    <div className="support-breadcrumb">
      <ResourceBreadcrumb
        title={title}
        parent={
          contactParent ? { label: "Contact", href: "/contact" } : undefined
        }
      />
    </div>
  );
}
export function SupportLabel({ children }: { children: ReactNode }) {
  return <p className="support-label">{children}</p>;
}
export function SupportCTA({
  title,
  text,
  dark = false,
  contactLink = false,
}: {
  title: string;
  text: string;
  dark?: boolean;
  contactLink?: boolean;
}) {
  return (
    <section
      className={`support-cta ${dark ? "support-cta-dark resource-dark" : ""}`}
      aria-label={title}
    >
      <div>
        <SupportLabel>AEETDS SECRETARIAT</SupportLabel>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="support-cta-actions">
        {contactLink && (
          <Action
            href="/contact"
            tone={dark ? "light" : "navy"}
            icon="arrow_forward"
          >
            Contact Us
          </Action>
        )}
        <Action
          href={`mailto:${society.email}`}
          tone={dark ? "blue" : "navy"}
          icon="mail"
        >
          Email the Secretary
        </Action>
      </div>
    </section>
  );
}
