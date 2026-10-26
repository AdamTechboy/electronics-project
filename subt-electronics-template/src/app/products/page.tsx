import Link from "next/link";
import { demoProducts } from "@/lib/demo-products";
import { ProductCard } from "@/components/product-card";

export const metadata = { title: "Products" };

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const products = params.category ? demoProducts.filter(p => p.category.toLowerCase() === params.category!.toLowerCase()) : demoProducts;
  return (
    <div className="container">
      <section className="page-hero">
        <p className="eyebrow">Catalogue</p><h1>Products</h1>
        <p>Browse the sample catalogue. Prices and availability must be confirmed with the store. The examples shown here are fictional development data.</p>
      </section>
      <div className="section" style={{ paddingTop: 10 }}>
        {params.category && <p>Category: <strong>{params.category}</strong> · <Link className="text-link" href="/products">Clear filter</Link></p>}
        {products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div> : <div className="content-card"><h2>No products in this sample category</h2><p>Try the full catalogue or ask the store about the category.</p><Link className="button" href="/products">View all products</Link></div>}
      </div>
    </div>
  );
}
