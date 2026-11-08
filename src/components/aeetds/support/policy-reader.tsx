"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { policies } from "../../../content/aeetds-support";
import { society } from "../../../content/aeetds";
import { Icon, Action } from "../ui";
export default function PolicyReader() {
  const content = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const [offsets, setOffsets] = useState({
    header: 150,
    nav: 100,
    ready: false,
  });
  const [active, setActive] = useState(policies[0].id);
  const correctedHash = useRef("");
  const fontCorrectedHash = useRef("");
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const header = document.querySelector(".aeetds-header");
    const observer = new ResizeObserver(() =>
      setOffsets({
        header: Math.ceil(header?.getBoundingClientRect().height ?? 150),
        nav: Math.ceil(nav.current?.getBoundingClientRect().height ?? 100),
        ready: true,
      }),
    );
    if (header) observer.observe(header);
    if (nav.current) observer.observe(nav.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let frame = 0;
    let fontFrame = 0;
    let cancelled = false;
    function update() {
      frame = 0;
      const edge = offsets.header + (innerWidth < 1024 ? offsets.nav + 24 : 40);
      const sections = [
        ...(content.current?.querySelectorAll<HTMLElement>(
          "[data-policy-section]",
        ) ?? []),
      ];
      const current =
        sections
          .filter((section) => section.getBoundingClientRect().top <= edge + 8)
          .at(-1) ?? sections[0];
      if (current) setActive(current.id);
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    function followHash() {
      let id = "";
      try {
        id = decodeURIComponent(location.hash.slice(1));
      } catch {}
      const target = [
        ...(content.current?.querySelectorAll<HTMLElement>(
          "[data-policy-section]",
        ) ?? []),
      ].find((section) => section.id === id);
      if (target && offsets.ready && correctedHash.current !== location.hash) {
        target.scrollIntoView({ block: "start" });
        correctedHash.current = location.hash;
      }
      schedule();
    }
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("hashchange", followHash);
    followHash();
    schedule();
    if (offsets.ready) {
      const entryHash = location.hash;
      void document.fonts?.ready.then(() => {
        if (
          cancelled ||
          entryHash !== location.hash ||
          fontCorrectedHash.current === entryHash
        )
          return;
        fontFrame = requestAnimationFrame(() => {
          if (cancelled) return;
          correctedHash.current = "";
          followHash();
          fontCorrectedHash.current = entryHash;
        });
      });
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(fontFrame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("hashchange", followHash);
      cancelAnimationFrame(frame);
    };
  }, [offsets]);
  useEffect(() => {
    const scroller = track.current;
    const selected = scroller?.querySelector<HTMLElement>(
      '[aria-current="location"]',
    );
    if (scroller && selected && innerWidth < 1024) {
      const box = scroller.getBoundingClientRect();
      const item = selected.getBoundingClientRect();
      if (item.left < box.left || item.right > box.right)
        scroller.scrollLeft += item.left - box.left - 8;
    }
  }, [active]);
  return (
    <div
      ref={content}
      className="support-policy-layout"
      style={
        {
          "--support-header-offset": `${offsets.header}px`,
          "--support-policy-nav-height": `${offsets.nav}px`,
        } as CSSProperties
      }
    >
      <aside className="support-policy-sidebar" ref={nav}>
        <div className="support-policy-index">
          <div className="support-policy-index-heading">
            <p>INDEX OF POLICIES</p>
            <span>{policies.length} Articles</span>
          </div>
          <nav ref={track} aria-label="Policy sections">
            {policies.map((policy, index) => (
              <a
                key={policy.id}
                href={`#${policy.id}`}
                aria-current={active === policy.id ? "location" : undefined}
                onClick={() => {
                  correctedHash.current = "";
                  setActive(policy.id);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {policy.title}
                <Icon name="arrow_forward" className="text-[18px]" />
              </a>
            ))}
          </nav>
          <div className="support-policy-note">
            <Icon name="contact_support" />
            <h2>Policy Enquiries</h2>
            <p>
              For questions or requests relating to these policies, contact the
              AEETDS Secretary&apos;s office.
            </p>
            <a href={`mailto:${society.email}`}>{society.email}</a>
          </div>
        </div>
      </aside>
      <div className="support-policy-documents">
        {policies.map((policy, index) => (
          <section
            id={policy.id}
            data-policy-section
            key={policy.id}
            aria-labelledby={`${policy.id}-title`}
            className="support-policy-document"
          >
            <div className="support-policy-title">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2 id={`${policy.id}-title`}>{policy.title}</h2>
            </div>
            <div className="support-policy-copy">
              {policy.paragraphs.map((paragraph, paragraphIndex) => (
                <p
                  key={paragraph}
                  className={
                    policy.highlight === paragraphIndex
                      ? "support-policy-highlight"
                      : undefined
                  }
                >
                  {policy.highlight === paragraphIndex && (
                    <Icon name={policy.icon} className="text-[20px]" />
                  )}
                  <span>
                    {paragraph.includes(society.email) ? (
                      <>
                        {paragraph.split(society.email)[0]}
                        <a href={`mailto:${society.email}`}>{society.email}</a>
                        {paragraph.split(society.email)[1]}
                      </>
                    ) : (
                      paragraph
                    )}
                  </span>
                </p>
              ))}
            </div>
          </section>
        ))}
        <section className="support-policy-cta resource-dark">
          <p className="support-label">AEETDS SECRETARIAT</p>
          <h2>Questions about our policies?</h2>
          <p>
            For questions or requests relating to these policies, contact the
            AEETDS Secretary&apos;s office.
          </p>
          <div>
            <a href={`mailto:${society.email}`}>
              <Icon name="mail" className="text-[20px]" />
              {society.email}
            </a>
            <Action href="/contact" icon="arrow_forward">
              Contact Us
            </Action>
          </div>
        </section>
      </div>
    </div>
  );
}
