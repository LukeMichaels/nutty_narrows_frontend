import VendingMachineScene from "@/components/machine/VendingMachineScene";
import { getPage } from "@/lib/wordpress";

const FALLBACK_TITLE = "Nutty Narrows Thrift Shop";
const FALLBACK_SUBHEADING =
  "<p>Longview, WA’s creative vending machines. Nostalgic thrifts, local art, and cute things.</p>";

export default async function HomePage() {
  let title: string = FALLBACK_TITLE;
  let subheading: string | null = FALLBACK_SUBHEADING;

  try {
    // The "Home" WordPress page just carries the H1 + SEO subheading shown
    // above the machine — the scene itself isn't WP-driven. Falls back to
    // the copy above rather than breaking the homepage if that page isn't
    // set up yet or WordPress is unreachable.
    const page = await getPage("home");
    if (page) {
      title = page.title || FALLBACK_TITLE;
      subheading = page.content ?? FALLBACK_SUBHEADING;
    }
  } catch {
    // Use the fallback copy.
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <div className="site-margins home-hero">
        <h1>{title}</h1>
        {subheading && (
          <div
            className="home-hero__subheading"
            dangerouslySetInnerHTML={{ __html: subheading }}
          />
        )}
      </div>
      <VendingMachineScene />
    </main>
  );
}
