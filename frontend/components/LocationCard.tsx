import type { LocationEntry } from "@/lib/wordpress";

export default function LocationCard({ location }: { location: LocationEntry }) {
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="location-card__photo"
          src={location.image.node.sourceUrl}
          alt={location.image.node.altText || location.title || ""}
        />
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
