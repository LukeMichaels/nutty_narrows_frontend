import type { LocationEntry } from "@/lib/wordpress";
import LocationCard from "./LocationCard";

export default function LocationList({ locations }: { locations: LocationEntry[] }) {
  if (locations.length === 0) {
    return <p className="location-list__empty">No locations listed yet — check back soon.</p>;
  }

  return (
    <div className="location-list">
      {locations.map((location, index) => (
        <LocationCard
          key={`${location.title}-${index}`}
          location={location}
          preload={index === 0}
        />
      ))}
    </div>
  );
}
