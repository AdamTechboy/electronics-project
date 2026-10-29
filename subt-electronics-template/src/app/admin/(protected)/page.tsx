import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminOverviewPage() {
  let productCount = 0;
  let categoryCount = 0;
  let brandCount = 0;
  let enquiryCount = 0;
  let lowStockCount = 0;
  let recentEnquiries: Array<{
    id: string;
    reference: string;
    name: string;
    phone: string;
    product_name: string | null;
    status: string;
    created_at: string;
  }> = [];
  let recentAuditLogs: Array<{
    id: string;
    action: string;
    target_entity: string;
    created_at: string;
  }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      const [productsRes, categoriesRes, brandsRes, enquiriesRes, lowStockRes, auditRes] =
        await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }).eq("is_archived", false),
          supabase.from("categories").select("id", { count: "exact", head: true }),
          supabase.from("brands").select("id", { count: "exact", head: true }),
          supabase.from("enquiries").select("id, reference, name, phone, product_name, status, created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("inventory_records").select("id, quantity, low_stock_threshold"),
          supabase.from("audit_logs").select("id, action, target_entity, created_at").order("created_at", { ascending: false }).limit(5),
        ]);

      productCount = productsRes.count ?? 0;
      categoryCount = categoriesRes.count ?? 0;
      brandCount = brandsRes.count ?? 0;

      if (enquiriesRes.data) {
        recentEnquiries = enquiriesRes.data;
        enquiryCount = enquiriesRes.data.filter((e) => e.status === "new" || e.status === "contacted").length;
      }

      if (lowStockRes.data) {
        lowStockCount = lowStockRes.data.filter(
          (r) => r.quantity !== null && r.quantity <= r.low_stock_threshold
        ).length;
      }

      if (auditRes.data) {
        recentAuditLogs = auditRes.data;
      }
    } catch (err) {
      console.warn("Admin overview data fetch error:", err);
    }
  }

  const kpis = [
    { label: "Active Products", value: productCount, icon: "📦", href: "/admin/products", color: "#1F2A44" },
    { label: "Categories", value: categoryCount, icon: "📑", href: "/admin/categories", color: "#2563EB" },
    { label: "Brands", value: brandCount, icon: "🏷️", href: "/admin/brands", color: "#7C3AED" },
    { label: "Pending Enquiries", value: enquiryCount, icon: "✉️", href: "/admin/enquiries", color: enquiryCount > 0 ? "#DC2626" : "#059669" },
    { label: "Low Stock Items", value: lowStockCount, icon: "⚠️", href: "/admin/inventory", color: lowStockCount > 0 ? "#D97706" : "#059669" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* Top Banner */}
      <div
        style={{
          background: "white",
          borderRadius: "var(--radius-md, 8px)",
          border: "1px solid var(--line, #E2E8F0)",
          padding: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--amber, #F5A623)", textTransform: "uppercase" }}>
            Operational Command Center
          </span>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: "4px 0" }}>
            Store Administration Overview
          </h1>
          <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.9375rem", margin: 0 }}>
            Manage Muhammad Kairu Electronics inventory, product catalogue, customer enquiries, and branch settings.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Link
            href="/admin/products"
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: "0.875rem", textDecoration: "none" }}
          >
            + Add New Product
          </Link>
          <Link
            href="/admin/inventory"
            className="btn btn-navy"
            style={{ padding: "10px 18px", fontSize: "0.875rem", textDecoration: "none" }}
          >
            Update Inventory
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            style={{
              background: "white",
              borderRadius: "var(--radius-md, 8px)",
              border: "1px solid var(--line, #E2E8F0)",
              padding: "20px",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.05))",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--ink-secondary, #475569)" }}>
                {kpi.label}
              </span>
              <span style={{ fontSize: "1.25rem" }}>{kpi.icon}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: kpi.color, lineHeight: 1 }}>
              {kpi.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout: Recent Enquiries & Audit Logs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Recent Enquiries Card */}
        <div
          style={{
            background: "white",
            borderRadius: "var(--radius-md, 8px)",
            border: "1px solid var(--line, #E2E8F0)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: "1px solid var(--line, #E2E8F0)",
              paddingBottom: "12px",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
              Recent Customer Enquiries
            </h2>
            <Link
              href="/admin/enquiries"
              style={{ fontSize: "0.8125rem", color: "var(--navy, #1F2A44)", fontWeight: 700 }}
            >
              View All →
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p style={{ color: "var(--ink-muted, #64748B)", fontSize: "0.875rem", padding: "16px 0" }}>
              No enquiries logged yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  style={{
                    padding: "10px 12px",
                    background: "var(--bg-warm, #F7F5F0)",
                    borderRadius: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--navy, #1F2A44)" }}>
                      {enq.name}{" "}
                      <span style={{ fontWeight: 400, color: "var(--ink-secondary, #475569)", fontSize: "0.8rem" }}>
                        ({enq.phone})
                      </span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-muted, #64748B)" }}>
                      {enq.product_name ? `Product: ${enq.product_name}` : "General Enquiry"} · {enq.reference}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: enq.status === "new" ? "#FEF2F2" : "#F0FDF4",
                      color: enq.status === "new" ? "#991B1B" : "#166534",
                      textTransform: "uppercase",
                    }}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Trail Card */}
        <div
          style={{
            background: "white",
            borderRadius: "var(--radius-md, 8px)",
            border: "1px solid var(--line, #E2E8F0)",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              borderBottom: "1px solid var(--line, #E2E8F0)",
              paddingBottom: "12px",
            }}
          >
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: 0 }}>
              Recent Security Audit Trail
            </h2>
            <Link
              href="/admin/audit-log"
              style={{ fontSize: "0.8125rem", color: "var(--navy, #1F2A44)", fontWeight: 700 }}
            >
              View Full Log →
            </Link>
          </div>

          {recentAuditLogs.length === 0 ? (
            <p style={{ color: "var(--ink-muted, #64748B)", fontSize: "0.875rem", padding: "16px 0" }}>
              No audit logs recorded yet.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: "10px 12px",
                    borderLeft: "3px solid var(--navy, #1F2A44)",
                    background: "var(--bg-warm, #F7F5F0)",
                    borderRadius: "0 6px 6px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.8125rem", color: "var(--navy, #1F2A44)" }}>
                      {log.action}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--ink-secondary, #475569)" }}>
                      Entity: {log.target_entity}
                    </div>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--ink-muted, #64748B)" }}>
                    {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
