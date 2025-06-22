import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/api/admin") && role !== "ADMIN") {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // pastikan user authenticated
    },
  },
);

// hanya jalankan middleware pada path ini
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/api/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/admin/:path*",
  ],
};
