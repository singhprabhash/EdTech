"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, useReducer } from "react";
import { slides } from "../../content/aeetds";
import { Icon } from "./ui";

function subscribeMotion(change: () => void) {
  const query = matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", change);
  return () => query.removeEventListener("change", change);
}
const getMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverMotion = () => true;
function subscribeVisibility(change: () => void) {
  document.addEventListener("visibilitychange", change);
  return () => document.removeEventListener("visibilitychange", change);
}
const getHidden = () => document.hidden;
const serverHidden = () => true;

export default function HeroSlideshow() {
  const [{ active, seen }, setSlide] = useReducer(
    (
      state: { active: number; seen: number[] },
      action: { index?: number; delta?: number },
    ) => {
      const active =
        action.index ??
        (state.active + (action.delta ?? 0) + slides.length) % slides.length;
      return {
        active,
        seen: state.seen.includes(active)
          ? state.seen
          : [...state.seen, active],
      };
    },
    { active: 0, seen: [0] },
  );
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    getHidden,
    serverHidden,
  );
  const reduced = useSyncExternalStore(
    subscribeMotion,
    getMotion,
    serverMotion,
  );
  const autoplay = playing && !reduced && !hovered && !focused && !hidden;
  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => setSlide({ delta: 1 }), 5000);
    return () => clearInterval(timer);
  }, [autoplay]);
  function move(delta: number) {
    setSlide({ delta });
  }
  return (
    <section
      aria-label="AEETDS conference photographs"
      aria-roledescription="carousel"
      className="min-w-0 lg:col-span-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      <div className="aeetds-slide-frame relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-primary shadow-xl sm:aspect-[16/10] lg:aspect-[1/1.05]">
        {slides.map((slide, index) => (
          <div
            key={slide.image}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-hidden={index !== active}
            inert={index !== active}
            className={`aeetds-slide absolute inset-0 transition-opacity duration-700 ${active === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            {seen.includes(index) && (
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(min-width: 1440px) 520px, (min-width: 1024px) 42vw, (min-width: 640px) 90vw, 100vw"
                preload={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <p className="font-label-mono-isbn text-[11px] uppercase tracking-wider text-tertiary-fixed-dim">
                {slide.label}
              </p>
              <h2 className="mt-1 font-headline-sm text-headline-sm leading-tight">
                {slide.caption}
              </h2>
              <p className="mt-2 text-body-sm text-surface-variant">
                {slide.detail}
              </p>
            </div>
          </div>
        ))}
        <div className="absolute top-4 right-4 flex items-center gap-2 rounded bg-primary-container/90 px-3 py-2 text-white">
          <Icon
            name="photo_library"
            className="text-[16px] text-tertiary-fixed-dim"
          />
          <span
            className="text-[11px] font-semibold"
            aria-live={autoplay ? "off" : "polite"}
            aria-atomic="true"
          >
            {active + 1} / {slides.length}
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div
          className="flex items-center"
          aria-label="Choose conference photograph"
        >
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.image}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={active === index}
              onClick={() => setSlide({ index })}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span
                className={`h-1.5 rounded transition-all ${active === index ? "w-8 bg-secondary" : "w-4 bg-outline-variant"}`}
              />
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            className="aeetds-slide-button"
            aria-label="Previous slide"
            onClick={() => move(-1)}
          >
            <Icon name="chevron_left" className="text-[20px]" />
          </button>
          <button
            type="button"
            className="aeetds-slide-button"
            aria-label={
              playing && !reduced ? "Pause slideshow" : "Play slideshow"
            }
            aria-pressed={!playing || reduced}
            disabled={reduced}
            title={
              reduced
                ? "Autoplay disabled by reduced motion preference"
                : undefined
            }
            onClick={() => setPlaying(!playing)}
          >
            <Icon
              name={playing && !reduced ? "pause" : "play_arrow"}
              className="text-[18px]"
            />
          </button>
          <button
            type="button"
            className="aeetds-slide-button"
            aria-label="Next slide"
            onClick={() => move(1)}
          >
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
