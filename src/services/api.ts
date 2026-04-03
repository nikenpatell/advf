import axios from "axios";
import { STORAGE_KEYS } from "@/utils/constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Pass the multi-tenant Org ID to every authenticated request!
    try {
      const orgStorage = localStorage.getItem(STORAGE_KEYS.CURRENT_ORG);
      if (orgStorage) {
        const parsed = JSON.parse(orgStorage);
        const orgId = parsed?.state?.currentOrg?.id; // Zustand persist wrapper structure
        if (orgId) {
          config.headers["x-org-id"] = orgId;
        }
      }
    } catch (e) {
      // Ignore JSON parse errors for storage
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    // Skip auto-redirect for specific auth routes to allow retry logic on-page without full reload
    const isPublicAuthRoute = 
      originalRequest.url?.includes("/auth/login") || 
      originalRequest.url?.includes("/auth/register") || 
      originalRequest.url?.includes("/auth/verify-otp") || 
      originalRequest.url?.includes("/auth/verify-reset-otp") ||
      originalRequest.url?.includes("/auth/get-roles-by-email");

    // Auto refresh token on 401
    if (status === 401 && !originalRequest._retry && !isPublicAuthRoute) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh`,
            { refreshToken }
          );
          const newToken = res.data?.data?.token;
          localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          // Refresh failed — clear storage and redirect
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } else {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        window.location.href = "/login";
      }
    }

    // Removed hardcoded 403 and 500 manual toasts so that the 
    // real dynamic API message reaches the ErrorHandler.

    return Promise.reject(error);
  }
);

export default api;
