import Image from "next/image";
import type { LocationEntry } from "@/lib/wordpress";

export default function LocationCard({
  location,
  // First card carries the page's likely LCP image — preload it, lazy-load
  // the rest. Set by LocationList.
  preload = false,
}: {
  location: LocationEntry;
  preload?: boolean;
}) {
  // No dedicated map field on the backend (that'd need a Google Maps API
  // key configured in ACF) — a plain "get directions" link built from the
  // address text gets most of the benefit without that setup cost.
  const directionsHref = location.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        location.address
      )}`
    : null;

  return (
    <article className="location-card">
      {location.image && (
        <div className="location-card__photo">
          <Image
            className="location-card__photo-img"
            src={location.image.node.sourceUrl}
            alt={location.image.node.altText || location.title || ""}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            preload={preload}
          />
        </div>
      )}
      {location.title && <h2 className="location-card__label">{location.title}</h2>}
      {location.address && (
        <address className="location-card__address">{location.address}</address>
      )}
      {location.notes && <p className="location-card__notes">{location.notes}</p>}
      {directionsHref && (
        <a
          className="location-card__directions"
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      )}
    </article>
  );
}
