import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface AuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  target_entity: string;
  target_id: string | null;
  details: unknown;
  ip_address: string | null;
  created_at: string;
}

export default async function AdminAuditLogPage() {
  let logs: AuditLogRow[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (!error && data) {
        logs = data as unknown as AuditLogRow[];
      }
    } catch (err) {
      console.warn("Audit logs query failed:", err);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--navy, #1F2A44)", margin: "0 0 4px" }}>
          Security & Operational Audit Log
        </h1>
        <p style={{ color: "var(--ink-secondary, #475569)", fontSize: "0.875rem", margin: 0 }}>
          Immutable log of administrative operations, catalog changes, price edits, and staff logins.
        </p>
      </div>

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
              <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Timestamp</th>
              <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Action</th>
              <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Target Entity</th>
              <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Target ID</th>
              <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--navy, #1F2A44)" }}>Action Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "32px", textAlign: "center", color: "var(--ink-muted, #64748B)" }}>
                  No audit entries recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                let detailsStr = "{}";
                try {
                  detailsStr = JSON.stringify(log.details, null, 2);
                } catch {
                  detailsStr = String(log.details);
                }

                return (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--line, #E2E8F0)" }}>
                    <td style={{ padding: "12px 14px", color: "var(--ink-muted, #64748B)", whiteSpace: "nowrap" }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: "#F1F5F9",
                          color: "var(--navy, #1F2A44)",
                          padding: "3px 8px",
                          borderRadius: "4px",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{log.target_entity}</td>
                    <td style={{ padding: "12px 14px", color: "var(--ink-secondary, #475569)", fontFamily: "monospace" }}>
                      {log.target_id || "—"}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <pre
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          background: "var(--bg-warm, #F7F5F0)",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          maxWidth: "380px",
                          maxHeight: "80px",
                          overflowY: "auto",
                        }}
                      >
                        {detailsStr}
                      </pre>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
