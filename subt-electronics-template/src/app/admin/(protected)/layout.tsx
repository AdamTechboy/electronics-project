import React from "react";
import Link from "next/link";
import { requireAdminPage } from "@/server/auth/guards";
import { signOutAdminAction } from "@/server/actions/auth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireAdminPage();

  const roleLabelMap: Record<string, string> = {
    owner: "Owner & Director",
    product_manager: "Product Manager",
    inventory_manager: "Inventory Manager",
    customer_support: "Customer Support",
    marketing_manager: "Marketing Lead",
    viewer: "Read-Only Staff",
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: "📊" },
    { label: "Products", href: "/admin/products", icon: "📦" },
    { label: "Categories", href: "/admin/categories", icon: "📑" },
    { label: "Brands", href: "/admin/brands", icon: "🏷️" },
    { label: "Inventory", href: "/admin/inventory", icon: "📋" },
    { label: "Enquiries", href: "/admin/enquiries", icon: "✉️" },
    { label: "Store Settings", href: "/admin/settings", icon: "⚙️" },
    { label: "Audit Log", href: "/admin/audit-log", icon: "📜" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-warm, #F7F5F0)", display: "flex", flexDirection: "column" }}>
      {/* Top Admin Header Bar */}
      <header
        style={{
          background: "var(--navy, #1F2A44)",
          color: "white",
          borderBottom: "3px solid var(--amber, #F5A623)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {/* Logo & Portal Identity */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link
              href="/admin"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                color: "white",
              }}
            >
              <div
                style={{
                  background: "var(--amber, #F5A623)",
                  color: "var(--navy, #1F2A44)",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  width: "36px",
                  height: "36px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                MK
              </div>
              <div>
                <strong style={{ fontSize: "1rem", letterSpacing: "0.02em", display: "block", lineHeight: 1.2 }}>
                  Muhammad Kairu Electronics
                </strong>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)" }}>
                  Admin Portal · Jos Showroom
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile & Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: "0.8125rem",
                color: "white",
                background: "rgba(255,255,255,0.12)",
                padding: "6px 12px",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span>🌐</span> View Public Store
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8125rem" }}>
              <span
                style={{
                  background: "var(--amber, #F5A623)",
                  color: "var(--navy, #1F2A44)",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                }}
              >
                {roleLabelMap[auth.role] ?? auth.role}
              </span>
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{auth.user.email}</span>
            </div>

            <form action={signOutAdminAction}>
              <button
                type="submit"
                style={{
                  background: "#DC2626",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ background: "rgba(0,0,0,0.18)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 16px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.9)",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, padding: "24px 0 60px" }}>
        <div className="container">{children}</div>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: "white",
          borderTop: "1px solid var(--line, #E2E8F0)",
          padding: "16px 0",
          fontSize: "0.8125rem",
          color: "var(--ink-muted, #64748B)",
          textAlign: "center",
        }}
      >
        <div className="container">
          Muhammad Kairu Electronics · Operational Admin Console · All mutations recorded in audit log.
        </div>
      </footer>
    </div>
  );
}
