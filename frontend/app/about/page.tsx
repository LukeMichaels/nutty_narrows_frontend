import type { Metadata } from "next";
import WpPage from "@/components/WpPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Nutty Narrows Thrift Shop and its vending machines.",
};

export default function AboutPage() {
  return <WpPage slug="about" className="about-page" />;
}
