import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  type CatalogueProduct,
  type CatalogueCategory,
  type CatalogueBrand,
  type DepartmentType,
  type StockStatusType,
  STORE_INFO,
  CATEGORIES,
  BRANDS,
  PRODUCTS,
} from "./catalogue-data";

export interface DynamicStoreSettings {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  deliveryInfo: string | null;
  warrantyPolicy: string | null;
  aboutText: string | null;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Maps a database product row (with category, brand, images) to a storefront CatalogueProduct.
 */
function mapDatabaseProduct(row: {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string | null;
  price_kobo: number | null;
  stock_status: string;
  warranty_details: string | null;
  is_featured: boolean;
  specifications: unknown;
  categories: { name: string; slug: string } | null;
  brands: { name: string; slug: string } | null;
  product_images?: Array<{ storage_path: string; is_primary: boolean }> | null;
}): CatalogueProduct {
  const brandName = row.brands?.name || "Muhammad Kairu";
  const brandSlug = row.brands?.slug || "mk";
  const categoryName = row.categories?.name || "General Electronics";
  const categorySlug = row.categories?.slug || "electronics";

  const isSolar =
    categorySlug.includes("solar") ||
    categoryName.toLowerCase().includes("solar") ||
    row.name.toLowerCase().includes("solar") ||
    row.name.toLowerCase().includes("inverter") ||
    row.name.toLowerCase().includes("battery");

  const department: DepartmentType = isSolar ? "solar" : "electronics";

  // Price formatting
  let priceFormatted = "Confirm with Store";
  if (typeof row.price_kobo === "number" && row.price_kobo > 0) {
    const naira = Math.round(row.price_kobo / 100);
    priceFormatted = `₦${naira.toLocaleString("en-NG")}`;
  }

  // Stock status label
  const rawStatus = row.stock_status as StockStatusType;
  let stockLabel = "In Stock at Jos Store";
  if (rawStatus === "confirm_with_store") {
    stockLabel = "Confirm with Store";
  } else if (rawStatus === "out_of_stock") {
    stockLabel = "Currently Out of Stock";
  }

  // Specifications parsing
  let specifications: Array<{ label: string; value: string }> = [];
  if (Array.isArray(row.specifications)) {
    specifications = row.specifications as Array<{ label: string; value: string }>;
  } else if (row.specifications && typeof row.specifications === "object") {
    specifications = Object.entries(row.specifications).map(([label, value]) => ({
      label,
      value: String(value),
    }));
  }

  // Primary image
  let imageSvg = isSolar ? "inverter" : "tv";
  const primaryImg = row.product_images?.find((img) => img.is_primary) || row.product_images?.[0];
  if (primaryImg?.storage_path) {
    imageSvg = primaryImg.storage_path;
  }

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: brandName,
    brandSlug,
    category: categoryName,
    categorySlug,
    department,
    priceKobo: row.price_kobo,
    priceFormatted,
    stockStatus: rawStatus,
    stockLabel,
    summary: row.summary,
    description: row.description || row.summary,
    isFeatured: Boolean(row.is_featured),
    isSolar,
    specifications,
    imageSvg,
    warrantySummary: row.warranty_details || "Verified Official Warranty",
  };
}

/**
 * Fetch dynamic store settings, falling back to static config.
 */
export async function getStoreSettings(): Promise<DynamicStoreSettings> {
  if (!isSupabaseConfigured()) {
    return {
      name: STORE_INFO.name,
      tagline: STORE_INFO.tagline,
      address: STORE_INFO.address,
      phone: STORE_INFO.phone,
      phoneDisplay: STORE_INFO.phoneDisplay,
      whatsapp: STORE_INFO.whatsapp,
      email: STORE_INFO.email,
      openingHours: STORE_INFO.openingHours,
      deliveryInfo: null,
      warrantyPolicy: null,
      aboutText: null,
      primaryColor: STORE_INFO.primaryColor,
      secondaryColor: STORE_INFO.secondaryColor,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return {
        name: STORE_INFO.name,
        tagline: STORE_INFO.tagline,
        address: STORE_INFO.address,
        phone: STORE_INFO.phone,
        phoneDisplay: STORE_INFO.phoneDisplay,
        whatsapp: STORE_INFO.whatsapp,
        email: STORE_INFO.email,
        openingHours: STORE_INFO.openingHours,
        deliveryInfo: null,
        warrantyPolicy: null,
        aboutText: null,
        primaryColor: STORE_INFO.primaryColor,
        secondaryColor: STORE_INFO.secondaryColor,
      };
    }

    return {
      name: data.business_name || STORE_INFO.name,
      tagline: data.tagline || STORE_INFO.tagline,
      address: data.address || STORE_INFO.address,
      phone: data.phone || STORE_INFO.phone,
      phoneDisplay: data.phone || STORE_INFO.phoneDisplay,
      whatsapp: data.whatsapp || STORE_INFO.whatsapp,
      email: data.email || STORE_INFO.email,
      openingHours: data.opening_hours || STORE_INFO.openingHours,
      deliveryInfo: data.delivery_info,
      warrantyPolicy: data.warranty_policy,
      aboutText: data.about_text,
      primaryColor: data.primary_color || STORE_INFO.primaryColor,
      secondaryColor: data.secondary_color || STORE_INFO.secondaryColor,
    };
  } catch (err) {
    console.warn("Store settings query failed, falling back:", err);
    return {
      name: STORE_INFO.name,
      tagline: STORE_INFO.tagline,
      address: STORE_INFO.address,
      phone: STORE_INFO.phone,
      phoneDisplay: STORE_INFO.phoneDisplay,
      whatsapp: STORE_INFO.whatsapp,
      email: STORE_INFO.email,
      openingHours: STORE_INFO.openingHours,
      deliveryInfo: null,
      warrantyPolicy: null,
      aboutText: null,
      primaryColor: STORE_INFO.primaryColor,
      secondaryColor: STORE_INFO.secondaryColor,
    };
  }
}

/**
 * Fetch all published, unarchived products from Supabase, falling back to static fixtures.
 */
export async function getStoreProducts(): Promise<CatalogueProduct[]> {
  if (!isSupabaseConfigured()) {
    return PRODUCTS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        summary,
        description,
        price_kobo,
        stock_status,
        warranty_details,
        is_featured,
        specifications,
        categories ( name, slug ),
        brands ( name, slug ),
        product_images ( storage_path, is_primary )
      `)
      .eq("is_published", true)
      .eq("is_archived", false)
      .order("is_featured", { ascending: false });

    if (error || !data || data.length === 0) {
      return PRODUCTS;
    }

    return (data as unknown[]).map((row) => mapDatabaseProduct(row as Parameters<typeof mapDatabaseProduct>[0]));
  } catch (err) {
    console.warn("Products query failed, falling back to fixtures:", err);
    return PRODUCTS;
  }
}

/**
 * Fetch a single product by slug from Supabase, falling back to static fixtures.
 */
export async function getStoreProductBySlug(slug: string): Promise<CatalogueProduct | null> {
  if (!isSupabaseConfigured()) {
    return PRODUCTS.find((p) => p.slug === slug) || null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        summary,
        description,
        price_kobo,
        stock_status,
        warranty_details,
        is_featured,
        specifications,
        categories ( name, slug ),
        brands ( name, slug ),
        product_images ( storage_path, is_primary )
      `)
      .eq("slug", slug)
      .eq("is_archived", false)
      .maybeSingle();

    if (error || !data) {
      return PRODUCTS.find((p) => p.slug === slug) || null;
    }

    return mapDatabaseProduct(data as unknown as Parameters<typeof mapDatabaseProduct>[0]);
  } catch (err) {
    console.warn("Product by slug query failed, falling back:", err);
    return PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

/**
 * Fetch active categories from Supabase, falling back to fixtures.
 */
export async function getStoreCategories(): Promise<CatalogueCategory[]> {
  if (!isSupabaseConfigured()) {
    return CATEGORIES;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("name, slug, description, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES;
    }

    return data.map((c) => {
      const isSolar = c.slug.includes("solar") || c.name.toLowerCase().includes("solar");
      const matched = CATEGORIES.find((cat) => cat.slug === c.slug);
      return {
        slug: c.slug,
        name: c.name,
        department: isSolar ? "solar" : "electronics",
        description: c.description || matched?.description || "",
        itemCountEstimate: matched?.itemCountEstimate || "Verified Selection",
        iconType: matched?.iconType || (isSolar ? "solar" : "appliances"),
      };
    });
  } catch (err) {
    console.warn("Categories query failed, falling back:", err);
    return CATEGORIES;
  }
}

/**
 * Fetch active brands from Supabase, falling back to fixtures.
 */
export async function getStoreBrands(): Promise<CatalogueBrand[]> {
  if (!isSupabaseConfigured()) {
    return BRANDS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return BRANDS;
    }

    return data.map((b) => {
      const matched = BRANDS.find((brand) => brand.slug === b.slug);
      return {
        slug: b.slug,
        name: b.name,
        country: matched?.country || "International",
        specialty: matched?.specialty || "Consumer Electronics & Power",
      };
    });
  } catch (err) {
    console.warn("Brands query failed, falling back:", err);
    return BRANDS;
  }
}
