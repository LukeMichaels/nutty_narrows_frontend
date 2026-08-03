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
};

export default nextConfig;
