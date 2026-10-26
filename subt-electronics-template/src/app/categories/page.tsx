import Link from "next/link";
import { demoCategories } from "@/lib/demo-products";
export const metadata = { title: "Categories" };
export default function CategoriesPage() {
  return <div className="container"><section className="page-hero"><p className="eyebrow">Catalogue</p><h1>Product categories</h1><p>These are starter categories only. Final categories should be confirmed with the client.</p></section><section className="section" style={{paddingTop:8}}><div className="category-grid">{demoCategories.map(c=><Link className="category-tile" href={`/products?category=${encodeURIComponent(c)}`} key={c}>{c} ↗</Link>)}</div></section></div>;
}
