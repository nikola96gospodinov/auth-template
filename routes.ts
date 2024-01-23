// Routes that don't require authentication
export const publicRoutes = ["/", "/auth/new-verification"];

// Routes used for authentication
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

// Routes that start with this prefix are used for API authentication
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";
