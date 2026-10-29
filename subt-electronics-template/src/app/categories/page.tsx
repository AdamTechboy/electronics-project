import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getStoreCategories } from "@/lib/catalogue-db";

export const metadata: Metadata = {
  title: "Product Categories | Solar Power & Electronics",
  description:
    "Explore product categories at Muhammad Kairu Electronics in Jos: Solar Solutions, Inverters, Lithium Batteries, 4K Smart TVs, Audio, Refrigeration, and Electrical Accessories.",
};

export default async function CategoriesPage() {
  const categories = await getStoreCategories();

  return (
    <div className="container" style={{ padding: "40px 0 60px" }}>
      <div style={{ marginBottom: "32px" }}>
        <span className="section-eyebrow">Department Directory</span>
        <h1 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 900, color: "var(--navy)", marginBottom: "8px" }}>
          Product Categories
        </h1>
        <p style={{ color: "var(--ink-secondary)", fontSize: "1.05rem", maxWidth: "680px", lineHeight: 1.6 }}>
          Discover our specialized departments. Whether you are equipping an off-grid solar installation
          or upgrading your home entertainment, find the right equipment below.
        </p>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className={`category-card ${category.department === "solar" ? "solar-category" : ""}`}
          >
            <div className="category-card-top">
              <div className="category-icon-box">
                {category.slug === "solar-power-solutions" && "☀️"}
                {category.slug === "television-visuals" && "📺"}
                {category.slug === "home-audio" && "🔊"}
                {category.slug === "refrigeration-cooling" && "❄️"}
                {category.slug === "kitchen-appliances" && "🍳"}
                {category.slug === "electrical-accessories" && "🔌"}
                {!["solar-power-solutions", "television-visuals", "home-audio", "refrigeration-cooling", "kitchen-appliances", "electrical-accessories"].includes(category.slug) && "⚡"}
              </div>
              <span className="category-badge">{category.itemCountEstimate}</span>
            </div>

            <h2 className="category-title" style={{ fontSize: "1.2rem" }}>
              {category.name}
            </h2>
            <p className="category-desc">{category.description}</p>

            <div className="category-footer">
              <span>View Department Products</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
