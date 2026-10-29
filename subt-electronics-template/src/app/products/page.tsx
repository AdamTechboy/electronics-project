import React from "react";
import type { Metadata } from "next";
import { CatalogueBrowser } from "@/components/catalogue-browser";
import {
  getStoreProducts,
  getStoreCategories,
  getStoreBrands,
} from "@/lib/catalogue-db";

export const metadata: Metadata = {
  title: "Product Catalogue | Solar Equipment & Electronics",
  description:
    "Browse hybrid inverters, solar panels, lithium batteries, 4K Smart TVs, and home cooling appliances at Muhammad Kairu Electronics, Jos.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; brand?: string; department?: string }>;
}) {
  const params = await searchParams;

  const [products, categories, brands] = await Promise.all([
    getStoreProducts(),
    getStoreCategories(),
    getStoreBrands(),
  ]);

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      {/* Page Hero */}
      <div style={{ marginBottom: "28px" }}>
        <span className="section-eyebrow">Jos Electronics & Solar Showroom</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Product Catalogue
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "720px", lineHeight: 1.6 }}>
          Review technical specifications, capacity ratings, and verified showroom prices.
          All products can be inspected and picked up at Rochas Plaza, Jos, or enquired about directly on WhatsApp.
        </p>
      </div>

      {/* Interactive Catalogue Browser with Database Data */}
      <CatalogueBrowser
        initialCategory={params.category || "all"}
        initialQuery={params.q || ""}
        initialBrand={params.brand || "all"}
        initialDepartment={params.department || "all"}
        initialProducts={products}
        initialCategories={categories}
        initialBrands={brands}
      />
    </div>
  );
}
