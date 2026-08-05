// Renders Yoast's structured-data graph (WebPage/BreadcrumbList/WebSite/
// etc. — whatever Yoast has built for this page) as a JSON-LD <script>
// tag. Next.js's Metadata API has no structured-data field, so per Next's
// own docs this is rendered directly in the page body rather than through
// generateMetadata(). The JSON always comes from Yoast/WordPress, never
// from user input, so serializing it into a script tag this way is safe.
export default function JsonLd({ schema }: { schema: unknown }) {
  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
