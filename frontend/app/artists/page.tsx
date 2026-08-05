import type { Metadata } from "next";
import { getArtistsPage } from "@/lib/wordpress";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";
import ArtistGrid from "@/components/ArtistGrid";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "Artists",
  description: "Meet the artists whose work you'll find in Nutty Narrows vending machines.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo("artists", FALLBACK);
  return buildMetadata(seo);
}

export default async function ArtistsPage() {
  const [page, seo] = await Promise.all([
    getArtistsPage(),
    getYoastSeo("artists", FALLBACK),
  ]);
  const artists = page?.artists?.artists ?? [];

  return (
    <>
      <JsonLd schema={seo.schema} />
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
    </>
  );
}
