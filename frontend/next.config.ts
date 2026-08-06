import type { NextConfig } from "next";

// Scope next/image's optimizer to the actual configured WP host instead of
// a wildcard — a wildcard hostname turns /_next/image?url=... into an SSRF
// primitive (the Next.js server will fetch any URL an attacker supplies).
const wordpressUrl = process.env.WORDPRESS_API_URL
  ? new URL(process.env.WORDPRESS_API_URL)
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wordpressUrl
      ? [
          {
            protocol: wordpressUrl.protocol.replace(
              ":",
              ""
            ) as "http" | "https",
            hostname: wordpressUrl.hostname,
          },
        ]
      : [],
    // MAMP hosts (e.g. nuttynarrows:8890) resolve to 127.0.0.1, which
    // Next.js blocks by default as an SSRF guard. Only needed for local
    // dev — the production WP host resolves to a real public IP, so this
    // stays off (and the guard stays active) in production.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    // Serve AVIF first (smallest), falling back to WebP, then the source.
    // The WordPress uploads are already WebP; AVIF re-encoding shrinks the
    // artist/location photos further with no visible quality loss.
    formats: ["image/avif", "image/webp"],
    // The optimized variants are content-addressed by URL+width+quality and
    // never change for a given upload, so cache them at Vercel's edge for a
    // month rather than the 4-hour default (re-uploading an image in
    // WordPress produces a new URL, which busts this naturally).
    minimumCacheTTL: 2678400, // 31 days
    // Next 16 requires an explicit quality allowlist; 75 is the default the
    // components use and is visually lossless for photos at these sizes.
    qualities: [75],
  },
  async headers() {
    return [
      {
        // The large decorative wall SVG never changes without a redeploy,
        // so serve it with a long immutable cache instead of revalidating
        // it on every visit (if the art is ever updated, rename the file).
        source: "/wall-picture-of-sandy.svg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          // This site is never meant to be framed by anyone.
          { key: "X-Frame-Options", value: "DENY" },
          // Stops the browser from ever guessing/upgrading a response's
          // MIME type (e.g. treating an uploaded file as executable JS).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Sends the full referring URL only to our own origin; other
          // sites just see the scheme+host, not the path/query.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Explicitly opt out of browser features this site never uses.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // A locked-down Content-Security-Policy isn't set here: this app
          // renders many inline SVG <style> blocks as plain JSX text (not
          // dangerouslySetInnerHTML) and relies on Next.js's own inline
          // hydration bootstrap script, so a real CSP needs a nonce-based
          // setup that's worth its own dedicated pass rather than
          // bolting on something untested right before launch.
        ],
      },
    ];
  },
};

export default nextConfig;
