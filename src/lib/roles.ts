import { AdminRole } from "@prisma/client";

export const ROLE_GROUPS = {
  // Full system configuration and user management
  SYSTEM_ADMINS: ["SUPER_ADMIN", "IT_ADMIN"],
  
  // Property management (CRUD)
  PROPERTY_MANAGERS: ["SUPER_ADMIN", "IT_ADMIN", "SALES_MANAGER", "OPERATIONS"],
  
  // Leads management
  LEAD_MANAGERS: ["SUPER_ADMIN", "SALES_MANAGER", "SALES_EXECUTIVE", "MARKETING", "SUPPORT"],
  
  // Settings & Locations (Configuration)
  CONFIG_MANAGERS: ["SUPER_ADMIN", "IT_ADMIN", "OPERATIONS"],
} as const;

export type RoleGroup = typeof ROLE_GROUPS[keyof typeof ROLE_GROUPS];

/**
 * Checks if a user has a specific role (safe for Client Components).
 */
export function hasRole(userRole: AdminRole | undefined | null, allowedRoles: readonly AdminRole[]) {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
