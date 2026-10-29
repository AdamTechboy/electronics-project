import "server-only";

export type AuditAction =
  | "ADMIN_INVITATION_CREATED"
  | "ADMIN_INVITATION_REDEEMED"
  | "ADMIN_LOGIN_SUCCEEDED"
  | "ADMIN_LOGIN_FAILED"
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_ARCHIVED"
  | "PRICE_UPDATED"
  | "INVENTORY_UPDATED"
  | "ENQUIRY_STATUS_UPDATED"
  | "SETTINGS_UPDATED";

// Persistence adapter intentionally not connected yet. Audit payloads must exclude passwords,
// invitation tokens, session IDs, payment data, and unnecessary customer PII.
export type AuditEventInput = {
  tenantId: string;
  actorAdminId?: string;
  action: AuditAction;
  targetType?: string;
  targetId?: string;
  requestId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function recordAuditEvent(_event: AuditEventInput): Promise<void> {
  void _event;
  throw new Error("Audit persistence is not configured; sensitive mutations must remain disabled.");
}
