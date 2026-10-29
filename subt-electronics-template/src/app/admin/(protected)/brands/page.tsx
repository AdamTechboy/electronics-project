import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { BrandsManager, type BrandItem } from "./brands-manager";

export default async function AdminBrandsPage() {
  let brands: BrandItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, slug, logo_url, is_active")
        .order("name", { ascending: true });

      if (!error && data) {
        brands = data;
      }
    } catch (err) {
      console.warn("Brands fetch error:", err);
    }
  }

  return <BrandsManager initialBrands={brands} />;
}
