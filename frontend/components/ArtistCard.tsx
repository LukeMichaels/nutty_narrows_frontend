import Image from "next/image";
import type { ArtistEntry } from "@/lib/wordpress";

export default function ArtistCard({
  artist,
  // The first card in the grid holds the page's likely LCP image, so it
  // opts in to preloading (fetchpriority high, no lazy-loading); the rest
  // lazy-load as they scroll into view. Set by ArtistGrid.
  preload = false,
}: {
  artist: ArtistEntry;
  preload?: boolean;
}) {
  return (
    <article className="artist-card">
      {artist.image && (
        <div className="artist-card__photo">
          <Image
            className="artist-card__photo-img"
            src={artist.image.node.sourceUrl}
            alt={artist.image.node.altText || artist.name || ""}
            fill
            sizes="(min-width: 943px) 340px, (min-width: 640px) 50vw, 100vw"
            preload={preload}
          />
        </div>
      )}
      {artist.name && <h3 className="artist-card__name">{artist.name}</h3>}
      {artist.link && (
        <a
          className="artist-card__website"
          href={artist.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {artist.linkTitle || "Visit website"}
        </a>
      )}
      {artist.bio && (
        <div
          className="artist-card__bio"
          dangerouslySetInnerHTML={{ __html: artist.bio }}
        />
      )}
    </article>
  );
}
