import type { Metadata } from "next";
import WpPage from "@/components/WpPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Artists",
  description: "Meet the artists whose work you'll find in the Nutty Narrows vending machines.",
};

// Thin WpPage wrapper for now — will be replaced with a real artist roster
// (photo, bio, links) once ACF fields for artists exist.
export default function ArtistsPage() {
  return <WpPage slug="artists" className="about-page" />;
}
