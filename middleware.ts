import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const protectedRoutes = ["/dashboard", "/create"];
  const authRoutes = ["/login", "/register"];

  // If trying to access protected route without tokens, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If already logged in and trying to access login/register, redirect to dashboard
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create/:path*",
    "/login",
    "/register",
  ],
};
