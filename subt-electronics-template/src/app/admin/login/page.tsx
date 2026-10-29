"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { signInAdminAction, type AuthState } from "@/server/actions/auth";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState<AuthState | null, FormData>(
    signInAdminAction,
    null
  );

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "white",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-md)",
          padding: "36px 32px",
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            className="brand-badge"
            style={{ width: "48px", height: "48px", margin: "0 auto 12px", fontSize: "1.2rem" }}
          >
            MK
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--navy)", marginBottom: "4px" }}>
            Admin Control Portal
          </h1>
          <p style={{ color: "var(--ink-secondary)", fontSize: "0.875rem" }}>
            Muhammad Kairu Electronics · Jos Showroom
          </p>
        </div>

        {/* Error Notice */}
        {state?.error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FCA5A5",
              color: "#991B1B",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              fontSize: "0.875rem",
              marginBottom: "20px",
              lineHeight: 1.45,
            }}
            role="alert"
          >
            <strong>Error:</strong> {state.error}
          </div>
        )}

        {/* Sign In Form */}
        <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: "6px",
              }}
            >
              Staff Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="e.g. mkelectronics@gmail.com"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line-strong)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--line-strong)",
                fontSize: "0.9375rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-navy"
            style={{
              width: "100%",
              padding: "13px",
              marginTop: "8px",
              cursor: isPending ? "wait" : "pointer",
            }}
          >
            {isPending ? "Authenticating..." : "Sign In to Admin Portal"}
          </button>
        </form>

        {/* Operational Security & Bootstrap Helper */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "20px",
            borderTop: "1px solid var(--line)",
            fontSize: "0.78rem",
            color: "var(--ink-muted)",
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "var(--navy)", display: "block", marginBottom: "4px" }}>
            🔒 Role-Enforced Access
          </strong>
          Access is strictly restricted to active store employees. For first-time setup after deploying
          migrations, create your user in Supabase Auth and execute:
          <code
            style={{
              display: "block",
              background: "var(--bg-warm)",
              padding: "6px 8px",
              borderRadius: "4px",
              marginTop: "6px",
              wordBreak: "break-all",
              color: "var(--navy)",
            }}
          >
            SELECT public.bootstrap_first_owner(&apos;mkelectronics@gmail.com&apos;);
          </code>
        </div>

        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <Link href="/" style={{ fontSize: "0.8125rem", color: "var(--navy)", fontWeight: 700 }}>
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
