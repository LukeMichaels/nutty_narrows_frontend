import type { Metadata } from "next";
import VendingMachineScene from "@/components/machine/VendingMachineScene";
import { getPage } from "@/lib/wordpress";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Nutty Narrows Thrift Shop";
const FALLBACK_SUBHEADING =
  "<p>Longview, WA’s creative vending machines. Nostalgic thrifts, local art, and cute things.</p>";
const FALLBACK_DESCRIPTION =
  "A creative vending machine business — art, trinkets, movies, and more.";

// The slug of WordPress's static front page — this differs per
// environment (each WordPress install named its front page differently),
// so it's configured rather than hardcoded. See .env.local.example.
const HOME_SLUG = process.env.WORDPRESS_HOME_SLUG || "home";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo(HOME_SLUG, {
    title: FALLBACK_TITLE,
    description: FALLBACK_DESCRIPTION,
  });
  return buildMetadata(seo);
}

export default async function HomePage() {
  let title: string = FALLBACK_TITLE;
  let subheading: string | null = FALLBACK_SUBHEADING;
  let schema: unknown;

  try {
    // The "Home" WordPress page just carries the H1 + SEO subheading shown
    // above the machine — the scene itself isn't WP-driven. Falls back to
    // the copy above rather than breaking the homepage if that page isn't
    // set up yet or WordPress is unreachable.
    const [page, seo] = await Promise.all([
      getPage(HOME_SLUG),
      getYoastSeo(HOME_SLUG, { title: FALLBACK_TITLE, description: FALLBACK_DESCRIPTION }),
    ]);
    if (page) {
      title = page.title || FALLBACK_TITLE;
      subheading = page.content ?? FALLBACK_SUBHEADING;
    }
    schema = seo.schema;
  } catch {
    // Use the fallback copy.
  }

  return (
    <>
      <JsonLd schema={schema} />
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
    </>
  );
}
