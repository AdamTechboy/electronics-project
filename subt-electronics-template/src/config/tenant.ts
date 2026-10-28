import { tenantConfigSchema } from "./schema";

export const tenantConfig = tenantConfigSchema.parse({
  tenantId: process.env.TENANT_ID ?? "muhammad-kairu-electronics",
  brand: {
    name: "Muhammad Kairu Electronics",
    logoPath: "",
    primaryColor: "#1F2A44",
    accentColor: "#F5A623",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  contact: {
    phone: "07038365737",
    whatsapp: "07038365737",
    email: "mkelectronics@gmail.com",
    address: "No. 41 Ahmadu Bello Way, Shop 31A, Rochas Plaza, opposite Zenith Bank, Jos, Plateau State, Nigeria",
    openingHours: "Monday - Saturday: 8:30 AM - 6:00 PM",
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
    defaultTitle: "Muhammad Kairu Electronics | Solar Power & Electronics Retailer (Jos)",
    defaultDescription: "Browse hybrid solar inverters, lithium batteries, solar panels, 4K TVs, audio systems, and home cooling appliances at Muhammad Kairu Electronics, Jos.",
  },
});
