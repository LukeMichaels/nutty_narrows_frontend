import { notFound } from "next/navigation";
import { getPage } from "@/lib/wordpress";

// Thin wrapper for pages that just pull rendered block content from
// wp-admin and display it under a heading (About, Privacy Policy, Cookie
// Policy, ...). The className drives which pages/_*.scss partial styles it.
export default async function WpPage({
  slug,
  className,
}: {
  slug: string;
  className: string;
}) {
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1} className={className}>
      <div className="page-content-wrap">
        <h1>{page.title}</h1>
        {page.content && (
          <div
            className={`${className}__content`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </div>
    </main>
  );
}
