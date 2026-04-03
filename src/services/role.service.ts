import api from "./api";
import { API } from "./endpoints";

export interface Permission {
  feature: string;
  module: string;
  actions: ("CREATE" | "UPDATE" | "DELETE" | "VIEW" | "APPROVE" | "PRINT")[];
}

export interface Role {
  _id: string;
  name: string;
  organizationId: string;
  permissions: Permission[];
  isDefault: boolean;
  createdAt: string;
}

export const getRoles = async () => {
  const response = await api.get<{ data: Role[] }>(API.ROLES.LIST);
  return response.data;
};

export const createRole = async (data: Partial<Role>) => {
  const response = await api.post<{ data: Role }>(API.ROLES.CREATE, data);
  return response.data;
};

export const updateRole = async (id: string, data: Partial<Role>) => {
  const response = await api.put<{ data: Role }>(API.ROLES.UPDATE(id), data);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await api.delete(API.ROLES.DELETE(id));
  return response.data;
};
