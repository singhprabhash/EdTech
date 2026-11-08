"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { navigation, society } from "../../content/aeetds";
import { Icon } from "./ui";

export default function SiteHeader({
  activePath = "/",
}: {
  activePath?: string;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) menu.current?.querySelector<HTMLAnchorElement>("a")?.focus();
  }, [open]);
  useEffect(() => {
    const wide = matchMedia("(min-width: 1280px)");
    const close = () => {
      if (wide.matches) setOpen(false);
    };
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, []);
  function closeMenu(restore = false) {
    setOpen(false);
    if (restore) trigger.current?.focus();
  }
  return (
    <header
      className="aeetds-header sticky top-0 z-50 shadow-sm"
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.preventDefault();
          closeMenu(true);
        }
      }}
    >
      <div className="bg-primary-dark text-surface border-b border-primary-container">
        <div className="aeetds-container aeetds-utility flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 text-[11px] leading-[18px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-primary-fixed-dim">
            <a
              href={`mailto:${society.email}`}
              className="inline-flex items-center gap-1 hover:text-white"
            >
              <Icon
                name="mail"
                className="text-[14px] text-tertiary-fixed-dim"
              />
              {society.email}
            </a>
            <div className="aeetds-phones flex flex-wrap gap-x-2">
              <Icon
                name="call"
                className="text-[14px] text-tertiary-fixed-dim"
              />
              {society.phones.map((phone, index) => (
                <span key={phone}>
                  {index > 0 && <span aria-hidden="true">, </span>}
                  <a
                    href={`tel:${phone.replaceAll("-", "")}`}
                    className="hover:text-white"
                  >
                    {phone}
                  </a>
                </span>
              ))}
            </div>
            <span className="aeetds-reg tracking-wider">
              REG NO: {society.registration}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-semibold">
            <Link
              prefetch={false}
              href="/membership/apply"
              className="py-1 text-primary-fixed-dim hover:text-white"
            >
              Become a Member
            </Link>
            <span aria-hidden="true" className="text-on-primary-container">
              |
            </span>
            <Link
              prefetch={false}
              href="/submit/registration"
              className="rounded bg-primary px-2 py-1 text-white hover:bg-primary-dark"
            >
              Register for CRAFNS-2026
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-outline-variant/30 bg-white">
        <div className="aeetds-container aeetds-masthead flex min-h-20 items-center justify-between gap-5 py-3">
          <Link
            prefetch={false}
            href="/"
            className="aeetds-brand flex min-w-0 items-center gap-3"
          >
            <Image
              src="/aeetds/logo.png"
              alt=""
              width={60}
              height={55}
              className="h-auto w-12 shrink-0"
            />
            <span className="min-w-0">
              <span className="block font-headline-sm text-headline-sm font-semibold leading-none text-primary">
                AEETDS
              </span>
              <span className="aeetds-brand-name mt-1 block text-[11px] leading-4 text-on-surface-variant">
                {society.name} • Lucknow
              </span>
            </span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="aeetds-desktop-nav self-stretch items-center gap-5 text-[13px] font-semibold"
          >
            {navigation.map((item) => (
              <Link
                prefetch={false}
                key={item.href}
                href={item.href}
                aria-current={item.href === activePath ? "page" : undefined}
                className={`flex h-full items-center whitespace-nowrap border-b-2 transition-colors ${item.href === activePath ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            ref={trigger}
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="aeetds-mobile-menu"
            onClick={() => (open ? closeMenu(true) : setOpen(true))}
            className="aeetds-menu-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded bg-surface-container-low text-primary"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
        <nav
          ref={menu}
          id="aeetds-mobile-menu"
          hidden={!open}
          aria-label="Mobile navigation"
          className="aeetds-mobile-nav"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeMenu(true);
            }
          }}
        >
          <div className="aeetds-container grid gap-1 py-3 sm:grid-cols-2">
            {navigation.map((item) => (
              <Link
                prefetch={false}
                key={item.href}
                href={item.href}
                onClick={() => closeMenu()}
                aria-current={item.href === activePath ? "page" : undefined}
                className={`rounded px-3 py-3 text-title-sm hover:bg-surface-container-low ${item.href === activePath ? "bg-surface-container text-primary" : "text-primary"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
