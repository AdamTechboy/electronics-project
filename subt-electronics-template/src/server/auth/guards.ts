import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { User } from "@supabase/supabase-js";
import type { EmployeeRole } from "@/types/database.types";

export interface AuthenticatedEmployee {
  user: User;
  membershipId: string;
  role: EmployeeRole;
  isOwner: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
}

/**
 * Retrieves the currently authenticated employee session and permissions.
 * Returns null if not authenticated or not an active staff member.
 */
export async function getAuthenticatedEmployee(): Promise<AuthenticatedEmployee | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    // Verify active employee membership
    const { data: membership, error: memError } = await supabase
      .from("employee_memberships")
      .select("id, role, status, user_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (memError || !membership) {
      return null;
    }

    const role = membership.role as EmployeeRole;
    const isOwner = role === "owner";

    // Fetch assigned permissions for role
    let permissions: string[] = [];
    if (isOwner) {
      permissions = ["system:all"];
    } else {
      const { data: perms } = await supabase
        .from("role_permissions")
        .select("permission")
        .eq("role", role);

      if (perms) {
        permissions = perms.map((p) => p.permission);
      }
    }

    const permissionSet = new Set(permissions);

    return {
      user,
      membershipId: membership.id,
      role,
      isOwner,
      permissions,
      hasPermission: (perm: string) => isOwner || permissionSet.has(perm),
    };
  } catch (err) {
    console.error("Auth guard error:", err);
    return null;
  }
}

/**
 * Fail-closed guard for protected admin layouts and pages.
 * Redirects unauthenticated or unauthorized users to /admin/login.
 */
export async function requireAdminPage(): Promise<AuthenticatedEmployee> {
  const auth = await getAuthenticatedEmployee();

  if (!auth) {
    redirect("/admin/login");
  }

  return auth;
}

/**
 * Enforces granular permission on server actions and route handlers.
 * Throws an error or redirects if the employee lacks the required permission.
 */
export async function requirePermission(permission: string): Promise<AuthenticatedEmployee> {
  const auth = await requireAdminPage();

  if (!auth.hasPermission(permission)) {
    throw new Error(`Unauthorized: Role '${auth.role}' lacks permission '${permission}'`);
  }

  return auth;
}
