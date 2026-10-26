import Link from "next/link";
import type { DemoProduct } from "@/lib/demo-products";

export function ProductCard({ product }: { product: DemoProduct }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-image-placeholder" aria-label={`View ${product.name}`}>
        <span aria-hidden="true">◇</span>
        <small>Sample catalogue image area</small>
      </Link>
      <div className="product-card-body">
        <p className="eyebrow">{product.category} · {product.brand}</p>
        <h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3>
        <p className="muted">{product.summary}</p>
        <div className="product-card-bottom">
          <span className="stock-pill">Confirm availability</span>
          <Link className="text-link" href={`/products/${product.slug}`}>View details →</Link>
        </div>
      </div>
    </article>
  );
}
