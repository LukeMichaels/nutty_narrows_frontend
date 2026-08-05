import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import VendAnotherLink from "@/components/VendAnotherLink";
import VendTransitionOverlay from "@/components/VendTransitionOverlay";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import { VendTransitionProvider } from "@/lib/vend-transition-context";
import "./globals.css";
import "@/assets/sass/main.scss";

export const metadata: Metadata = {
  // Required to resolve the auto-generated opengraph-image route (and any
  // relative metadata URLs) to an absolute URL — social crawlers require
  // absolute URLs, and Next.js can't reliably infer the production domain
  // on its own. Reuses SITE_URL (same env var sitemap.ts/robots.ts read)
  // rather than a second hardcoded domain to keep them from drifting apart.
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "Nutty Narrows Thrift Shop",
    template: "%s | Nutty Narrows Thrift Shop",
  },
  description: "A creative vending machine business — art, trinkets, movies, and more.",
  openGraph: {
    type: "website",
    siteName: "Nutty Narrows Thrift Shop",
    title: "Nutty Narrows Thrift Shop",
    description: "A creative vending machine business — art, trinkets, movies, and more.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/uvf4xfr.css" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CookieConsentProvider>
          <VendTransitionProvider>
            <Header />
            <div className="flex flex-1 flex-col">
              {children}
            </div>
            <Footer />
            <CookieBanner />
            <VendAnotherLink />
            <VendTransitionOverlay />
          </VendTransitionProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}
