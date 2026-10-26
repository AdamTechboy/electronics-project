import { describe, expect, it } from "vitest";
import { hasPermission } from "../../src/server/auth/roles";

describe("role permissions", () => {
  it("limits enquiry staff to enquiry and product read access", () => {
    expect(hasPermission("ENQUIRY_STAFF", "enquiries:read")).toBe(true);
    expect(hasPermission("ENQUIRY_STAFF", "products:read")).toBe(true);
    expect(hasPermission("ENQUIRY_STAFF", "prices:write")).toBe(false);
    expect(hasPermission("ENQUIRY_STAFF", "admins:manage")).toBe(false);
  });

  it("does not grant unknown permissions", () => {
    expect(hasPermission("STORE_ADMIN", "payments:write")).toBe(false);
  });
});
