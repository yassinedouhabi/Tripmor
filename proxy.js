import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role;
    const providerStatus = token?.providerStatus;

    // Admin routes — admin only
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // Provider routes — provider only, and must be approved
    if (pathname.startsWith("/provider")) {
      if (role !== "provider") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
      if (providerStatus !== "approved") {
        return NextResponse.redirect(new URL("/provider/pending", req.url));
      }
    }

    // Account routes — tourists only
    if (pathname.startsWith("/account") && role !== "tourist") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/provider/:path*", "/account/:path*"],
};
