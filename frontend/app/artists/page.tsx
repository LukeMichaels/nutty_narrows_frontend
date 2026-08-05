import type { Metadata } from "next";
import { getArtistsPage } from "@/lib/wordpress";
import ArtistGrid from "@/components/ArtistGrid";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the artists whose work you'll find in the Nutty Narrows vending machines.",
};

export default async function ArtistsPage() {
  const page = await getArtistsPage();
  const artists = page?.artists?.artists ?? [];

  return (
    <main id="main-content" tabIndex={-1} className="artists-page">
      <div className="page-content-wrap">
        <h1>{page?.title ?? "Artists"}</h1>

        {page?.content && (
          <div
            className="artists-page__intro"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}

        <ArtistGrid artists={artists} />
      </div>
    </main>
  );
}
