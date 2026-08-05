import type { Metadata } from "next";
import WpPage from "@/components/WpPage";
import JsonLd from "@/components/JsonLd";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "About",
  description: "The story behind Nutty Narrows Thrift Shop.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo("about", FALLBACK);
  return buildMetadata(seo);
}

export default async function AboutPage() {
  const seo = await getYoastSeo("about", FALLBACK);

  return (
    <>
      <JsonLd schema={seo.schema} />
      <WpPage slug="about" className="about-page" />
    </>
  );
}
