import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      // Memastikan user hanya bisa akses dashboard sesuai role-nya
      if (pathname.startsWith("/admin") && token?.role !== "admin") return false;
      if (pathname.startsWith("/developer") && token?.role !== "developer") return false;
      if (pathname.startsWith("/stakeholder") && token?.role !== "stakeholder") return false;
      return !!token;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});

export const config = {
  matcher: [
    "/stakeholder/:path*",
    "/developer/:path*",
    "/admin/:path*",
  ],
};
