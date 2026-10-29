import React from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { InventoryManager, type InventoryItem, type StockMovementItem } from "./inventory-manager";

interface DbProductInventoryRow {
  id: string;
  name: string;
  slug: string;
  stock_status: string;
  categories: { name: string } | null;
  brands: { name: string } | null;
  inventory_records: Array<{
    quantity: number | null;
    low_stock_threshold: number;
    last_verified_at: string | null;
    note: string | null;
  }> | null;
}

interface DbStockMovementRow {
  id: string;
  previous_quantity: number;
  quantity_change: number;
  resulting_quantity: number;
  reason: string;
  notes: string | null;
  created_at: string;
  products: { name: string } | null;
}

export default async function AdminInventoryPage() {
  let items: InventoryItem[] = [];
  let recentMovements: StockMovementItem[] = [];

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();

      // Fetch products with their inventory records, categories, and brands
      const { data: prods, error: prodErr } = await supabase
        .from("products")
        .select(`
          id,
          name,
          slug,
          stock_status,
          categories ( name ),
          brands ( name ),
          inventory_records ( quantity, low_stock_threshold, last_verified_at, note )
        `)
        .eq("is_archived", false)
        .order("name", { ascending: true });

      if (!prodErr && prods) {
        items = (prods as unknown as DbProductInventoryRow[]).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          stock_status: p.stock_status as InventoryItem["stock_status"],
          category_name: p.categories?.name || "General",
          brand_name: p.brands?.name || "Muhammad Kairu",
          quantity: p.inventory_records?.[0]?.quantity ?? 0,
          low_stock_threshold: p.inventory_records?.[0]?.low_stock_threshold ?? 3,
          last_verified_at: p.inventory_records?.[0]?.last_verified_at ?? null,
          note: p.inventory_records?.[0]?.note ?? null,
        }));
      }

      // Fetch recent stock movements
      const { data: movements, error: moveErr } = await supabase
        .from("stock_movements")
        .select(`
          id,
          previous_quantity,
          quantity_change,
          resulting_quantity,
          reason,
          notes,
          created_at,
          products ( name )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!moveErr && movements) {
        recentMovements = (movements as unknown as DbStockMovementRow[]).map((m) => ({
          id: m.id,
          product_name: m.products?.name || "Deleted Product",
          previous_quantity: m.previous_quantity,
          quantity_change: m.quantity_change,
          resulting_quantity: m.resulting_quantity,
          reason: m.reason,
          notes: m.notes,
          created_at: m.created_at,
        }));
      }
    } catch (err) {
      console.warn("Inventory fetch error:", err);
    }
  }

  return <InventoryManager items={items} recentMovements={recentMovements} />;
}
