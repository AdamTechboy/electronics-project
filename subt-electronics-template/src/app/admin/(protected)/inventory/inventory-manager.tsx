"use client";

import React, { useState, useTransition } from "react";
import { updateInventoryAction } from "@/server/actions/inventory";
import type { StockMovementReason, StockStatus } from "@/types/database.types";

export interface InventoryItem {
  id: string; // product id
  name: string;
  slug: string;
  stock_status: StockStatus;
  category_name: string;
  brand_name: string;
  quantity: number | null;
  low_stock_threshold: number;
  last_verified_at: string | null;
  note: string | null;
}

export interface StockMovementItem {
  id: string;
  product_name: string;
  previous_quantity: number;
  quantity_change: number;
  resulting_quantity: number;
  reason: string;
  notes: string | null;
  created_at: string;
}

interface InventoryManagerProps {
  items: InventoryItem[];
  recentMovements: StockMovementItem[];
}

export function InventoryManager({ items, recentMovements }: InventoryManagerProps) {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const [quantity, setQuantity] = useState("0");
  const [lowStockThreshold, setLowStockThreshold] = useState("3");
  const [reason, setReason] = useState<StockMovementReason>("restock");
  const [notes, setNotes] = useState("");

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function openUpdateModal(item: InventoryItem) {
    setSelectedProduct(item);
    setQuantity(String(item.quantity ?? 0));
    setLowStockThreshold(String(item.low_stock_threshold || 3));
    setReason("restock");
    setNotes("");
    setFeedback(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedProduct) return;
    setFeedback(null);

    const formData = new FormData();
    formData.set("product_id", selectedProduct.id);
    formData.set("quantity", quantity);
    formData.set("low_stock_threshold", lowStockThreshold);
    formData.set("reason", reason);
    formData.set("notes", notes);

    startTransition(async () => {
      const res = await updateInventoryAction(formData);
      if (!res.success) {
        setFeedback({ type: "error", message: res.error || "Failed to update inventory." });
      } else {
        setFeedback({ type: "success", message: "Inventory successfully updated!" });
        setTimeout(() => setSelectedProduct(null), 700);
      }
    });
  }

  const filtered = items.filter(
    (item) =>
      search.trim() === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.slug.toLowerCase().includes(search.toLowerCase()) ||
      item.category_name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: "0 0 4px" }}>
          Inventory & Stock Management
        </h1>
        <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.875rem", margin: 0 }}>
          Manage showroom stock quantities, low-stock alerts, and track historical stock adjustments.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Filter inventory by product name, category, or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            maxWidth: "400px",
            width: "100%",
            padding: "10px 14px",
            borderRadius: "6px",
            border: "1px solid var(--line-strong, #CBD5E1)",
            fontSize: "0.875rem",
          }}
        />
      </div>

      {/* Inventory Table */}
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-md, 8px)",
          border: "1px solid var(--line, #E2E8F0)",
          overflowX: "auto",
          marginBottom: "32px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ background: "var(--bg-warm, #F7F5F0)", borderBottom: "1px solid var(--line, #E2E8F0)" }}>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Product</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Category</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Brand</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Current Qty</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Alert Threshold</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Stock Health</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "32px", textAlign: "center", color: "var(--ink-muted, #64748B)" }}>
                  No inventory records found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const qty = item.quantity ?? 0;
                const isLow = qty <= item.low_stock_threshold;

                return (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--line, #E2E8F0)" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <strong style={{ display: "block", color: "var(--navy, #1F2A44)" }}>{item.name}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--ink-muted, #64748B)" }}>/{item.slug}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)" }}>
                      {item.category_name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)" }}>
                      {item.brand_name}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 800, fontSize: "1rem" }}>
                      <span style={{ color: isLow ? "#DC2626" : "var(--navy, #1F2A44)" }}>{qty}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)" }}>
                      {item.low_stock_threshold} units
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          padding: "3px 8px",
                          borderRadius: "4px",
                          background: isLow ? "#FEF2F2" : "#F0FDF4",
                          color: isLow ? "#991B1B" : "#166534",
                        }}
                      >
                        {isLow ? "⚠️ Low Stock" : "✓ In Stock"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <button
                        onClick={() => openUpdateModal(item)}
                        className="btn btn-navy"
                        style={{ padding: "6px 12px", fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stock Movement History Section */}
      <div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy, #1F2A44)", marginBottom: "12px" }}>
          Recent Stock Adjustment Log
        </h2>
        <div
          style={{
            background: "white",
            borderRadius: "var(--radius-md, 8px)",
            border: "1px solid var(--line, #E2E8F0)",
            overflowX: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.8125rem" }}>
            <thead>
              <tr style={{ background: "var(--bg-warm, #F7F5F0)", borderBottom: "1px solid var(--line, #E2E8F0)" }}>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Timestamp</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Product</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Reason</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Change</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Resulting Qty</th>
                <th style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Staff Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "var(--ink-muted, #64748B)" }}>
                    No stock movements recorded yet.
                  </td>
                </tr>
              ) : (
                recentMovements.map((m) => (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--line, #E2E8F0)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--ink-muted, #64748B)" }}>
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>
                      {m.product_name}
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <span
                        style={{
                          textTransform: "uppercase",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          background: "#F1F5F9",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {m.reason}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 700, color: m.quantity_change >= 0 ? "#166534" : "#991B1B" }}>
                      {m.quantity_change >= 0 ? `+${m.quantity_change}` : m.quantity_change}
                    </td>
                    <td style={{ padding: "10px 14px", fontWeight: 700 }}>{m.resulting_quantity}</td>
                    <td style={{ padding: "10px 14px", color: "var(--ink-secondary, #475569)" }}>
                      {m.notes || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update Modal */}
      {selectedProduct && (
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
              maxWidth: "480px",
              width: "100%",
              padding: "24px",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "1px solid var(--line, #E2E8F0)",
                paddingBottom: "10px",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
                  Update Physical Inventory
                </h2>
                <span style={{ fontSize: "0.8125rem", color: "var(--ink-secondary, #475569)" }}>
                  {selectedProduct.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                style={{ background: "transparent", border: "none", fontSize: "1.4rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            {feedback && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: "6px",
                  marginBottom: "14px",
                  background: feedback.type === "success" ? "#F0FDF4" : "#FEF2F2",
                  color: feedback.type === "success" ? "#166534" : "#991B1B",
                  fontSize: "0.875rem",
                }}
              >
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                    Verified Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
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

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                  Adjustment Reason *
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as StockMovementReason)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="restock">Restock / New Shipment Received</option>
                  <option value="correction">Audit Stock Count Correction</option>
                  <option value="sale_enquiry">Showroom Unit Sold</option>
                  <option value="damage">Damaged or Defective Item</option>
                  <option value="other">Other Administrative Reason</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                  Staff Notes / Invoice Ref
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Batch #401 from Luminous Kano depot"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "8px",
                  borderTop: "1px solid var(--line, #E2E8F0)",
                  paddingTop: "14px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    background: "#F1F5F9",
                    color: "#475569",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-navy"
                  style={{ padding: "8px 20px", fontSize: "0.875rem", cursor: isPending ? "wait" : "pointer" }}
                >
                  {isPending ? "Updating..." : "Save Stock Level"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
