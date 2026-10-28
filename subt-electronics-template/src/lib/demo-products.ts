// ==============================================================================
// Muhammad Kairu Electronics — Demo Products Adapter (Legacy & Compatibility)
// Re-exports typed catalogue fixtures from src/lib/catalogue-data.ts
// ==============================================================================

import { PRODUCTS, CATEGORIES, type CatalogueProduct } from "./catalogue-data";

export type DemoProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number | null;
  stockStatus: "confirm" | "in-stock" | "out-of-stock";
  summary: string;
  specifications: { label: string; value: string }[];
  imageSvg?: string;
  priceFormatted?: string;
};

function mapStockStatus(status: CatalogueProduct["stockStatus"]): "confirm" | "in-stock" | "out-of-stock" {
  switch (status) {
    case "in_stock":
      return "in-stock";
    case "out_of_stock":
      return "out-of-stock";
    default:
      return "confirm";
  }
}

export const demoProducts: DemoProduct[] = PRODUCTS.map((p) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  brand: p.brand,
  price: p.priceKobo ? p.priceKobo / 100 : null,
  stockStatus: mapStockStatus(p.stockStatus),
  summary: p.summary,
  specifications: p.specifications,
  imageSvg: p.imageSvg,
  priceFormatted: p.priceFormatted,
}));

export const demoCategories = CATEGORIES.map((c) => c.name);
