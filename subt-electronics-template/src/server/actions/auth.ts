"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAuthenticatedEmployee } from "@/server/auth/guards";

export interface AuthState {
  error?: string;
  success?: boolean;
}

/**
 * Server Action: Authenticate an administrator or staff member.
 */
export async function signInAdminAction(
  _prevState: AuthState | null,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured yet. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment, then run the bootstrap script.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  // Verify that the user has an active employee record
  const employee = await getAuthenticatedEmployee();
  if (!employee) {
    await supabase.auth.signOut();
    return {
      error:
        "Access denied: This account exists but has not been assigned an active employee or owner role.",
    };
  }

  // Record audit log for successful login
  try {
    await supabase.from("audit_logs").insert({
      actor_id: data.user.id,
      action: "ADMIN_LOGIN_SUCCESS",
      target_entity: "auth.users",
      target_id: data.user.id,
      details: { email: data.user.email, role: employee.role },
    });
  } catch (auditErr) {
    console.warn("Audit logging failed on login:", auditErr);
  }

  redirect("/admin");
}

/**
 * Server Action: Sign out the current administrator.
 */
export async function signOutAdminAction(): Promise<never> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("audit_logs").insert({
          actor_id: user.id,
          action: "ADMIN_LOGOUT",
          target_entity: "auth.users",
          target_id: user.id,
          details: { email: user.email },
        });
      }

      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    }
  }

  redirect("/admin/login");
}
