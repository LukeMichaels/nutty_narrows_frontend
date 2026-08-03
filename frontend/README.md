# Night Lights Frontend

The headless storefront for [Night Lights](https://nightlights.club). This is a Next.js (App Router) app that reads content and products from a WordPress/WooCommerce backend over WPGraphQL, and talks to WooCommerce's REST Store API for the cart.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **WPGraphQL** + **WooGraphQL** — product and page content
- **WooCommerce Store API** — cart (guest sessions via a signed Cart-Token, no cookies required)
- **A custom mu-plugin** (`wp-content/mu-plugins/night-lights-account-api.php`) — account register/login/orders/contact-form, since WordPress has no first-party cross-origin-safe auth. Uses a hand-rolled JWT, set via httpOnly cookies through this app's own Route Handlers (`app/api/**`), so the browser never talks to WordPress directly.
- **Sass (7-1 architecture)** in `assets/sass/` for hand-styled components/pages, plus **Tailwind** utility classes for layout-level styling
- Checkout is intentionally simple: the React cart hands off to WooCommerce's own hosted checkout for address/payment, then returns to `/thank-you`.

## Prerequisites

- Node.js 20+
- A running WordPress install with WooCommerce, WPGraphQL, and WooGraphQL active (already vendored under `../wp-content/plugins`), and the account-api mu-plugin present under `../wp-content/mu-plugins`

## Getting started

```bash
cp .env.local.example .env.local
# fill in WORDPRESS_API_URL for your local WP install
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `WORDPRESS_API_URL` | URL of the WPGraphQL endpoint (e.g. `https://your-site.local/graphql`). Also used to derive the allowed image host for `next/image`. |
| `SITE_URL` | Public URL of this frontend, used in `robots.txt` and `sitemap.xml`. |
| `COMING_SOON` | Set to `true` to gate the entire site behind a splash page (see below). Defaults to `false`. |

In production (Vercel), set these under Project → Settings → Environment Variables rather than committing `.env.local` — see [Deployment](#deployment).

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack). Also disables TLS verification for local MAMP's self-signed cert — dev only, not used in `build`/`start`. |
| `npm run build` | Production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | ESLint. |

## Project structure

```
app/                  Routes (App Router — one folder per route, page.tsx per screen)
  api/                Route Handlers that proxy the browser to WordPress (auth cookies, cart, contact)
  coming-soon/         Pre-launch splash page
  products/[slug]/     Product detail
components/           Shared UI (Header, Footer, ProductGallery, forms, etc.)
lib/                  Data fetching (WPGraphQL, Store API, account API) and React Contexts (cart, auth, cookie consent)
assets/sass/          7-1 Sass architecture: utils, components, layout, pages
proxy.ts              Runs before every request; enforces the coming-soon gate
```

## Coming-soon mode

Setting `COMING_SOON=true` rewrites every route (except `/api`) to the splash page at `/coming-soon`, sets `robots.txt` to disallow everything, and collapses `sitemap.xml` to just the homepage — so nothing gets indexed before launch. Flip it back to `false` (and redeploy) when the store is ready to go live.

## Deployment

The frontend deploys to Vercel; WordPress stays on its own host (see the repo root). Point `WORDPRESS_API_URL` at your production WordPress subdomain (e.g. `https://wp.nightlights.club/graphql`) and `SITE_URL` at the production domain in Vercel's environment variables.
