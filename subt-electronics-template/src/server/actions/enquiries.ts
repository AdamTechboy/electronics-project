"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requirePermission } from "@/server/auth/guards";
import type { ActionResult } from "./products";
import type { EnquiryStatus } from "@/types/database.types";

export async function updateEnquiryStatusAction(
  enquiry_id: string,
  status: EnquiryStatus
): Promise<ActionResult> {
  try {
    const auth = await requirePermission("enquiries:manage");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const supabase = await createClient();

    const updatePayload: {
      status: EnquiryStatus;
      updated_at: string;
      closed_at?: string | null;
    } = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "resolved" || status === "closed") {
      updatePayload.closed_at = new Date().toISOString();
    } else {
      updatePayload.closed_at = null;
    }

    const { error } = await supabase
      .from("enquiries")
      .update(updatePayload)
      .eq("id", enquiry_id);

    if (error) {
      return { success: false, error: error.message };
    }

    // Audit log
    try {
      await supabase.from("audit_logs").insert({
        actor_id: auth.user.id,
        action: "ENQUIRY_STATUS_UPDATE",
        target_entity: "enquiries",
        target_id: enquiry_id,
        details: { new_status: status },
      });
    } catch (auditErr) {
      console.warn("Audit log error:", auditErr);
    }

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}

export async function addEnquiryNoteAction(formData: FormData): Promise<ActionResult> {
  try {
    const auth = await requirePermission("enquiries:manage");

    if (!isSupabaseConfigured()) {
      return { success: false, error: "Database is not configured." };
    }

    const enquiry_id = String(formData.get("enquiry_id") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!enquiry_id || !note) {
      return { success: false, error: "Enquiry ID and note are required." };
    }

    const supabase = await createClient();

    const { error } = await supabase.from("enquiry_notes").insert({
      enquiry_id,
      author_id: auth.user.id,
      note,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/enquiries");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    return { success: false, error: message };
  }
}
