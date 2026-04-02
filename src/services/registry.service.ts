import api from "./api";
import { ApiResponse } from "@/types/auth";

export interface TypeRegistryItem {
  _id: string;
  title: string;
  category: "CASE_TYPE" | "CASE_STAGE" | "PAYMENT_MODE" | "DOCUMENT_TYPE" | "EXPENSE_CATEGORY";
  isLive: boolean;
  isPrime: boolean;
  status: "ACTIVE" | "INACTIVE";
  organizationId: string;
  createdAt: string;
}

const REGISTRY_URL = "/registry";

export const getRegistry = async (category: string) => {
  const { data } = await api.get<ApiResponse<TypeRegistryItem[]>>(`${REGISTRY_URL}/${category}`);
  return data;
};

export const createType = async (payload: Partial<TypeRegistryItem>) => {
  const { data } = await api.post<ApiResponse<TypeRegistryItem>>(REGISTRY_URL, payload);
  return data;
};

export const updateType = async (id: string, payload: Partial<TypeRegistryItem>) => {
  const { data } = await api.put<ApiResponse<TypeRegistryItem>>(`${REGISTRY_URL}/${id}`, payload);
  return data;
};

export const deleteType = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`${REGISTRY_URL}/${id}`);
  return data;
};
