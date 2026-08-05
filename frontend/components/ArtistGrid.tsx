import type { ArtistEntry } from "@/lib/wordpress";
import ArtistCard from "./ArtistCard";

export default function ArtistGrid({ artists }: { artists: ArtistEntry[] }) {
  if (artists.length === 0) {
    return <p className="artist-grid__empty">No artists yet — check back soon.</p>;
  }

  return (
    <div className="artist-grid">
      {artists.map((artist, index) => (
        <ArtistCard key={`${artist.name}-${index}`} artist={artist} />
      ))}
    </div>
  );
}
