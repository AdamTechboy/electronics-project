"use client";

import React, { useState, useTransition } from "react";
import {
  createProductAction,
  updateProductAction,
  archiveProductAction,
} from "@/server/actions/products";
import type { StockStatus } from "@/types/database.types";

export interface AdminProductItem {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string | null;
  price_kobo: number | null;
  stock_status: StockStatus;
  warranty_details: string | null;
  is_published: boolean;
  is_featured: boolean;
  category_id: string | null;
  brand_id: string | null;
  specifications: unknown;
  categories: { name: string; slug: string } | null;
  brands: { name: string; slug: string } | null;
  inventory_records?: Array<{ quantity: number | null; low_stock_threshold: number }> | null;
  product_images?: Array<{ storage_path: string; is_primary: boolean }> | null;
}

interface ProductsManagerProps {
  products: AdminProductItem[];
  categories: Array<{ id: string; name: string }>;
  brands: Array<{ id: string; name: string }>;
}

export function ProductsManager({
  products,
  categories,
  brands,
}: ProductsManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [confirmPrice, setConfirmPrice] = useState(false);
  const [priceNaira, setPriceNaira] = useState("");
  const [stockStatus, setStockStatus] = useState<StockStatus>("in_stock");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [warranty, setWarranty] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("5");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [specsText, setSpecsText] = useState("");

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function openCreateModal() {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(categories[0]?.id || "");
    setBrandId(brands[0]?.id || "");
    setConfirmPrice(false);
    setPriceNaira("");
    setStockStatus("in_stock");
    setSummary("");
    setDescription("");
    setWarranty("1 Year Official Warranty");
    setImageUrl("inverter");
    setInitialQuantity("5");
    setIsPublished(true);
    setIsFeatured(false);
    setSpecsText(
      JSON.stringify(
        [
          { label: "Rated Capacity", value: "" },
          { label: "Operating Voltage", value: "" },
        ],
        null,
        2
      )
    );
    setFeedback(null);
    setModalOpen(true);
  }

  function openEditModal(prod: AdminProductItem) {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategoryId(prod.category_id || "");
    setBrandId(prod.brand_id || "");
    setConfirmPrice(prod.price_kobo === null);
    setPriceNaira(prod.price_kobo !== null ? String(Math.round(prod.price_kobo / 100)) : "");
    setStockStatus(prod.stock_status);
    setSummary(prod.summary);
    setDescription(prod.description || "");
    setWarranty(prod.warranty_details || "");
    setImageUrl(prod.product_images?.[0]?.storage_path || "inverter");
    setInitialQuantity(String(prod.inventory_records?.[0]?.quantity ?? 0));
    setIsPublished(prod.is_published);
    setIsFeatured(prod.is_featured);

    let formattedSpecs = "[]";
    try {
      formattedSpecs = JSON.stringify(prod.specifications || [], null, 2);
    } catch {
      formattedSpecs = "[]";
    }
    setSpecsText(formattedSpecs);
    setFeedback(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    if (editingProduct) {
      formData.set("id", editingProduct.id);
    }
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("category_id", categoryId);
    formData.set("brand_id", brandId);
    if (confirmPrice) {
      formData.set("confirm_price", "on");
    } else {
      formData.set("price_naira", priceNaira);
    }
    formData.set("stock_status", stockStatus);
    formData.set("summary", summary);
    formData.set("description", description);
    formData.set("warranty_details", warranty);
    formData.set("image_url", imageUrl);
    formData.set("initial_quantity", initialQuantity);
    formData.set("specifications", specsText);
    if (isPublished) formData.set("is_published", "on");
    if (isFeatured) formData.set("is_featured", "on");

    startTransition(async () => {
      const res = editingProduct
        ? await updateProductAction(formData)
        : await createProductAction(formData);

      if (!res.success) {
        setFeedback({ type: "error", message: res.error || "Action failed." });
      } else {
        setFeedback({
          type: "success",
          message: editingProduct ? "Product updated successfully!" : "Product created successfully!",
        });
        setTimeout(() => {
          setModalOpen(false);
        }, 800);
      }
    });
  }

  function handleArchive(id: string, prodName: string) {
    if (!confirm(`Are you sure you want to archive "${prodName}"? It will be hidden from the storefront.`)) {
      return;
    }

    startTransition(async () => {
      const res = await archiveProductAction(id);
      if (!res.success) {
        alert(res.error || "Archive failed.");
      }
    });
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      search.trim() === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.brands?.name && p.brands.name.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || p.category_id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Action Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: "0 0 4px" }}>
            Product Catalogue Management
          </h1>
          <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.875rem", margin: 0 }}>
            Create, edit, price, and publish items. Changes immediately update the live public showroom.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary"
          style={{ padding: "10px 18px", fontSize: "0.875rem", cursor: "pointer" }}
        >
          + Add New Product
        </button>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-md, 8px)",
          border: "1px solid var(--line, #E2E8F0)",
          padding: "16px",
          marginBottom: "20px",
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "220px" }}>
          <input
            type="text"
            placeholder="Search products by name, slug or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid var(--line-strong, #CBD5E1)",
              fontSize: "0.875rem",
            }}
          />
        </div>

        <div style={{ minWidth: "200px" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "6px",
              border: "1px solid var(--line-strong, #CBD5E1)",
              fontSize: "0.875rem",
              background: "white",
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-md, 8px)",
          border: "1px solid var(--line, #E2E8F0)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "var(--bg-warm, #F7F5F0)", borderBottom: "1px solid var(--line, #E2E8F0)" }}>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Product</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Category</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Brand</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Price</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Stock Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Stock Qty</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Published</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "32px", textAlign: "center", color: "var(--ink-muted, #64748B)" }}>
                  No products found matching your filters.
                </td>
              </tr>
            ) : (
              filtered.map((prod) => {
                const priceDisplay =
                  prod.price_kobo === null
                    ? "Confirm with Store"
                    : `₦${Math.round(prod.price_kobo / 100).toLocaleString("en-NG")}`;

                const qty = prod.inventory_records?.[0]?.quantity ?? 0;

                return (
                  <tr
                    key={prod.id}
                    style={{
                      borderBottom: "1px solid var(--line, #E2E8F0)",
                    }}
                  >
                    <td style={{ padding: "12px 16px" }}>
                      <strong style={{ display: "block", color: "var(--navy, #1F2A44)" }}>{prod.name}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--ink-muted, #64748B)" }}>/{prod.slug}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)" }}>
                      {prod.categories?.name || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)" }}>
                      {prod.brands?.name || "—"}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>
                      {prod.price_kobo === null ? (
                        <span
                          style={{
                            background: "#FEF3C7",
                            color: "#92400E",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                          }}
                        >
                          Confirm with Store
                        </span>
                      ) : (
                        priceDisplay
                      )}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background:
                            prod.stock_status === "in_stock"
                              ? "#F0FDF4"
                              : prod.stock_status === "confirm_with_store"
                              ? "#FEF3C7"
                              : "#FEF2F2",
                          color:
                            prod.stock_status === "in_stock"
                              ? "#166534"
                              : prod.stock_status === "confirm_with_store"
                              ? "#92400E"
                              : "#991B1B",
                        }}
                      >
                        {prod.stock_status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                      <span style={{ color: qty <= 2 ? "#DC2626" : "var(--navy, #1F2A44)" }}>{qty} units</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: prod.is_published ? "#166534" : "#64748B",
                        }}
                      >
                        {prod.is_published ? "● Live" : "○ Draft"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          onClick={() => openEditModal(prod)}
                          style={{
                            background: "var(--navy, #1F2A44)",
                            color: "white",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleArchive(prod.id, prod.name)}
                          style={{
                            background: "#FEE2E2",
                            color: "#991B1B",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog for Add / Edit Product */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: "1px solid var(--line, #E2E8F0)",
                paddingBottom: "12px",
              }}
            >
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Create New Product"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#64748B",
                }}
              >
                ×
              </button>
            </div>

            {feedback && (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "6px",
                  marginBottom: "16px",
                  background: feedback.type === "success" ? "#F0FDF4" : "#FEF2F2",
                  color: feedback.type === "success" ? "#166534" : "#991B1B",
                  border: `1px solid ${feedback.type === "success" ? "#86EFAC" : "#FCA5A5"}`,
                  fontSize: "0.875rem",
                }}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Felicity Solar 5kVA Hybrid Inverter"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    URL Slug (auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. felicity-solar-5kva-hybrid-inverter"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="">-- Select Category --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Brand
                  </label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="">-- Select Brand --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Confirm with Store */}
              <div
                style={{
                  background: "#F8FAFC",
                  padding: "14px",
                  borderRadius: "6px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                      Showroom Price (₦ Naira)
                    </label>
                    <input
                      type="number"
                      disabled={confirmPrice}
                      value={priceNaira}
                      onChange={(e) => setPriceNaira(e.target.value)}
                      placeholder="e.g. 750000"
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.875rem",
                        background: confirmPrice ? "#E2E8F0" : "white",
                      }}
                    />
                  </div>

                  <div style={{ paddingTop: "20px" }}>
                    <label
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--navy, #1F2A44)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={confirmPrice}
                        onChange={(e) => {
                          setConfirmPrice(e.target.checked);
                          if (e.target.checked) setPriceNaira("");
                        }}
                      />
                      Mark as &ldquo;Confirm with Store&rdquo; (Dynamic Price)
                    </label>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748B", display: "block", marginTop: "6px" }}>
                  Used for high-volatility items (e.g. imported lithium batteries, solar panels). Stored as NULL in DB.
                </span>
              </div>

              {/* Stock Status & Quantity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Stock Availability Status
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  >
                    <option value="in_stock">In Stock at Jos Store</option>
                    <option value="confirm_with_store">Confirm with Store</option>
                    <option value="out_of_stock">Currently Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    {editingProduct ? "Current Physical Quantity" : "Initial Stock Quantity"}
                  </label>
                  <input
                    type="number"
                    value={initialQuantity}
                    onChange={(e) => setInitialQuantity(e.target.value)}
                    placeholder="e.g. 5"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              {/* Summary & Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                  Key Feature Summary (1-2 sentences)
                </label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="e.g. 48V Pure Sine Wave Inverter with 120A MPPT solar charger."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                  Full Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed technical information, applications, and showroom notes..."
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              {/* Warranty & Image */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Warranty Information
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="e.g. 2 Years Official Warranty"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Image Path or Preset SVG
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="e.g. inverter, battery, tv, ac, freezer, or https://..."
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              {/* Technical Specifications JSON */}
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                  Technical Specifications (JSON format: [&#123;&quot;label&quot;: &quot;...&quot;, &quot;value&quot;: &quot;...&quot;&#125;])
                </label>
                <textarea
                  rows={4}
                  value={specsText}
                  onChange={(e) => setSpecsText(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E1",
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                  }}
                />
              </div>

              {/* Toggles */}
              <div style={{ display: "flex", gap: "24px" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <strong>Publish to Storefront</strong>
                </label>
                <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  <strong>Feature on Homepage</strong>
                </label>
              </div>

              {/* Form buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "12px",
                  borderTop: "1px solid var(--line, #E2E8F0)",
                  paddingTop: "16px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-navy"
                  style={{
                    padding: "10px 24px",
                    fontSize: "0.875rem",
                    cursor: isPending ? "wait" : "pointer",
                  }}
                >
                  {isPending ? "Saving Changes..." : editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
