import { tenantConfigSchema } from "./schema";

// Placeholder configuration only. Replace business facts with client-approved data.
// Contact fields are deliberately blank so the site does not invent contact details.
export const tenantConfig = tenantConfigSchema.parse({
  tenantId: process.env.TENANT_ID ?? "muhammad-kairu-electronics",
  brand: {
    name: "MUHAMMAD KAIRU ELECTRONICS",
    logoPath: "",
    primaryColor: "#123B68",
    accentColor: "#F28C28",
    fontFamily: "Arial, sans-serif",
  },
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    openingHours: "",
  },
  features: {
    catalogue: true,
    enquiries: true,
    inventoryManagement: true,
    onlineCheckout: false,
    customerAccounts: false,
  },
  seo: {
    siteUrl: process.env.APP_BASE_URL ?? "http://localhost:3000",
    defaultTitle: "Muhammad Kairu Electronics | Product Catalogue",
    defaultDescription: "Browse the electronics catalogue and contact the store to confirm availability, pricing, and specifications.",
  },
});
