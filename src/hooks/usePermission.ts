import { useOrgStore } from "@/store/useOrgStore";

export type PermissionModule = 
  | "DASHBOARD" 
  | "CASE" 
  | "TASK" 
  | "TEAM" 
  | "CLIENT" 
  | "REGISTRY" 
  | "ROLE"
  | "CALENDAR";

export type PermissionAction = "VIEW" | "CREATE" | "UPDATE" | "DELETE";

export const usePermission = () => {
  const { currentOrg } = useOrgStore();

  const hasPermission = (module: PermissionModule, action: PermissionAction): boolean => {
    // 1. Super Admin and Org Admin have unconditional access
    if (!currentOrg || currentOrg.role === "ORG_ADMIN") return true;

    // 2. Resolve permissions from normalized registry
    const permissions = currentOrg.permissions || [];
    const modulePerm = permissions.find(p => p.module === module);

    if (!modulePerm) return false;

    // 3. Verify action existence in authorized sequence
    return modulePerm.actions.includes(action as any);
  };

  return { hasPermission };
};
