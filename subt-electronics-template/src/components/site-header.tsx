import Link from "next/link";
import { tenantConfig } from "@/config/tenant";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/" aria-label={`${tenantConfig.brand.name} home`}>
          <span className="brand-mark" aria-hidden="true">MK</span>
          <span>{tenantConfig.brand.name}</span>
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href="/products">Products</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/warranty-returns">Warranty</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link className="button button-small" href="/contact">Make an enquiry</Link>
      </div>
    </header>
  );
}
