import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductSvg } from "@/components/product-svg";
import { EnquiryForm } from "@/components/enquiry-form";
import { ProductCard } from "@/components/product-card";
import {
  PRODUCTS,
  getProductBySlug,
  getProductsByCategory,
  createWhatsAppEnquiryUrl,
  STORE_INFO,
} from "@/lib/catalogue-data";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Muhammad Kairu Electronics (Jos)`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const whatsappUrl = createWhatsAppEnquiryUrl(
    product.name,
    product.slug,
    product.priceFormatted
  );

  return (
    <div className="container" style={{ padding: "32px 0 60px" }}>
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb-nav" aria-label="Breadcrumbs">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/products">Catalogue</Link>
        <span>›</span>
        <Link href={`/products?category=${product.categorySlug}`}>{product.category}</Link>
        <span>›</span>
        <span style={{ color: "var(--navy)", fontWeight: 700 }}>{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="product-detail-layout">
        {/* Left: Product Visual Gallery Box */}
        <div className="product-gallery-box">
          <div className="product-gallery-main">
            <ProductSvg type={product.imageSvg} alt={product.name} />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: "14px",
              borderTop: "1px solid var(--line)",
              fontSize: "0.8125rem",
              color: "var(--ink-muted)",
            }}
          >
            <span>Model: {product.brand} Hardware</span>
            <span style={{ color: "var(--green-dark)", fontWeight: 700 }}>
              ● Verified Showroom Inventory
            </span>
          </div>

          {/* Showroom Pickup Assurance */}
          <div
            style={{
              marginTop: "20px",
              background: "var(--bg-warm)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-sm)",
              padding: "16px",
            }}
          >
            <strong style={{ display: "block", color: "var(--navy)", fontSize: "0.875rem", marginBottom: "4px" }}>
              📍 In-Store Testing & Collection
            </strong>
            <p style={{ fontSize: "0.8125rem", color: "var(--ink-secondary)", margin: 0, lineHeight: 1.5 }}>
              Available for immediate physical inspection at <strong>{STORE_INFO.shortAddress}</strong>, Jos.
              All equipment is powered on and tested before customer collection.
            </p>
          </div>
        </div>

        {/* Right: Product Details & Enquiry Actions */}
        <div className="product-detail-info">
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
            <span className="product-detail-brand-badge">{product.brand}</span>
            {product.isSolar && (
              <span className="badge-solar" style={{ display: "inline-block" }}>
                ☀️ Solar & Renewable Power
              </span>
            )}
            <span
              className={`product-stock-tag ${
                product.stockStatus === "in_stock" ? "stock-in" : "stock-confirm"
              }`}
            >
              ● {product.stockLabel}
            </span>
          </div>

          <h1 className="product-detail-title">{product.name}</h1>
          <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "20px" }}>
            {product.summary}
          </p>

          {/* Pricing Box */}
          <div className="product-detail-price-box">
            <div>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--ink-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                Showroom Price:
              </span>
              <div className="product-detail-price">{product.priceFormatted}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "block", fontSize: "0.75rem", color: "var(--ink-muted)" }}>
                Warranty Protection:
              </span>
              <strong style={{ color: "var(--navy)", fontSize: "0.85rem" }}>
                {product.warrantySummary}
              </strong>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="product-detail-actions-box">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              style={{ fontSize: "1rem", padding: "14px 24px" }}
            >
              <span>💬</span> Enquire / Confirm on WhatsApp
            </a>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="btn btn-navy btn-sm"
              >
                📞 Call {STORE_INFO.phoneDisplay}
              </a>
              <Link href="/contact" className="btn btn-outline btn-sm">
                📍 Showroom Directions
              </Link>
            </div>
          </div>

          {/* Detailed Overview */}
          <div style={{ margin: "24px 0", borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)", marginBottom: "10px" }}>
              Product Overview
            </h2>
            <p style={{ color: "var(--ink-secondary)", lineHeight: 1.65, fontSize: "0.95rem" }}>
              {product.description}
            </p>
          </div>

          {/* Technical Specifications Table */}
          <div style={{ margin: "24px 0", borderTop: "1px solid var(--line)", paddingTop: "20px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)", marginBottom: "10px" }}>
              Technical Specifications
            </h2>
            <table className="product-detail-specs-table">
              <tbody>
                {product.specifications.map((spec) => (
                  <tr key={spec.label}>
                    <th>{spec.label}</th>
                    <td>{spec.value}</td>
                  </tr>
                ))}
                <tr>
                  <th>Manufacturer Warranty</th>
                  <td>{product.warrantySummary}</td>
                </tr>
                <tr>
                  <th>Availability</th>
                  <td>{product.stockLabel}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Structured Web Enquiry Form */}
          <div style={{ marginTop: "32px", borderTop: "1px solid var(--line)", paddingTop: "24px" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy)", marginBottom: "8px" }}>
              Send an Online Enquiry
            </h2>
            <p style={{ color: "var(--ink-secondary)", fontSize: "0.875rem", marginBottom: "16px" }}>
              Have questions regarding delivery, bulk order discounts, or installation requirements?
              Submit your enquiry below and our technical staff will reach out.
            </p>
            <EnquiryForm productName={product.name} />
          </div>
        </div>
      </div>

      {/* Related Products from the same category */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: "64px", borderTop: "1px solid var(--line)", paddingTop: "40px" }}>
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Explore Similar Gear</span>
              <h2 className="section-title">Related {product.category}</h2>
            </div>
            <Link href={`/products?category=${product.categorySlug}`} className="section-link">
              View all in {product.category} →
            </Link>
          </div>

          <div className="product-grid">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
