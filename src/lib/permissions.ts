import { AdminRole } from "@prisma/client";
import { auth } from "@/auth";
import { ROLE_GROUPS, RoleGroup, hasRole } from "./roles";

export { ROLE_GROUPS, hasRole };
export type { RoleGroup };

/**
 * Validates if the current user has the required role.
 * Useful for Server Actions and Route Handlers.
 */
export async function requireRole(allowedRoles: readonly AdminRole[]) {
  const session = await auth();
  
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error("Forbidden: Insufficient permissions");
  }

  return session.user;
}
