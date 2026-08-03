import type { Metadata } from "next";
import WpPage from "@/components/WpPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find a Nutty Narrows vending machine near you and get directions.",
};

// Thin WpPage wrapper for now — will be replaced with a real locations list
// (address, map, directions link per machine) once ACF fields for locations
// exist.
export default function LocationsPage() {
  return <WpPage slug="locations" className="about-page" />;
}
