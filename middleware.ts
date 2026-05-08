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

  // Listar todos os cookies para debug
  const allCookies = request.cookies.getAll();
  const cookieNames = allCookies.map(c => c.name).join(', ');
  
  // Verificar se tem qualquer cookie de sessão do Supabase
  const hasSession = allCookies.some(c => 
    c.name.includes('supabase') || 
    c.name.includes('sb-') ||
    c.name.includes('session') ||
    c.name.includes('token')
  );

  if (!hasSession) {
    // Redireciona com info de debug na URL
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('debug', `no_cookie_found_cookies_were:_${cookieNames || 'none'}`);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
