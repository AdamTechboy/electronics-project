import Link from "next/link";
import { requireAdminPage } from "@/server/auth/guards";

export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdminPage();
  return <div className="container admin-shell"><nav aria-label="Admin navigation" className="main-nav" style={{ marginBottom: 24, flexWrap: "wrap" }}><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/inventory">Inventory</Link><Link href="/admin/enquiries">Enquiries</Link><Link href="/admin/audit-log">Audit log</Link></nav>{children}</div>;
}
