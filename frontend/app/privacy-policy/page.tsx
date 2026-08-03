import type { Metadata } from "next";
import WpPage from "@/components/WpPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nutty Narrows Thrift Shop collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return <WpPage slug="privacy-policy" className="legal-page" />;
}
