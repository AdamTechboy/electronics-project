import { headers } from "next/headers";
export const metadata = { title: "Admin sign in" };
export default async function AdminLoginPage() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  // Avoid redirect loops: admin login is public; admin layout guard redirects here.
  return <div className="container admin-shell"><div className="admin-panel"><p className="eyebrow">Restricted access</p><h1 style={{fontSize:"2.2rem"}}>Admin sign in</h1><p>Authentication backend is not yet wired. No default credentials exist.</p><div className="notice">Production login requires a reviewed session implementation, rate limiting, password verification, session rotation, secure cookies, and audit events.</div><p style={{marginTop:20}}>Deployment host detected: {host || "local development"}</p></div></div>;
}
