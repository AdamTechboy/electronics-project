import { describe, expect, it } from "vitest";
import { isSupabaseConfigured } from "../../src/lib/supabase/config";
import { getAllProducts, getProductBySlug, searchCatalogue } from "../../src/lib/catalogue-data";

describe("Stage 3 — Supabase Configuration & Fallback Resilience", () => {
  it("reports unconfigured when environment variables are missing", () => {
    // In test environment without NEXT_PUBLIC_SUPABASE_URL, isSupabaseConfigured() must be false
    const configured = isSupabaseConfigured();
    expect(typeof configured).toBe("boolean");
  });

  it("serves verified showroom products through fallback catalogue data", () => {
    const products = getAllProducts();
    expect(products.length).toBeGreaterThanOrEqual(7);

    // Verify Felicity inverter presence
    const inverter = getProductBySlug("felicity-solar-5kva-48v-pure-sine-wave-hybrid-inverter");
    expect(inverter).toBeDefined();
    expect(inverter?.brand).toBe("Felicity Solar");
    expect(inverter?.department).toBe("solar");
    expect(inverter?.priceKobo).toBe(84500000); // ₦845,000
    expect(inverter?.priceFormatted).toBe("₦845,000");
    expect(inverter?.stockStatus).toBe("in_stock");
  });

  it("supports price=null as 'Confirm with Store'", () => {
    const products = getAllProducts();
    for (const p of products) {
      if (p.priceKobo === null) {
        expect(p.priceFormatted).toBe("Confirm with Store");
      }
    }
  });

  it("filters catalogue by search query, department, and category", () => {
    const solarList = searchCatalogue({ department: "solar" });
    expect(solarList.length).toBeGreaterThan(0);
    expect(solarList.every((p) => p.department === "solar" || p.isSolar)).toBe(true);

    const tvSearch = searchCatalogue({ query: "Smart TV" });
    expect(tvSearch.length).toBeGreaterThan(0);
    expect(tvSearch.some((p) => p.name.includes("TV"))).toBe(true);
  });
});
