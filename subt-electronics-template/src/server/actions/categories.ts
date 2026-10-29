"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requirePermission } from "@/server/auth/guards";
import type { ActionResult } from "./products";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requirePermission("categories:create");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return { success: false, error: "Category name is required." };
    }

    let slug = String(formData.get("slug") ?? "").trim();
    if (!slug) {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    const description = String(formData.get("description") ?? "").trim() || null;
    const sort_order = Number(formData.get("sort_order") ?? 0) || 0;
    const is_active = formData.get("is_active") !== "off";

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        description,
        sort_order,
        is_active,
      })
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to create category." };
    }

    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "CATEGORY_CREATE",
        target_entity: "categories",
        target_id: data.id,
        details: { name, slug },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function updateCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requirePermission("categories:update");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const id = String(formData.get("id") ?? "").trim();
    if (!id) {
      return { success: false, error: "Category ID is required." };
    }

    const name = String(formData.get("name") ?? "").trim();
    if (!name) {
      return { success: false, error: "Category name is required." };
    }

    let slug = String(formData.get("slug") ?? "").trim();
    if (!slug) {
      slug = slugify(name);
    } else {
      slug = slugify(slug);
    }

    const description = String(formData.get("description") ?? "").trim() || null;
    const sort_order = Number(formData.get("sort_order") ?? 0) || 0;
    const is_active = formData.get("is_active") === "on";

    const supabase = await createClient();

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        description,
        sort_order,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "CATEGORY_UPDATE",
        target_entity: "categories",
        target_id: id,
        details: { name, slug, is_active },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const auth = await requirePermission("categories:delete");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const supabase = await createClient();

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "CATEGORY_DELETE",
        target_entity: "categories",
        target_id: id,
        details: { deleted: true },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
