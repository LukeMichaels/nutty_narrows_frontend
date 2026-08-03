import type { Metadata } from "next";
import WpPage from "@/components/WpPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Nutty Narrows Thrift Shop uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return <WpPage slug="cookie-policy" className="legal-page" />;
}
