import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CookieConsentProvider } from "@/lib/cookie-consent-context";
import "./globals.css";
import "@/assets/sass/main.scss";

export const metadata: Metadata = {
  // Required to resolve the auto-generated opengraph-image route (and any
  // relative metadata URLs) to an absolute URL — social crawlers require
  // absolute URLs, and Next.js can't reliably infer the production domain
  // on its own.
  // TODO: swap in the real production domain once one exists.
  metadataBase: new URL("https://nutty-narrows.vercel.app"),
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
      <body className="min-h-full flex flex-col">
        <CookieConsentProvider>
          <Header />
          <div className="site-margins flex flex-1 flex-col">
            {children}
          </div>
          <Footer />
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
