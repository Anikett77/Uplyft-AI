import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail";

  // ── 1. No token + protected route → login ──
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // ── 2. Token + public route → /profile ──
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // ── 3. Exact /profile → smart redirect ──
  if (token && path === "/profile") {
    try {
      const meResponse = await fetch(new URL("/api/users/me", request.url), {
        headers: { Cookie: `token=${token}` },
      });
      const meData = await meResponse.json();
      const profileCompleted = meData?.data?.profileCompleted;
      const userId = meData?.data?._id;

      console.log("profileCompleted:", profileCompleted);
      console.log("userId:", userId);

      if (!profileCompleted) {
        return NextResponse.redirect(new URL("/onboarding", request.nextUrl));
      } else {
        return NextResponse.redirect(new URL(`/profile/${userId}`, request.nextUrl));
      }

    } catch (error) {
      console.log("Middleware error:", error.message);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  // ── 4. /dashboard + profile incomplete → onboarding ──
  if (token && path === "/dashboard") {
    try {
      const meResponse = await fetch(new URL("/api/users/me", request.url), {
        headers: { Cookie: `token=${token}` },
      });
      const meData = await meResponse.json();
      const profileCompleted = meData?.data?.profileCompleted;

      if (!profileCompleted) {
        return NextResponse.redirect(new URL("/onboarding", request.nextUrl));
      }
    } catch (error) {
      console.log("Middleware error:", error.message);
    }
  }

  // ── 5. /onboarding + profile complete → /profile/[id] ──
  if (token && path === "/onboarding") {
    try {
      const meResponse = await fetch(new URL("/api/users/me", request.url), {
        headers: { Cookie: `token=${token}` },
      });
      const meData = await meResponse.json();
      const profileCompleted = meData?.data?.profileCompleted;
      const userId = meData?.data?._id;

      if (profileCompleted) {
        return NextResponse.redirect(new URL(`/profile/${userId}`, request.nextUrl));
      }
    } catch (error) {
      console.log("Middleware error:", error.message);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",      // ← sirf exact /profile
    "/dashboard",
    "/onboarding",
    "/login",
    "/signup",
    "/verifyemail",
  ],
};