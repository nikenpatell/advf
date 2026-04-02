import api from "./api";

export interface Permission {
  module: string;
  feature: string;
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
  const response = await api.get<{ data: Role[] }>("/roles");
  return response.data;
};

export const createRole = async (data: Partial<Role>) => {
  const response = await api.post<{ data: Role }>("/roles", data);
  return response.data;
};

export const updateRole = async (id: string, data: Partial<Role>) => {
  const response = await api.put<{ data: Role }>(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};
