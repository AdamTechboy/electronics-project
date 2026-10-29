"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requirePermission } from "@/server/auth/guards";
import type { ActionResult } from "./products";

export async function updateSettingsAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requirePermission("settings:update");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const business_name = String(formData.get("business_name") ?? "").trim();
    if (!business_name) {
      return { success: false, error: "Business name is required." };
    }

    const tagline = String(formData.get("tagline") ?? "").trim() || null;
    const address = String(formData.get("address") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const whatsapp = String(formData.get("whatsapp") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const opening_hours = String(formData.get("opening_hours") ?? "").trim() || null;
    const delivery_info = String(formData.get("delivery_info") ?? "").trim() || null;
    const warranty_policy = String(formData.get("warranty_policy") ?? "").trim() || null;
    const about_text = String(formData.get("about_text") ?? "").trim() || null;

    const supabase = await createClient();

    // Check if store_settings row exists
    const { data: existingSettings } = await supabase
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existingSettings) {
      const { error } = await supabase
        .from("store_settings")
        .update({
          business_name,
          tagline,
          address,
          phone,
          whatsapp,
          email,
          opening_hours,
          delivery_info,
          warranty_policy,
          about_text,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingSettings.id);

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase.from("store_settings").insert({
        business_name,
        tagline,
        address,
        phone,
        whatsapp,
        email,
        opening_hours,
        delivery_info,
        warranty_policy,
        about_text,
      });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    // Audit log
    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "SETTINGS_UPDATE",
        target_entity: "store_settings",
        target_id: existingSettings?.id ?? null,
        details: { business_name, phone, whatsapp, email },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/delivery");
    revalidatePath("/warranty-returns");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
