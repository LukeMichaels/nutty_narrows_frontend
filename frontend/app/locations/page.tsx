import type { Metadata } from "next";
import { getLocationsPage } from "@/lib/wordpress";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";
import LocationList from "@/components/LocationList";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "Locations",
  description: "Find a Nutty Narrows vending machine near you and get directions.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo("locations", FALLBACK);
  return buildMetadata(seo);
}

export default async function LocationsPage() {
  const [page, seo] = await Promise.all([
    getLocationsPage(),
    getYoastSeo("locations", FALLBACK),
  ]);
  const locations = page?.locations?.locations ?? [];

  return (
    <>
      <JsonLd schema={seo.schema} />
      <main id="main-content" tabIndex={-1} className="locations-page">
        <div className="page-content-wrap">
          <h1>{page?.title ?? "Locations"}</h1>

          {page?.content && (
            <div
              className="locations-page__intro"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          <LocationList locations={locations} />
        </div>
      </main>
    </>
  );
}
