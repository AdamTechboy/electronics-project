import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ProductsManager, type AdminProductItem } from "./products-manager";

export default async function AdminProductsPage() {
  let products: AdminProductItem[] = [];
  let categories: Array<{ id: string; name: string }> = [];
  let brands: Array<{ id: string; name: string }> = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        supabase
          .from("products")
          .select(`
            id,
            name,
            slug,
            summary,
            description,
            price_kobo,
            stock_status,
            warranty_details,
            is_published,
            is_featured,
            category_id,
            brand_id,
            specifications,
            categories ( name, slug ),
            brands ( name, slug ),
            inventory_records ( quantity, low_stock_threshold ),
            product_images ( storage_path, is_primary )
          `)
          .eq("is_archived", false)
          .order("created_at", { ascending: false }),

        supabase.from("categories").select("id, name").order("name"),
        supabase.from("brands").select("id, name").order("name"),
      ]);

      if (productsRes.data) {
        products = productsRes.data as unknown as AdminProductItem[];
      }
      if (categoriesRes.data) {
        categories = categoriesRes.data;
      }
      if (brandsRes.data) {
        brands = brandsRes.data;
      }
    } catch (err) {
      console.warn("Failed to fetch admin products:", err);
    }
  }

  return <ProductsManager products={products} categories={categories} brands={brands} />;
}
