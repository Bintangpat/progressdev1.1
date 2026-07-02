import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Ambil token JWT dari session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  
  // 1. Jika user sudah login dan mencoba akses halaman auth, redirect ke dashboard masing-masing
  if (isAuthPage) {
    if (token) {
      const role = token.role as string;
      return NextResponse.redirect(new URL(`/${role}/dashboard`, req.url));
    }
    return NextResponse.next();
  }

  // 2. Proteksi rute berdasarkan role
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  if (pathname.startsWith("/developer") && token.role !== "developer") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  if (pathname.startsWith("/stakeholder") && token.role !== "stakeholder") {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/stakeholder/:path*",
    "/developer/:path*",
    "/admin/:path*",
  ],
};
