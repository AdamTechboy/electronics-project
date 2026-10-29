"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requirePermission } from "@/server/auth/guards";
import type { StockStatus, Json } from "@/types/database.types";

export interface ActionResult<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Server Action: Create a new product.
 */
export async function createProductAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const auth = await requirePermission("products:create");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return { success: false, error: "Product name is required." };
    }

    let slug = String(formData.get("slug") ?? "").trim();
    if (!slug) {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    const category_id = String(formData.get("category_id") ?? "") || null;
    const brand_id = String(formData.get("brand_id") ?? "") || null;
    const summary = String(formData.get("summary") ?? "").trim() || name;
    const description = String(formData.get("description") ?? "").trim() || null;
    const warranty_details = String(formData.get("warranty_details") ?? "").trim() || null;

    // Price handling: Naira to Kobo (BIGINT), null if confirm with store
    const confirmPrice = formData.get("confirm_price") === "on";
    const priceNairaRaw = String(formData.get("price_naira") ?? "").trim();
    let price_kobo: number | null = null;
    if (!confirmPrice && priceNairaRaw && !isNaN(Number(priceNairaRaw))) {
      price_kobo = Math.round(Number(priceNairaRaw) * 100);
    }

    const stock_status = (String(formData.get("stock_status") ?? "in_stock")) as StockStatus;
    const is_published = formData.get("is_published") !== "off";
    const is_featured = formData.get("is_featured") === "on";

    // Specifications parsing (expected as JSON string or parsed key-value rows)
    const specsRaw = String(formData.get("specifications") ?? "[]").trim();
    let specifications: Json = [];
    try {
      specifications = specsRaw ? JSON.parse(specsRaw) : [];
    } catch {
      specifications = [];
    }

    const imageUrl = String(formData.get("image_url") ?? "").trim();
    const initialQuantityRaw = String(formData.get("initial_quantity") ?? "").trim();
    const initialQuantity = initialQuantityRaw && !isNaN(Number(initialQuantityRaw)) ? Number(initialQuantityRaw) : null;

    const supabase = await createClient();

    // 1. Insert product
    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id,
        brand_id,
        summary,
        description,
        price_kobo,
        currency: "NGN",
        stock_status,
        warranty_details,
        is_published,
        is_featured,
        specifications,
      })
      .select("id")
      .single();

    if (insertError || !product) {
      console.error("Create product error:", insertError);
      return { success: false, error: insertError?.message || "Failed to create product." };
    }

    // 2. Insert image if provided
    if (imageUrl) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        storage_path: imageUrl,
        alt_text: name,
        is_primary: true,
        sort_order: 0,
      });
    }

    // 3. Insert inventory record if initial quantity specified
    if (initialQuantity !== null) {
      await supabase.from("inventory_records").insert({
        product_id: product.id,
        quantity: initialQuantity,
        low_stock_threshold: 3,
        verified_by: auth.user.id,
        last_verified_at: new Date().toISOString(),
      });

      await supabase.from("stock_movements").insert({
        product_id: product.id,
        previous_quantity: 0,
        quantity_change: initialQuantity,
        resulting_quantity: initialQuantity,
        reason: "initial_stock",
        notes: "Initial inventory on product creation",
        created_by: auth.user.id,
      });
    }

    // 4. Audit Log
    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "PRODUCT_CREATE",
        target_entity: "products",
        target_id: product.id,
        details: { name, slug, price_kobo, stock_status },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: { id: product.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Update an existing product.
 */
export async function updateProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requirePermission("products:update");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      return { success: false, error: "Product ID is missing." };
    }

    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return { success: false, error: "Product name is required." };
    }

    let slug = String(formData.get("slug") ?? "").trim();
    if (!slug) {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    const category_id = String(formData.get("category_id") ?? "") || null;
    const brand_id = String(formData.get("brand_id") ?? "") || null;
    const summary = String(formData.get("summary") ?? "").trim() || name;
    const description = String(formData.get("description") ?? "").trim() || null;
    const warranty_details = String(formData.get("warranty_details") ?? "").trim() || null;

    // Price handling
    const confirmPrice = formData.get("confirm_price") === "on";
    const priceNairaRaw = String(formData.get("price_naira") ?? "").trim();
    let price_kobo: number | null = null;
    if (!confirmPrice && priceNairaRaw && !isNaN(Number(priceNairaRaw))) {
      price_kobo = Math.round(Number(priceNairaRaw) * 100);
    }

    const stock_status = (String(formData.get("stock_status") ?? "in_stock")) as StockStatus;
    const is_published = formData.get("is_published") === "on";
    const is_featured = formData.get("is_featured") === "on";

    const specsRaw = String(formData.get("specifications") ?? "[]").trim();
    let specifications: Json = [];
    try {
      specifications = specsRaw ? JSON.parse(specsRaw) : [];
    } catch {
      specifications = [];
    }

    const imageUrl = String(formData.get("image_url") ?? "").trim();

    const supabase = await createClient();

    // 1. Update product table
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        slug,
        category_id,
        brand_id,
        summary,
        description,
        price_kobo,
        stock_status,
        warranty_details,
        is_published,
        is_featured,
        specifications,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Update product error:", updateError);
      return { success: false, error: updateError.message };
    }

    // 2. Handle image update if supplied
    if (imageUrl) {
      const { data: existingImg } = await supabase
        .from("product_images")
        .select("id")
        .eq("product_id", id)
        .eq("is_primary", true)
        .maybeSingle();

      if (existingImg) {
        await supabase
          .from("product_images")
          .update({ storage_path: imageUrl, alt_text: name })
          .eq("id", existingImg.id);
      } else {
        await supabase.from("product_images").insert({
          product_id: id,
          storage_path: imageUrl,
          alt_text: name,
          is_primary: true,
          sort_order: 0,
        });
      }
    }

    // 3. Audit log
    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "PRODUCT_UPDATE",
        target_entity: "products",
        target_id: id,
        details: { name, slug, price_kobo, stock_status, is_published, is_featured },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

/**
 * Server Action: Archive or delete a product.
 */
export async function archiveProductAction(id: string): Promise<ActionResult> {
  try {
    const auth = await requirePermission("products:delete");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .update({ is_archived: true, is_published: false, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Audit log
    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "PRODUCT_ARCHIVE",
        target_entity: "products",
        target_id: id,
        details: { archived: true },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
