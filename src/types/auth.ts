export type UserRole = "ORG_ADMIN" | "TEAM_MEMBER" | "CLIENT" | "SUPER_ADMIN";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
  role?: UserRole;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}
