import type { Metadata } from "next";
import { getPage } from "@/lib/wordpress";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nutty Narrows Thrift Shop.",
};

export default async function ContactPage() {
  const page = await getPage("contact");

  return (
    <main className="contact-page">
      <h1>Contact</h1>

      {page?.content && (
        <div
          className="contact-page__info"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      )}

      <ContactForm />
    </main>
  );
}
