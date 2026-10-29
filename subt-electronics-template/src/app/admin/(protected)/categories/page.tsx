import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CategoriesManager, type CategoryItem } from "./categories-manager";

export default async function AdminCategoriesPage() {
  let categories: CategoryItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, description, sort_order, is_active")
        .order("sort_order", { ascending: true });

      if (!error && data) {
        categories = data;
      }
    } catch (err) {
      console.warn("Categories fetch error:", err);
    }
  }

  return <CategoriesManager initialCategories={categories} />;
}
