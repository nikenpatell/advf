/**
 * Application-wide constants.
 * Never hardcode these values in components or services.
 */

export const APP_NAME = "MyApp";

export const STORAGE_KEYS = {
  TOKEN: "adv_token",
  REFRESH_TOKEN: "adv_refresh_token",
  USER: "adv_user",
  THEME: "adv_theme",
  SIDEBAR_COLLAPSED: "adv_sidebar",
  CURRENT_ORG: "adv_current_org",
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_OTP: "/verify-otp",
  FORGOT_PASSWORD: "/forgot-password",
  VERIFY_RESET_OTP: "/verify-reset-otp",
  RESET_PASSWORD: "/reset-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  
  // Organization Management (Super Admin)
  ORGANIZATIONS: "/organizations",
  SYSTEM_USERS: "/system-users",
  
  // Advocate firm management (Org Admin / Staff)
  CLIENTS: "/clients",
  MY_TEAM: "/my-team",
  CASES: "/cases",
  CALENDAR: "/calendar",
  TASKS: "/tasks",
  FINANCE: "/finance",
  INVOICES: "/invoices",
  REPORTS: "/reports",
  TYPE_MANAGEMENT: "/type-management",
  
  // Client Portal
  MY_CASES: "/my-cases",
  DOCUMENTS: "/documents",
  BILLING: "/billing",
  MESSAGES: "/messages",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50, 100],
} as const;

export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  USER: "USER",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
