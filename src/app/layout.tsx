import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { connection } from "next/server";
import { rootMetadata } from "../config/seo";
import { OrganizationStructuredData } from "../components/aeetds/seo/structured-data";
import { SiteContentProvider } from "../components/aeetds/site-content";
import { publicContent } from "../server/public-content";

export const metadata: Metadata = rootMetadata;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const content = publicContent();
  return (
    <html lang="en">
      <head>
        {[
          "manrope-latin-wght-normal.woff2",
          "newsreader-latin-wght-normal.woff2",
        ].map((font) => (
          <link
            key={font}
            rel="preload"
            href={`/fonts/${font}`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <meta name="google-site-verification" content="GXYbw1Sr3OKYCNFMetw2x0VNiOWalUMHv1K9x1ICKv8" />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <OrganizationStructuredData />
        <SiteContentProvider initial={content}>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
