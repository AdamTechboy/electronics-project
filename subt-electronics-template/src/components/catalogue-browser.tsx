"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "./product-card";
import {
  PRODUCTS,
  CATEGORIES,
  BRANDS,
  createWhatsAppEnquiryUrl,
} from "@/lib/catalogue-data";

interface CatalogueBrowserProps {
  initialCategory?: string;
  initialQuery?: string;
  initialBrand?: string;
  initialDepartment?: string;
}

export function CatalogueBrowser({
  initialCategory = "all",
  initialQuery = "",
  initialBrand = "all",
  initialDepartment = "all",
}: CatalogueBrowserProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDepartment);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.specifications.some(
            (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
          )
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by Brand
    if (selectedBrand && selectedBrand !== "all") {
      list = list.filter((p) => p.brandSlug === selectedBrand || p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Filter by Department
    if (selectedDepartment && selectedDepartment !== "all") {
      list = list.filter((p) => p.department === selectedDepartment);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => (a.priceKobo ?? 0) - (b.priceKobo ?? 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.priceKobo ?? 0) - (a.priceKobo ?? 0));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [searchQuery, selectedCategory, selectedBrand, selectedDepartment, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedDepartment("all");
    setSortBy("featured");
  };

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedDepartment !== "all";

  const customEnquiryUrl = createWhatsAppEnquiryUrl(
    searchQuery ? `Products matching '${searchQuery}'` : "Products at your Jos showroom"
  );

  return (
    <div>
      {/* Search and Filter Controls Panel */}
      <div
        style={{
          background: "white",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)",
          padding: "20px",
          marginBottom: "28px",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Top Search Input Row */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "18px" }}>
          <div style={{ flex: "1", minWidth: "260px" }}>
            <label
              htmlFor="catalogue-search"
              style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}
            >
              Search by Product Name, Model, or Tech Spec:
            </label>
            <div className="search-input-wrapper">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                id="catalogue-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. 5kVA, Lithium, 65 inch TV, Inverter, Felicity, Hisense..."
                className="search-field"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-muted)", padding: "4px 8px" }}
                  aria-label="Clear search input"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Department Filter Selector */}
          <div style={{ minWidth: "180px" }}>
            <label
              htmlFor="dept-select"
              style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}
            >
              Department:
            </label>
            <select
              id="dept-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line-strong)",
                background: "white",
                color: "var(--ink)",
                fontWeight: 600,
              }}
            >
              <option value="all">All Departments</option>
              <option value="solar">☀️ Solar & Power Only</option>
              <option value="electronics">📺 Home & Office Electronics</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div style={{ minWidth: "180px" }}>
            <label
              htmlFor="sort-select"
              style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy)", marginBottom: "6px" }}
            >
              Sort Products:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as "featured" | "price-asc" | "price-desc" | "name"
                )
              }
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line-strong)",
                background: "white",
                color: "var(--ink)",
                fontWeight: 600,
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div style={{ marginBottom: "14px" }}>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy)", marginRight: "10px" }}>
            Filter by Category:
          </span>
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`department-chip ${selectedCategory === "all" ? "active" : ""}`}
              style={{ cursor: "pointer", border: "1px solid var(--line)" }}
            >
              All Categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`department-chip ${selectedCategory === cat.slug ? "active" : ""}`}
                style={{ cursor: "pointer", border: "1px solid var(--line)" }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter Chips */}
        <div>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--navy)", marginRight: "10px" }}>
            Filter by Brand:
          </span>
          <div style={{ display: "inline-flex", flexWrap: "wrap", gap: "8px", marginTop: "6px" }}>
            <button
              type="button"
              onClick={() => setSelectedBrand("all")}
              className={`department-chip ${selectedBrand === "all" ? "active" : ""}`}
              style={{ cursor: "pointer", border: "1px solid var(--line)" }}
            >
              All Brands
            </button>
            {BRANDS.map((b) => (
              <button
                key={b.slug}
                type="button"
                onClick={() => setSelectedBrand(b.slug)}
                className={`department-chip ${selectedBrand === b.slug ? "active" : ""}`}
                style={{ cursor: "pointer", border: "1px solid var(--line)" }}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Bar & Reset */}
        {hasActiveFilters && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "14px",
              marginTop: "14px",
              borderTop: "1px solid var(--line)",
              fontSize: "0.875rem",
            }}
          >
            <span style={{ color: "var(--ink-secondary)" }}>
              Active filters applied • <strong>{filteredProducts.length}</strong> matching item(s) found
            </span>
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: "none",
                border: "none",
                color: "var(--amber-dark)",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Clear all filters ✕
            </button>
          </div>
        )}
      </div>

      {/* Catalogue Results Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--navy)" }}>
          {selectedCategory !== "all"
            ? `${CATEGORIES.find((c) => c.slug === selectedCategory)?.name || selectedCategory}`
            : selectedDepartment === "solar"
            ? "Solar & Renewable Power Solutions"
            : selectedDepartment === "electronics"
            ? "Home & Office Electronics"
            : "All Verified Products"}
          <span style={{ fontSize: "0.9rem", color: "var(--ink-muted)", fontWeight: 500, marginLeft: "8px" }}>
            ({filteredProducts.length} items)
          </span>
        </h2>
      </div>

      {/* Product Grid or Empty Results State */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "white",
            border: "1px solid var(--line)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 24px",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--navy)", marginBottom: "8px" }}>
            No products found matching your criteria
          </h3>
          <p style={{ color: "var(--ink-secondary)", maxWidth: "520px", margin: "0 auto 24px" }}>
            We could not find an item matching &ldquo;{searchQuery || "selected filters"}&rdquo;.
            We stock dozens of additional models, accessories, and spare parts at our Jos showroom.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" onClick={handleClearFilters} className="btn btn-navy">
              Reset Filters
            </button>
            <a
              href={customEnquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <span>💬</span> Ask Showroom on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Showroom Sourcing Assistance Banner */}
      <div
        style={{
          marginTop: "48px",
          background: "var(--navy)",
          borderRadius: "var(--radius-md)",
          padding: "28px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--amber)", marginBottom: "6px" }}>
            Looking for a specific model or custom solar setup?
          </h3>
          <p style={{ color: "#CBD5E1", fontSize: "0.9rem", maxWidth: "620px" }}>
            Our Jos showroom supplies specific inverter capacities (1kVA to 20kVA), tubular batteries,
            commercial solar panels, and specialized accessories not yet listed online.
          </p>
        </div>
        <a
          href={customEnquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <span>💬</span> Request Custom Price & Model
        </a>
      </div>
    </div>
  );
}

