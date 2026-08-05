import { cache } from "react";
import type { Metadata } from "next";

// Yoast SEO (installed + activated in wp-admin) automatically adds a
// `yoast_head_json` field to every WP REST API post/page response — no
// extra plugin needed to expose it, unlike WPGraphQL, which doesn't know
// about Yoast at all. This is Yoast's own officially-documented mechanism
// for headless frontends, so metadata (title, description, canonical,
// social image, robots, JSON-LD) stays fully editable from wp-admin →
// Yoast SEO, matching how every other page's content is already authored
// in WordPress rather than hardcoded here.
type YoastImage = {
  url: string;
  width?: string | number;
  height?: string | number;
};

type YoastHeadJson = {
  title?: string;
  description?: string;
  og_description?: string;
  robots?: Record<string, string>;
  canonical?: string;
  og_locale?: string;
  og_site_name?: string;
  og_image?: YoastImage[];
  twitter_image?: string;
  schema?: unknown;
};

export type SeoData = {
  title: string;
  description: string;
  canonical?: string;
  image?: { url: string; width?: number; height?: number };
  siteName?: string;
  locale?: string;
  noindex: boolean;
  schema?: unknown;
};

function getRestBase(): string {
  const graphqlUrl = process.env.WORDPRESS_API_URL;
  if (!graphqlUrl) {
    throw new Error(
      "WORDPRESS_API_URL is not set. Copy .env.local.example to .env.local and point it at your WordPress site."
    );
  }
  return new URL(graphqlUrl).origin;
}

function toNumber(value: string | number | undefined): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

// Yoast has no idea this is a headless setup — every URL it generates
// (canonical, and every page-identity URL inside its JSON-LD graph) uses
// the WordPress *backend's* own domain, which isn't the public site.
// Rewrites just the "this page lives at..." identity URLs to the
// frontend's domain instead, while leaving real asset URLs (an
// ImageObject's own `url`/`contentUrl` — actual uploaded media, which
// only exists on the backend) untouched.
function toFrontendUrl(backendUrl: string, backendOrigin: string, frontendOrigin: string): string {
  // Hostnames are case-insensitive, but WordPress's own configured site
  // URL and this frontend's WORDPRESS_API_URL don't always agree on
  // casing (e.g. "NuttyNarrows" vs "nuttynarrows") — a plain string prefix
  // check would silently fail to match and leave the backend URL in
  // place, so compare parsed origins instead.
  let parsed: URL;
  try {
    parsed = new URL(backendUrl);
  } catch {
    return backendUrl;
  }
  if (parsed.origin.toLowerCase() !== backendOrigin.toLowerCase()) {
    return backendUrl;
  }
  return frontendOrigin + parsed.pathname + parsed.search + parsed.hash;
}

function rewriteSchemaUrls(node: unknown, backendOrigin: string, frontendOrigin: string): unknown {
  if (Array.isArray(node)) {
    return node.map((entry) => rewriteSchemaUrls(entry, backendOrigin, frontendOrigin));
  }
  // A bare string reached via array recursion (e.g. a ReadAction's
  // `target: ["https://backend/..."]`) — the object branch below only
  // rewrites strings it finds as a property's value, so this catches ones
  // that aren't.
  if (typeof node === "string") {
    return toFrontendUrl(node, backendOrigin, frontendOrigin);
  }
  if (node && typeof node === "object") {
    const record = node as Record<string, unknown>;
    const isImageAsset = record["@type"] === "ImageObject";
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(record)) {
      const isAssetUrlField = isImageAsset && (key === "url" || key === "contentUrl");
      result[key] = isAssetUrlField
        ? value
        : rewriteSchemaUrls(value, backendOrigin, frontendOrigin);
    }
    return result;
  }
  return node;
}

// Cached (deduped) per request — a page's generateMetadata() and its own
// body both want this same data (metadata for the <head>, the page body
// for the matching JSON-LD <script> tag), and React's cache() ensures that
// only fetches WordPress once per slug per request instead of twice.
export const getYoastSeo = cache(async function getYoastSeo(
  slug: string,
  fallback: { title: string; description: string }
): Promise<SeoData> {
  try {
    const base = getRestBase();
    const res = await fetch(
      `${base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=yoast_head_json`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return { ...fallback, noindex: false };
    }
    const entries = (await res.json()) as { yoast_head_json?: YoastHeadJson }[];
    const head = entries[0]?.yoast_head_json;
    if (!head) {
      return { ...fallback, noindex: false };
    }

    const frontendOrigin = new URL(process.env.SITE_URL || "http://localhost:3000").origin;
    const image = head.og_image?.[0];
    return {
      title: head.title || fallback.title,
      description: head.og_description || head.description || fallback.description,
      canonical: head.canonical
        ? toFrontendUrl(head.canonical, base, frontendOrigin)
        : undefined,
      image: image?.url
        ? { url: image.url, width: toNumber(image.width), height: toNumber(image.height) }
        : undefined,
      siteName: head.og_site_name,
      locale: head.og_locale,
      noindex: head.robots?.index === "noindex",
      schema: head.schema
        ? rewriteSchemaUrls(head.schema, base, frontendOrigin)
        : undefined,
    };
  } catch {
    // WordPress unreachable — degrade to the route's own fallback copy
    // rather than breaking the page.
    return { ...fallback, noindex: false };
  }
});

// Falls back to the branded, code-generated card (app/api/og) whenever
// Yoast doesn't have an image for this page yet (no featured image and no
// site-wide default social image set in Yoast → Settings → Site features).
const DEFAULT_OG_IMAGE = { url: "/api/og", width: 1200, height: 630 };

export function buildMetadata(seo: SeoData): Metadata {
  const image = seo.image ?? DEFAULT_OG_IMAGE;

  return {
    // Yoast's title is already the complete, final string (it applies its
    // own site-name template in wp-admin) — `absolute` tells Next.js to use
    // it as-is rather than wrapping it in the root layout's own
    // `title.template`, which would otherwise double up the site name.
    title: { absolute: seo.title },
    description: seo.description,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    robots: seo.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      siteName: seo.siteName,
      locale: seo.locale,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [image.url],
    },
  };
}
