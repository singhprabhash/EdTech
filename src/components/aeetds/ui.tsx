import Link from "next/link";
import type { ReactNode } from "react";

export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
    >
      {name}
    </span>
  );
}

export function Action({
  href,
  children,
  icon,
  tone = "blue",
  download,
}: {
  href: string;
  download?: string;
  children: ReactNode;
  icon?: string;
  tone?: "blue" | "navy" | "light" | "text";
}) {
  const tones = {
    blue: "bg-primary text-on-primary hover:bg-primary-dark shadow-sm",
    navy: "bg-primary text-on-primary hover:bg-primary-dark",
    light:
      "bg-surface-container-lowest text-primary hover:bg-surface-container shadow-sm",
    text: "text-secondary hover:underline",
  };
  return (
    <Link
      prefetch={false}
      href={href}
      download={download}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded px-5 py-3 text-title-sm font-title-sm transition-colors ${tones[tone]}`}
    >
      {icon && <Icon name={icon} className="text-[20px]" />}
      {children}
    </Link>
  );
}

export function Eyebrow({
  children,
  icon,
  dark = false,
}: {
  children: ReactNode;
  icon?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`mb-2 flex items-center gap-2 font-label-mono-isbn text-[12px] uppercase tracking-wider ${dark ? "text-tertiary-fixed-dim" : "text-secondary"}`}
    >
      {icon && <Icon name={icon} className="text-[16px]" />}
      {children}
    </div>
  );
}
