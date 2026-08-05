import type { Metadata } from "next";
import { getLocationsPage } from "@/lib/wordpress";
import LocationList from "@/components/LocationList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find a Nutty Narrows vending machine near you and get directions.",
};

export default async function LocationsPage() {
  const page = await getLocationsPage();
  const locations = page?.locations?.locations ?? [];

  return (
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
  );
}
