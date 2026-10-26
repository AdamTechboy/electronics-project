export const roles = ["OWNER", "STORE_ADMIN", "CATALOGUE_MANAGER", "ENQUIRY_STAFF"] as const;
export type Role = (typeof roles)[number];

const permissions: Record<Role, readonly string[]> = {
  OWNER: ["products:read", "products:write", "prices:write", "inventory:write", "enquiries:read", "enquiries:write", "settings:write", "audit:read", "admins:manage"],
  STORE_ADMIN: ["products:read", "products:write", "prices:write", "inventory:write", "enquiries:read", "enquiries:write", "settings:write", "audit:read"],
  CATALOGUE_MANAGER: ["products:read", "products:write", "prices:write", "inventory:write"],
  ENQUIRY_STAFF: ["products:read", "enquiries:read", "enquiries:write"],
};

export function hasPermission(role: Role, permission: string): boolean {
  return permissions[role].includes(permission);
}
