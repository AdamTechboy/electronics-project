import Link from "next/link";
import { tenantConfig } from "@/config/tenant";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>{tenantConfig.brand.name}</strong>
          <p>Product availability and pricing should be confirmed with the store before purchase.</p>
        </div>
        <div className="footer-links">
          <Link href="/about">About</Link>
          <Link href="/delivery">Delivery</Link>
          <Link href="/warranty-returns">Warranty & returns</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} {tenantConfig.brand.name}. All rights reserved.</div>
    </footer>
  );
}
