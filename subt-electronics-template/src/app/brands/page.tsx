import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BRANDS } from "@/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Featured Brands | Solar & Electronics",
  description:
    "Explore trusted global and domestic electronics & solar brands stocked by Muhammad Kairu Electronics in Jos: Felicity Solar, LG, Samsung, Hisense, Nexus, and Sollatek.",
};

export default function BrandsPage() {
  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-eyebrow">Authorized Hardware</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Brand Partners
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "680px", lineHeight: 1.6 }}>
          We partner with industry-leading manufacturers known for durability, official warranty backing,
          and robust performance under Nigerian operating conditions.
        </p>
      </div>

      <div className="category-grid">
        {BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            href={`/products?brand=${brand.slug}`}
            className="category-card"
          >
            <div className="category-card-top">
              <div className="category-icon-box" style={{ background: "var(--navy)", color: "var(--amber)", fontWeight: 900, fontSize: "1.1rem" }}>
                {brand.name.substring(0, 2).toUpperCase()}
              </div>
              <span className="category-badge">{brand.country}</span>
            </div>

            <h2 className="category-title" style={{ fontSize: "1.2rem" }}>
              {brand.name}
            </h2>
            <p className="category-desc">{brand.specialty}</p>

            <div className="category-footer">
              <span>View Brand Products</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
