import { NextResponse } from "next/server";

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  const isPublicPath =
    path === "/login" ||
    path === "/signup" ||
    path === "/verifyemail";

  // 1. Not logged in → redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // 2. Logged in → block auth pages
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", request.nextUrl));
  }

  // 3. Handle profile routing
  if (token && path === "/profile") {
    try {
      const res = await fetch(new URL("/api/users/me", request.url), {
        headers: { Cookie: `token=${token}` },
      });

      const data = await res.json();
      const profileCompleted = data?.data?.profileCompleted;
      const userId = data?.data?._id;

      console.log("profileCompleted:", profileCompleted);

      // ✅ if profile NOT completed → stay on /profile
      if (!profileCompleted) {
        return NextResponse.next();
      }

      // ✅ if completed → go to /profile/[id]
      return NextResponse.redirect(
        new URL(`/profile/${userId}`, request.nextUrl)
      );

    } catch (error) {
      console.log("Middleware error:", error.message);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/dashboard",
    "/onboarding",
    "/login",
    "/signup",
    "/verifyemail",
  ],
};