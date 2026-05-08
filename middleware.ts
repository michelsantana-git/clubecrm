import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  '/auth/',
  '/api/public',
  '/p/',
  '/diagnostico',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get('sb-btkhntalnjfwdqkioeoi-auth-token');

  if (!cookie?.value) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(cookie.value));
    if (!parsed?.access_token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
