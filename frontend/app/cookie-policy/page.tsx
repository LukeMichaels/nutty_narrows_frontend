import type { Metadata } from "next";
import WpPage from "@/components/WpPage";
import JsonLd from "@/components/JsonLd";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "Cookie Policy",
  description: "How Nutty Narrows Thrift Shop uses cookies and similar technologies.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo("cookie-policy", FALLBACK);
  return buildMetadata(seo);
}

export default async function CookiePolicyPage() {
  const seo = await getYoastSeo("cookie-policy", FALLBACK);

  return (
    <>
      <JsonLd schema={seo.schema} />
      <WpPage slug="cookie-policy" className="legal-page" />
    </>
  );
}
