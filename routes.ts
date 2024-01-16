// Routes that don't require authentication
export const publicRoutes = ["/"];

// Routes used for authentication
export const authRoutes = ["/auth/login", "/auth/register"];

// Routes that start with this prefix are used for API authentication
export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/settings";
