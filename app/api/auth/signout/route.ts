import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/auth/login", origin), { status: 303 });
  response.cookies.set("sb-btkhntalnjfwdqkioeoi-auth-token", "", {
    maxAge: 0, path: "/",
  });
  return response;
}
