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
  },
  async headers() {
    return [
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
