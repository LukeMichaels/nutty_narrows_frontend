import type { ArtistEntry } from "@/lib/wordpress";

export default function ArtistCard({ artist }: { artist: ArtistEntry }) {
  return (
    <article className="artist-card">
      {artist.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="artist-card__photo"
          src={artist.image.node.sourceUrl}
          alt={artist.image.node.altText || artist.name || ""}
        />
      )}
      {artist.name && <h2 className="artist-card__name">{artist.name}</h2>}
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
