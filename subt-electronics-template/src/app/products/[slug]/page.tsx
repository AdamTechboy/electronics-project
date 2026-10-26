import { notFound } from "next/navigation";
import Link from "next/link";
import { demoProducts } from "@/lib/demo-products";
import { EnquiryForm } from "@/components/enquiry-form";

export function generateStaticParams() { return demoProducts.map(p => ({ slug: p.slug })); }

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = demoProducts.find(p => p.slug === slug);
  if (!product) notFound();
  return (
    <div className="container">
      <section className="page-hero"><p className="eyebrow"><Link href="/products">Products</Link> / {product.category}</p><h1>{product.name}</h1><p>{product.summary}</p></section>
      <div className="product-detail-grid section" style={{ paddingTop: 8 }}>
        <div className="detail-image" aria-label="Placeholder for approved product image">◇</div>
        <div className="content-card">
          <span className="stock-pill">Confirm availability with store</span>
          <h2 style={{ marginTop: 18 }}>Product information</h2>
          <p>Current selling price is not published in this sample. Ask the store to confirm price, stock, warranty, and delivery details.</p>
          <ul className="spec-list">{product.specifications.map(spec => <li key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></li>)}</ul>
          <h2 style={{ marginTop: 28 }}>Enquire about this product</h2>
          <EnquiryForm productName={product.name} />
        </div>
      </div>
    </div>
  );
}
