import api from "./api";
import { API } from "./endpoints";
import { ApiResponse } from "@/types/auth";

export interface TypeRegistryItem {
  _id: string;
  title: string;
  category: "CASE_TYPE" | "CASE_STAGE" | "PAYMENT_MODE" | "DOCUMENT_TYPE" | "EXPENSE_CATEGORY" | "CLIENT_ROLE";
  isLive: boolean;
  isPrime: boolean;
  status: "ACTIVE" | "INACTIVE";
  organizationId: string;
  createdAt: string;
}

export const getRegistry = async (category: string) => {
  const { data } = await api.get<ApiResponse<TypeRegistryItem[]>>(API.REGISTRY.LIST(category));
  return data;
};

export const createType = async (payload: Partial<TypeRegistryItem>) => {
  const { data } = await api.post<ApiResponse<TypeRegistryItem>>(API.REGISTRY.CREATE, payload);
  return data;
};

export const updateType = async (id: string, payload: Partial<TypeRegistryItem>) => {
  const { data } = await api.put<ApiResponse<TypeRegistryItem>>(API.REGISTRY.UPDATE(id), payload);
  return data;
};

export const deleteType = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(API.REGISTRY.DELETE(id));
  return data;
};
