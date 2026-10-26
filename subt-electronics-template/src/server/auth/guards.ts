import "server-only";
import { redirect } from "next/navigation";

// Fail-closed guard. Replace with a verified server-side session lookup before enabling admin operations.
export async function requireAdminPage(): Promise<never> {
  redirect("/admin/login");
}
