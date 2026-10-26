import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

function pepper(): string {
  const value = process.env.INVITATION_TOKEN_PEPPER;
  if (!value || value.length < 32) throw new Error("INVITATION_TOKEN_PEPPER must be configured with a high-entropy secret.");
  return value;
}

export function createInvitationToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashInvitationToken(token) };
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(`${pepper()}:${token}`).digest("hex");
}

export function equalTokenHashes(a: string, b: string): boolean {
  const left = Buffer.from(a, "hex");
  const right = Buffer.from(b, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

// Token persistence, expiry, single-use redemption, revocation, and delivery must be implemented
// transactionally with the database before these primitives are used in a live invitation flow.
