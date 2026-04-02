import api from "@/services/api";
import { API } from "@/services/endpoints";
import type { 
  LoginPayload, 
  UserRole,
  RegisterPayload, 
  ForgotPasswordPayload, 
  ResetPasswordPayload,
  AuthResponse
} from "@/types/auth";
import type { ApiResponse } from "@/types/api";
import type { Organization } from "@/store/useOrgStore";

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<ApiResponse<AuthResponse & { organizations?: (Organization & { permissions?: any[] | null })[] }>>(API.AUTH.LOGIN, payload);
  return data;
};

export const getRolesByEmail = async (payload: { email: string }) => {
  const { data } = await api.post<ApiResponse<{ roles: UserRole[]; isVerified: boolean }>>("/auth/get-roles-by-email", payload);
  return data;
};

export const selectOrg = async (payload: { orgId: string }) => {
  const { data } = await api.post<ApiResponse<{ token: string; role: string; orgId: string; permissions?: any[] | null }>>("/auth/select-org", payload);
  return data;
};

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post<ApiResponse<{ email: string }>>(API.AUTH.REGISTER, payload);
  return data;
};

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const { data } = await api.post<ApiResponse<null>>(API.AUTH.VERIFY_OTP, payload);
  return data;
};

export const verifyResetOtp = async (payload: { email: string; otp: string; role?: UserRole }) => {
  const { data } = await api.post<ApiResponse<{ token: string }>>(API.AUTH.VERIFY_RESET_OTP, payload);
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await api.post<ApiResponse<null>>(API.AUTH.FORGOT_PASSWORD, payload);
  return data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await api.post<ApiResponse<null>>(API.AUTH.RESET_PASSWORD, payload);
  return data;
};
