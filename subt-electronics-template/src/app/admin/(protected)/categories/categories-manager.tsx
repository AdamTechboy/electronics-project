"use client";

import React, { useState, useTransition } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/server/actions/categories";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  function openCreateModal() {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setSortOrder("0");
    setIsActive(true);
    setFeedback(null);
    setModalOpen(true);
  }

  function openEditModal(c: CategoryItem) {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || "");
    setSortOrder(String(c.sort_order));
    setIsActive(c.is_active);
    setFeedback(null);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    if (editingCategory) formData.set("id", editingCategory.id);
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("sort_order", sortOrder);
    if (isActive) formData.set("is_active", "on");

    startTransition(async () => {
      const res = editingCategory
        ? await updateCategoryAction(formData)
        : await createCategoryAction(formData);

      if (!res.success) {
        setFeedback({ type: "error", message: res.error || "Action failed." });
      } else {
        setFeedback({
          type: "success",
          message: editingCategory ? "Category updated!" : "Category created!",
        });
        setTimeout(() => setModalOpen(false), 700);
      }
    });
  }

  function handleDelete(id: string, catName: string) {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (!res.success) {
        alert(res.error || "Delete failed.");
      }
    });
  }

  return (
    <div>
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
            Category Taxonomy Management
          </h1>
          <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.875rem", margin: 0 }}>
            Organize departments, navigation hierarchy, and storefront filter groupings.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn btn-primary"
          style={{ padding: "10px 18px", fontSize: "0.875rem", cursor: "pointer" }}
        >
          + Add New Category
        </button>
      </div>

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
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Category Name</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Slug</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Description</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Sort Order</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Status</th>
              <th style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)", textAlign: "right" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {initialCategories.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "var(--ink-muted, #64748B)" }}>
                  No categories configured.
                </td>
              </tr>
            ) : (
              initialCategories.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--line, #E2E8F0)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)" }}>/{c.slug}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-secondary, #475569)", maxWidth: "300px" }}>
                    {c.description || "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{c.sort_order}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "4px",
                        background: c.is_active ? "#F0FDF4" : "#FEF2F2",
                        color: c.is_active ? "#166534" : "#991B1B",
                      }}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "8px" }}>
                      <button
                        onClick={() => openEditModal(c)}
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
                        onClick={() => handleDelete(c.id, c.name)}
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
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
              maxWidth: "520px",
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
              <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create Category"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
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
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "4px" }}>
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Solar & Power Solutions"
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
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. solar-power-solutions"
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
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for storefront category cards..."
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
                  Sort Order
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.875rem", cursor: "pointer" }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <strong>Active on Storefront</strong>
              </label>

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
                  onClick={() => setModalOpen(false)}
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
                  {isPending ? "Saving..." : editingCategory ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
