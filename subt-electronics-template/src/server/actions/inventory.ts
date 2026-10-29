"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requirePermission } from "@/server/auth/guards";
import type { ActionResult } from "./products";
import type { StockMovementReason } from "@/types/database.types";

export async function updateInventoryAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requirePermission("inventory:update");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const product_id = String(formData.get("product_id") ?? "").trim();
    if (!product_id) {
      return { success: false, error: "Product ID is missing." };
    }

    const quantityRaw = String(formData.get("quantity") ?? "").trim();
    const quantity = quantityRaw !== "" && !isNaN(Number(quantityRaw)) ? Number(quantityRaw) : null;

    const thresholdRaw = String(formData.get("low_stock_threshold") ?? "3").trim();
    const low_stock_threshold = !isNaN(Number(thresholdRaw)) ? Number(thresholdRaw) : 3;

    const reason = (String(formData.get("reason") ?? "restock")) as StockMovementReason;
    const notes = String(formData.get("notes") ?? "").trim() || null;

    const supabase = await createClient();

    // 1. Fetch current inventory record if exists
    const { data: existingRecord } = await supabase
      .from("inventory_records")
      .select("id, quantity")
      .eq("product_id", product_id)
      .maybeSingle();

    const previous_quantity = existingRecord?.quantity ?? 0;
    const newQuantity = quantity ?? 0;
    const quantity_change = newQuantity - previous_quantity;

    // 2. Upsert inventory_records
    if (existingRecord) {
      await supabase
        .from("inventory_records")
        .update({
          quantity,
          low_stock_threshold,
          last_verified_at: new Date().toISOString(),
          verified_by: auth.user.id,
          note: notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRecord.id);
    } else {
      await supabase.from("inventory_records").insert({
        product_id,
        quantity,
        low_stock_threshold,
        last_verified_at: new Date().toISOString(),
        verified_by: auth.user.id,
        note: notes,
      });
    }

    // 3. Record stock movement
    if (quantity_change !== 0) {
      await supabase.from("stock_movements").insert({
        product_id,
        previous_quantity,
        quantity_change,
        resulting_quantity: newQuantity,
        reason,
        notes,
        created_by: auth.user.id,
      });
    }

    // 4. Automatically adjust product stock status if appropriate
    if (quantity !== null) {
      if (quantity === 0) {
        await supabase
          .from("products")
          .update({ stock_status: "out_of_stock", updated_at: new Date().toISOString() })
          .eq("id", product_id);
      } else if (quantity > 0) {
        // If it was marked out_of_stock, restore to in_stock
        const { data: prod } = await supabase
          .from("products")
          .select("stock_status")
          .eq("id", product_id)
          .single();

        if (prod?.stock_status === "out_of_stock") {
          await supabase
            .from("products")
            .update({ stock_status: "in_stock", updated_at: new Date().toISOString() })
            .eq("id", product_id);
        }
      }
    }

    // 5. Audit log
    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "INVENTORY_UPDATE",
        target_entity: "inventory_records",
        target_id: product_id,
        details: { previous_quantity, newQuantity, reason, notes },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
