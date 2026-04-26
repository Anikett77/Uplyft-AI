import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
    { status: 302 }
  );
  response.cookies.set("token", "", { httpOnly: true, expires: new Date(0), path: "/" });
  // Prevent browser from caching the page
  response.headers.set("Cache-Control", "no-store");
  return response;
}