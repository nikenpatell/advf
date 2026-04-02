import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/utils/constants";

export interface Organization {
  id: string; // orgId
  name: string;
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "TEAM_MEMBER" | "CLIENT";
  address?: string;
  email?: string;
  contactNo?: string;
  status?: "ACTIVE" | "INACTIVE";
  permissions?: { module: string; actions: string[] }[] | null;
}

interface OrgState {
  organizations: Organization[];
  currentOrg: Organization | null;
  setOrganizations: (orgs: Organization[]) => void;
  setCurrentOrg: (org: Organization) => void;
  clearOrgs: () => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      organizations: [],
      currentOrg: null,
      setOrganizations: (orgs) => set({ organizations: orgs }),
      setCurrentOrg: (org) => set({ currentOrg: org }),
      clearOrgs: () => set({ organizations: [], currentOrg: null }),
    }),
    {
      name: STORAGE_KEYS.CURRENT_ORG, // Persist config
      // partialize means what gets stored in localstorage
      partialize: (state) => ({ currentOrg: state.currentOrg, organizations: state.organizations }),
    }
  )
);
