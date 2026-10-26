import { EnquiryForm } from "@/components/enquiry-form";
import { tenantConfig } from "@/config/tenant";
export const metadata = { title: "Contact & enquiries" };
export default function ContactPage() {
  return <div className="container"><section className="page-hero"><p className="eyebrow">Contact</p><h1>How can we help?</h1><p>Send a product or service enquiry. Store contact details will appear here after they are verified and approved by the client.</p></section><div className="content-card"><h2>Send an enquiry</h2><EnquiryForm /></div><div className="content-card"><h2>Store contact details</h2><p><strong>Phone:</strong> {tenantConfig.contact.phone || "Not yet provided"}</p><p><strong>WhatsApp:</strong> {tenantConfig.contact.whatsapp || "Not yet provided"}</p><p><strong>Email:</strong> {tenantConfig.contact.email || "Not yet provided"}</p><p><strong>Address:</strong> {tenantConfig.contact.address || "Not yet provided"}</p><p><strong>Opening hours:</strong> {tenantConfig.contact.openingHours || "Not yet provided"}</p></div></div>;
}
