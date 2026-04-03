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

  // ── Tasks ──────────────────────────────────────────────
  TASKS: {
    LIST: "/tasks",
    CREATE: "/tasks",
    GET: (id: string) => `/tasks/${id}`,
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    ADD_COMMENT: (id: string) => `/tasks/${id}/comments`,
  },

  // ── Roles & Permissions ────────────────────────────────
  ROLES: {
    LIST: "/roles",
    CREATE: "/roles",
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
  },

  // ── Registry ──────────────────────────────────────────
  REGISTRY: {
    LIST: (category: string) => `/registry/${category}`,
    CREATE: "/registry",
    UPDATE: (id: string) => `/registry/${id}`,
    DELETE: (id: string) => `/registry/${id}`,
  },

  // ── Search & Calendar ────────────────────────────────
  SEARCH: "/search",
  CALENDAR: {
    EVENTS: "/calendar/events",
  },
} as const;
