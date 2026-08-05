# Nutty Narrows Thrift Shop Frontend

The headless frontend for [Nutty Narrows Thrift Shop](https://nuttynarrows.com/). This is a Next.js (App Router) app that reads content from a WordPress backend over WPGraphQL.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **WPGraphQL** product and page content
- **Sass (7-1 architecture)** in `assets/sass/` for hand-styled components/pages, plus **Tailwind** utility classes for layout-level styling

## Prerequisites

- Node.js 20+
- A running WordPress install with WPGraphQL

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
components/           Shared UI (Header, Footer, ProductGallery, forms, etc.)
lib/                  Data fetching (WPGraphQL, Store API, account API) and React Contexts (cart, auth, cookie consent)
assets/sass/          7-1 Sass architecture: utils, components, layout, pages
proxy.ts              Runs before every request; enforces the coming-soon gate
```

## Deployment

The frontend deploys to Vercel; WordPress stays on its own host (see the repo root). Point `WORDPRESS_API_URL` at your production WordPress subdomain (e.g. `https://wp.nuttynarrows.com/graphql`) and `SITE_URL` at the production domain in Vercel's environment variables.
