import api from "@/services/api";
import { API } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  isVerified: boolean;
  role: string;
  customRoleId?: string;
  customRoleName?: string;
  clientRoleId?: string;
  clientRole?: string;
  status: string;
  joinedAt: string;
}

export interface CreateMemberPayload {
  name: string;
  email: string;
  password?: string;
  contactNumber: string;
  role: string;
  customRoleId?: string;
  clientRoleId?: string;
}

export const getTeamMembers = async (role?: string) => {
  const { data } = await api.get<ApiResponse<TeamMember[]>>(API.TEAM.LIST, { params: { role } });
  return data;
};

export const createTeamMember = async (payload: CreateMemberPayload) => {
  const { data } = await api.post<ApiResponse<TeamMember>>(API.TEAM.CREATE, payload);
  return data;
};

export const updateTeamMember = async (id: string, payload: Partial<CreateMemberPayload> & { status?: string }) => {
  const { data } = await api.put<ApiResponse<TeamMember>>(`${API.TEAM.LIST}/${id}`, payload);
  return data;
};

export const deleteTeamMember = async (id: string) => {
  const { data } = await api.delete<ApiResponse<null>>(`${API.TEAM.LIST}/${id}`);
  return data;
};
