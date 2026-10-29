/**
 * Muhammad Kairu Electronics — Supabase Environment Check Helper
 * Determines whether live Supabase environment variables have been provisioned.
 */

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (url.includes("your-project-id") || url.includes("example.com")) return false;
  return url.startsWith("https://") || url.startsWith("http://");
}

export function isSupabaseAdminConfigured(): boolean {
  const isPublicConfigured = isSupabaseConfigured();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isPublicConfigured || !serviceKey) return false;
  if (serviceKey.includes("your-service-role-key")) return false;
  return serviceKey.length > 20;
}
