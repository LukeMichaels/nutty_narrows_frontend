import type { Metadata } from "next";
import WpPage from "@/components/WpPage";
import JsonLd from "@/components/JsonLd";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "Privacy Policy",
  description: "How Nutty Narrows Thrift Shop collects, uses, and protects your information.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo("privacy-policy", FALLBACK);
  return buildMetadata(seo);
}

export default async function PrivacyPolicyPage() {
  const seo = await getYoastSeo("privacy-policy", FALLBACK);

  return (
    <>
      <JsonLd schema={seo.schema} />
      <WpPage slug="privacy-policy" className="legal-page" />
    </>
  );
}
