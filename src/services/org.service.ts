import api from "@/services/api";
import { API } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api";

export interface OrgPayload {
  name: string;
  address?: string;
  email?: string;
  contactNo?: string;
}

export const createOrg = async (data: OrgPayload) => {
  const res = await api.post<ApiResponse<any>>(API.ORG.CREATE, data);
  return res.data;
};

export const updateOrg = async (id: string, data: OrgPayload) => {
  const res = await api.put<ApiResponse<any>>(API.ORG.UPDATE(id), data);
  return res.data;
};

export const deleteOrg = async (id: string) => {
  const { data } = await api.delete<ApiResponse<any>>(API.ORG.DELETE(id));
  return data;
};
