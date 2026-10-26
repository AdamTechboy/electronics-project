import Link from "next/link";
import { demoProducts } from "@/lib/demo-products";

export const metadata = { title: "Brands" };

export default function BrandsPage() {
  const brands = [...new Set(demoProducts.map((product) => product.brand))];
  return (
    <div className="container">
      <section className="page-hero">
        <p className="eyebrow">Catalogue</p>
        <h1>Brands</h1>
        <p>Only approved brand listings should appear in the live catalogue. The brand below is a fictional development placeholder.</p>
      </section>
      <section className="section" style={{ paddingTop: 8 }}>
        <div className="category-grid">
          {brands.map((brand) => (
            <Link className="category-tile" href="/products" key={brand}>{brand} ↗</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
