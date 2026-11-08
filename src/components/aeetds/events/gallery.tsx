"use client";
import { useSiteContent } from "../site-content";
import { useEffect, useRef, useState } from "react";
import type { EventPhoto } from "../../../content/aeetds-events";
import { Eyebrow, Icon } from "../ui";
import EventImage from "./event-image";
export default function EventGallery({
  photos: providedPhotos,
  eventName,
  eventSlug,
  title = "Conference Photographic Gallery",
}: {
  photos: readonly EventPhoto[];
  eventName: string;
  eventSlug?: string;
  title?: string;
}) {
  const gallery = useSiteContent().gallery;
  const photos =
    eventSlug && gallery
      ? gallery.filter((photo) => photo.eventSlug === eventSlug)
      : providedPhotos;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const closeControl = useRef<HTMLButtonElement>(null);
  const nextControl = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  if (!photos.length) return null;
  const current = photos[index];
  function close() {
    dialog.current?.close();
  }
  function advance(direction: number) {
    setIndex((value) => (value + direction + photos.length) % photos.length);
  }
  return (
    <section
      id="conference-gallery"
      className="events-section bg-surface-container-low/40"
      aria-labelledby="event-gallery-title"
    >
      <div className="aeetds-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Eyebrow>CONFERENCE IMAGE RECORD</Eyebrow>
            <h2 id="event-gallery-title" className="events-heading">
              {title}
            </h2>
          </div>
          <p className="text-body-sm text-on-surface-variant">
            {photos.length} photographs · Select to enlarge
          </p>
        </div>
        <ul
          className={`events-gallery-grid ${photos.length === 3 ? "events-gallery-three" : ""}`}
          aria-label={`${eventName} photographs`}
        >
          {photos.map((photo, photoIndex) => (
            <li key={photo.src}>
              <figure>
                <button
                  type="button"
                  aria-label={`Enlarge photograph ${photoIndex + 1}: ${photo.caption}`}
                  onClick={(event) => {
                    trigger.current = event.currentTarget;
                    setIndex(photoIndex);
                    dialog.current?.showModal();
                    setOpen(true);
                  }}
                  className="events-gallery-button"
                >
                  <EventImage photo={photo} />
                  <span className="events-enlarge">
                    <Icon name="zoom_in" className="text-[22px]" />
                  </span>
                </button>
                <figcaption className="mt-3 text-body-sm leading-relaxed text-on-surface-variant">
                  {photo.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <dialog
          ref={dialog}
          aria-label={`${eventName} photograph viewer`}
          className="events-lightbox"
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              if (
                event.shiftKey &&
                document.activeElement === closeControl.current
              ) {
                event.preventDefault();
                nextControl.current?.focus();
              } else if (
                !event.shiftKey &&
                document.activeElement === nextControl.current
              ) {
                event.preventDefault();
                closeControl.current?.focus();
              }
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              advance(-1);
            }
            if (event.key === "ArrowRight") {
              event.preventDefault();
              advance(1);
            }
          }}
        >
          <div className="events-lightbox-header">
            <h3 className="font-headline-sm text-headline-sm">
              {eventName} · Photographs
            </h3>
            <button
              type="button"
              aria-label="Close photograph viewer"
              ref={closeControl}
              className="events-gallery-control"
              onClick={close}
            >
              <Icon name="close" />
            </button>
          </div>
          <figure>
            <EventImage key={current.src} photo={current} priority />
            <figcaption className="mt-4 text-body-md leading-relaxed">
              {current.caption}
            </figcaption>
          </figure>
          <div className="events-lightbox-actions">
            <button
              type="button"
              aria-label="Previous photograph"
              className="events-gallery-control"
              onClick={() => advance(-1)}
            >
              <Icon name="arrow_back" />
            </button>
            <p role="status" aria-live="polite">
              Photograph {index + 1} of {photos.length}
            </p>
            <button
              type="button"
              aria-label="Next photograph"
              ref={nextControl}
              className="events-gallery-control"
              onClick={() => advance(1)}
            >
              <Icon name="arrow_forward" />
            </button>
          </div>
        </dialog>
      </div>
    </section>
  );
}
