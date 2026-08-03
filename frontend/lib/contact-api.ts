function getContactApiBase(): string {
  const graphqlUrl = process.env.WORDPRESS_API_URL;
  if (!graphqlUrl) {
    throw new Error(
      "WORDPRESS_API_URL is not set. Copy .env.local.example to .env.local and point it at your WPGraphQL endpoint.",
    );
  }
  return new URL("/wp-json/nutty-narrows/v1", graphqlUrl).toString();
}

export async function submitContactForm(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  website?: string; // honeypot; leave empty
}): Promise<{ ok: true }> {
  const res = await fetch(`${getContactApiBase()}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.message || `Contact API request failed: ${res.status}`);
  }
  return body as { ok: true };
}
