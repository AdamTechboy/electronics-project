"use client";

import React, { useState, useTransition } from "react";
import { updateEnquiryStatusAction, addEnquiryNoteAction } from "@/server/actions/enquiries";
import type { EnquiryStatus } from "@/types/database.types";

export interface EnquiryItem {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  product_name: string | null;
  message: string;
  status: EnquiryStatus;
  created_at: string;
  notes?: Array<{ id: string; note: string; created_at: string }>;
}

export function EnquiriesManager({ initialEnquiries }: { initialEnquiries: EnquiryItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [activeEnquiry, setActiveEnquiry] = useState<EnquiryItem | null>(null);
  const [newNote, setNewNote] = useState("");

  const [isPending, startTransition] = useTransition();

  const filtered = initialEnquiries.filter((e) => {
    const matchesFilter = filter === "all" || e.status === filter;
    const matchesSearch =
      search.trim() === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.reference.toLowerCase().includes(search.toLowerCase()) ||
      (e.product_name && e.product_name.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  function handleStatusChange(enquiryId: string, newStatus: EnquiryStatus) {
    startTransition(async () => {
      await updateEnquiryStatusAction(enquiryId, newStatus);
    });
  }

  function handleAddNote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!activeEnquiry || !newNote.trim()) return;

    const formData = new FormData();
    formData.set("enquiry_id", activeEnquiry.id);
    formData.set("note", newNote.trim());

    startTransition(async () => {
      const res = await addEnquiryNoteAction(formData);
      if (res.success) {
        setNewNote("");
        setActiveEnquiry(null);
      } else {
        alert(res.error || "Failed to add note.");
      }
    });
  }

  function cleanPhoneForWhatsApp(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
      return "234" + digits.substring(1);
    }
    return digits;
  }

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: "0 0 4px" }}>
          Customer Enquiry Inbox & CRM
        </h1>
        <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.875rem", margin: 0 }}>
          Direct customer leads submitted from public storefront product pages and contact forms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {["all", "new", "contacted", "in_progress", "resolved", "closed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: "6px 14px",
                borderRadius: "4px",
                border: "none",
                fontSize: "0.8125rem",
                fontWeight: 700,
                cursor: "pointer",
                background: filter === st ? "var(--navy, #1F2A44)" : "white",
                color: filter === st ? "white" : "var(--ink-secondary, #475569)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                textTransform: "capitalize",
              }}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name, phone or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #CBD5E1",
            fontSize: "0.875rem",
            minWidth: "260px",
          }}
        />
      </div>

      {/* Enquiries List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filtered.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "48px 24px",
              textAlign: "center",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              color: "#64748B",
            }}
          >
            No enquiries found in this category.
          </div>
        ) : (
          filtered.map((enq) => {
            const waPhone = cleanPhoneForWhatsApp(enq.phone);
            const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
              `Hello ${enq.name}, thank you for reaching out to Muhammad Kairu Electronics (Jos). Regarding your enquiry [${enq.reference}] on "${enq.product_name || "our products"}":`
            )}`;

            return (
              <div
                key={enq.id}
                style={{
                  background: "white",
                  borderRadius: "8px",
                  border: "1px solid var(--line, #E2E8F0)",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "10px",
                    borderBottom: "1px solid #F1F5F9",
                    paddingBottom: "10px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <strong style={{ fontSize: "1.05rem", color: "var(--navy, #1F2A44)" }}>{enq.name}</strong>
                      <span
                        style={{
                          background: "#F1F5F9",
                          color: "#475569",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {enq.reference}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#64748B", marginTop: "2px" }}>
                      📞 {enq.phone} {enq.email ? ` · ✉️ ${enq.email}` : ""} · Received:{" "}
                      {new Date(enq.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-whatsapp"
                      style={{ padding: "6px 12px", fontSize: "0.78rem", textDecoration: "none" }}
                    >
                      💬 WhatsApp Customer
                    </a>

                    <select
                      value={enq.status}
                      disabled={isPending}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value as EnquiryStatus)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "4px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        background:
                          enq.status === "new"
                            ? "#FEF2F2"
                            : enq.status === "resolved"
                            ? "#F0FDF4"
                            : "#F8FAFC",
                        color:
                          enq.status === "new"
                            ? "#991B1B"
                            : enq.status === "resolved"
                            ? "#166534"
                            : "#334155",
                      }}
                    >
                      <option value="new">Status: New</option>
                      <option value="contacted">Status: Contacted</option>
                      <option value="in_progress">Status: In Progress</option>
                      <option value="resolved">Status: Resolved</option>
                      <option value="closed">Status: Closed</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setActiveEnquiry(enq)}
                      style={{
                        background: "#F1F5F9",
                        color: "#334155",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "0.8125rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      + Note
                    </button>
                  </div>
                </div>

                {/* Product Name tag if specified */}
                {enq.product_name && (
                  <div style={{ fontSize: "0.8125rem", color: "var(--navy, #1F2A44)", fontWeight: 700 }}>
                    🏷️ Product of interest: <span style={{ color: "#D97706" }}>{enq.product_name}</span>
                  </div>
                )}

                {/* Message body */}
                <div
                  style={{
                    background: "var(--bg-warm, #F7F5F0)",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    color: "var(--ink-secondary, #334155)",
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;{enq.message}&rdquo;
                </div>

                {/* Existing Notes */}
                {enq.notes && enq.notes.length > 0 && (
                  <div style={{ marginTop: "6px", paddingLeft: "8px", borderLeft: "2px solid #CBD5E1" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", marginBottom: "4px" }}>
                      Internal Staff Notes:
                    </div>
                    {enq.notes.map((n) => (
                      <div key={n.id} style={{ fontSize: "0.8125rem", color: "#334155", marginBottom: "2px" }}>
                        • {n.note}{" "}
                        <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                          ({new Date(n.created_at).toLocaleDateString()})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Note Modal */}
      {activeEnquiry && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
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
              maxWidth: "460px",
              width: "100%",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--navy, #1F2A44)" }}>
                Add Note for {activeEnquiry.name}
              </h3>
              <button
                onClick={() => setActiveEnquiry(null)}
                style={{ background: "transparent", border: "none", fontSize: "1.3rem", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddNote} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <textarea
                required
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Spoke on phone. Customer confirmed 5kVA system for Bukuru residence, sending proforma invoice on WhatsApp."
                style={{ width: "100%", padding: "8px 12px", borderRadius: "4px", border: "1px solid #CBD5E1" }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => setActiveEnquiry(null)}
                  style={{ background: "#F1F5F9", border: "none", padding: "8px 14px", borderRadius: "4px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-navy"
                  style={{ padding: "8px 18px", fontSize: "0.875rem" }}
                >
                  {isPending ? "Saving..." : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
