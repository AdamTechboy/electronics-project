import type { Metadata } from "next";
import "./globals.css";
import { tenantConfig } from "@/config/tenant";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL(tenantConfig.seo.siteUrl),
  title: { default: tenantConfig.seo.defaultTitle, template: `%s | ${tenantConfig.brand.name}` },
  description: tenantConfig.seo.defaultDescription,
  robots: process.env.NODE_ENV === "production" ? { index: true, follow: true } : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
