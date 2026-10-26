import { describe, expect, it } from "vitest";
import { tenantConfigSchema } from "../../src/config/schema";

describe("tenant config schema", () => {
  it("rejects enabled online checkout in initial release", () => {
    const result = tenantConfigSchema.safeParse({
      tenantId: "test-tenant",
      brand: { name: "Test", primaryColor: "#123456", accentColor: "#abcdef" },
      contact: {},
      features: { catalogue: true, enquiries: true, inventoryManagement: true, onlineCheckout: true, customerAccounts: false },
      seo: { siteUrl: "https://example.test", defaultTitle: "Test", defaultDescription: "Test site" }
    });
    expect(result.success).toBe(false);
  });
});
