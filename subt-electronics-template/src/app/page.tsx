import Link from "next/link";
import { tenantConfig } from "@/config/tenant";
import { demoCategories, demoProducts } from "@/lib/demo-products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Electronics catalogue · Enquiry-first</p>
            <h1>Find the electronics you need.</h1>
            <p className="lead">Explore the catalogue, review product information, and contact the store to confirm current prices, availability, and warranty details.</p>
            <div className="hero-actions">
              <Link className="button" href="/products">Browse products</Link>
              <Link className="button-secondary" href="/contact">Ask the store</Link>
            </div>
            <div className="trust-strip">
              <div className="trust-item"><strong>Clear information</strong><span>Product details in one place</span></div>
              <div className="trust-item"><strong>Confirm before buying</strong><span>Check stock and current pricing</span></div>
              <div className="trust-item"><strong>Direct enquiry</strong><span>Ask about products and support</span></div>
            </div>
          </div>
          <div className="hero-art" aria-label="Electronics catalogue introduction">
            <span className="hero-art-label">MUHAMMAD KAIRU ELECTRONICS</span>
            <span className="hero-art-title">Technology for everyday life.</span>
            <span className="hero-art-note">Client-approved product images and verified store details will be added before launch.</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><p className="eyebrow">Browse by category</p><h2>Explore categories</h2><p>Choose a category to discover relevant products.</p></div>
            <Link className="text-link" href="/categories">All categories →</Link>
          </div>
          <div className="category-grid">
            {demoCategories.map((category) => <Link className="category-tile" href={`/products?category=${encodeURIComponent(category)}`} key={category}>{category} <span aria-hidden="true"> ↗</span></Link>)}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "#eef3f9" }}>
        <div className="container">
          <div className="section-head">
            <div><p className="eyebrow">Catalogue preview</p><h2>Featured sample listings</h2><p>These are fictional development examples, not confirmed store inventory.</p></div>
            <Link className="text-link" href="/products">View catalogue →</Link>
          </div>
          <div className="notice" style={{ marginBottom: 20 }}>Development preview: sample products and specifications are fictional. Replace them with verified client data before launch.</div>
          <div className="product-grid">{demoProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-panel">
            <div><p className="eyebrow" style={{ color: "#ffd49f" }}>Need product information?</p><h2>Ask before you make a decision.</h2><p>Send an enquiry to confirm current price, stock availability, compatible accessories, delivery arrangements, and warranty terms.</p></div>
            <Link className="button" href="/contact">Make an enquiry</Link>
          </div>
        </div>
      </section>
    </>
  );
}
