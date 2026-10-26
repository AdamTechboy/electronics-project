import { z } from "zod";

const optionalContact = z.string().trim().max(200).optional().default("");

export const tenantConfigSchema = z.object({
  tenantId: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  brand: z.object({
    name: z.string().trim().min(1).max(100),
    logoPath: z.string().max(300).default(""),
    primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    fontFamily: z.string().max(80).default("Arial, sans-serif"),
  }),
  contact: z.object({
    phone: optionalContact,
    whatsapp: optionalContact,
    email: z.string().trim().email().or(z.literal("")).default(""),
    address: z.string().trim().max(500).default(""),
    openingHours: z.string().trim().max(300).default(""),
  }),
  features: z.object({
    catalogue: z.boolean().default(true),
    enquiries: z.boolean().default(true),
    inventoryManagement: z.boolean().default(true),
    onlineCheckout: z.literal(false).default(false),
    customerAccounts: z.literal(false).default(false),
  }),
  seo: z.object({
    siteUrl: z.string().url(),
    defaultTitle: z.string().min(1).max(120),
    defaultDescription: z.string().min(1).max(300),
  }),
});

export type TenantConfig = z.infer<typeof tenantConfigSchema>;
