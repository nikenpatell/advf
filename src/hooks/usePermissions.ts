import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/types/auth";

/**
 * Returns current user info and permission helpers.
 *
 * @example
 * const { user, hasRole, isAdmin } = usePermissions();
 * if (hasRole("ADMIN")) { ... }
 */
export function usePermissions() {
  const user = useAuthStore((s) => s.user);

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = hasRole("ADMIN", "SUPER_ADMIN");
  const isSuperAdmin = hasRole("SUPER_ADMIN");

  return {
    user,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };
}
