/**
 * Central API endpoint definitions.
 * Never write endpoint strings directly in services.
 */
export const API = {
  // ── Auth ───────────────────────────────────────────────
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_OTP: "/auth/verify-otp",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    VERIFY_RESET_OTP: "/auth/verify-reset-otp",
    RESET_PASSWORD: "/auth/reset-password",
    SELECT_ORG: "/auth/select-org",
    ME: "/auth/me",
  },

  // ── Orgs ───────────────────────────────────────────────
  ORG: {
    CREATE: "/org/create",
    UPDATE: (id: string) => `/org/${id}`,
    DELETE: (id: string) => `/org/${id}`,
  },
  TEAM: {
    CREATE: "/team/create",
    LIST: "/team",
  },

  // ── Users ──────────────────────────────────────────────
  USERS: {
    GET_ALL: "/users",
    GET_ONE: (id: string) => `/users/${id}`,
    CREATE: "/users",
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    UPDATE_PASSWORD: (id: string) => `/users/${id}/password`,
    UPLOAD_AVATAR: (id: string) => `/users/${id}/avatar`,
  },

  // ── Cases ──────────────────────────────────────────────
  CASES: {
    LIST: "/cases",
    CREATE: "/cases",
    GET: (id: string) => `/cases/${id}`,
    UPDATE: (id: string) => `/cases/${id}`,
    DELETE: (id: string) => `/cases/${id}`,
    ADD_HEARING: (id: string) => `/cases/${id}/hearings`,
  },
} as const;
