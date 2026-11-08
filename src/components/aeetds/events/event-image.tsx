"use client";
import Image from "next/image";
import { useState } from "react";
import type { EventPhoto } from "../../../content/aeetds-events";
import { Icon } from "../ui";
export default function EventImage({
  photo,
  priority = false,
  className = "",
}: {
  photo?: EventPhoto;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`events-image ${className}`}>
      {photo && !failed ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 900px"
          priority={priority}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="events-image-placeholder">
          <Icon name="landscape" className="text-[40px]" />
          <p>
            {photo
              ? "Photograph unavailable"
              : "Conference photograph to be announced"}
          </p>
          {photo && <p className="text-body-sm">{photo.caption}</p>}
        </div>
      )}
    </div>
  );
}
