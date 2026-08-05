import type { Metadata } from "next";
import { getPage } from "@/lib/wordpress";
import { getYoastSeo, buildMetadata } from "@/lib/yoast";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "Contact",
  description: "Get in touch with Nutty Narrows Thrift Shop.",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getYoastSeo("contact", FALLBACK);
  return buildMetadata(seo);
}

export default async function ContactPage() {
  const [page, seo] = await Promise.all([
    getPage("contact"),
    getYoastSeo("contact", FALLBACK),
  ]);

  return (
    <>
      <JsonLd schema={seo.schema} />
      <main id="main-content" tabIndex={-1} className="contact-page">
        <div className="page-content-wrap">
          <h1>Contact</h1>

          {page?.content && (
            <div
              className="contact-page__info"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          <ContactForm />
        </div>
      </main>
    </>
  );
}
