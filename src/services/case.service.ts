import api from "./api";
import { ApiResponse } from "@/types/api";
import { CaseItem, HearingHistory } from "@/types/case";
import { API } from "./endpoints";

export const getCases = async () => {
  const { data } = await api.get<ApiResponse<CaseItem[]>>(API.CASES.LIST);
  return data;
};

export const getCaseById = async (id: string) => {
  const { data } = await api.get<ApiResponse<CaseItem>>(API.CASES.GET(id));
  return data;
};

export const createCase = async (payload: any) => {
  const { data } = await api.post<ApiResponse<CaseItem>>(API.CASES.CREATE, payload);
  return data;
};

export const updateCase = async (id: string, payload: any) => {
  const { data } = await api.put<ApiResponse<CaseItem>>(API.CASES.UPDATE(id), payload);
  return data;
};

export const deleteCase = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(API.CASES.DELETE(id));
  return data;
};

export const addHearing = async (caseId: string, payload: { hearingDate: string; notes?: string }) => {
  const { data } = await api.post<ApiResponse<HearingHistory>>(API.CASES.ADD_HEARING(caseId), payload);
  return data;
};

export const addCaseComment = async (caseId: string, text: string) => {
  const { data } = await api.post<ApiResponse<CaseItem>>(`/cases/${caseId}/comments`, { text });
  return data;
};
