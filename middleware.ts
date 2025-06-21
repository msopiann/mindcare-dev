import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl;

        // Public routes that don't require authentication
        const publicRoutes = [
          "/",
          "/auth/sign-in",
          "/auth/sign-up",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/auth/verify-email",
        ];

        // API routes that don't require authentication
        const publicApiRoutes = [
          "/api/auth",
          "/api/auth/register",
          "/api/auth/verify-email",
          "/api/auth/forgot-password",
          "/api/auth/reset-password",
          "/api/auth/resend-verification",
        ];

        // Allow public routes
        if (publicRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Allow public API routes
        if (publicApiRoutes.some((route) => pathname.startsWith(route))) {
          return true;
        }

        // Require authentication for all other routes
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
