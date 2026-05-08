import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code        = searchParams.get("code");
  const token       = searchParams.get("token");
  const type        = searchParams.get("type");
  const redirectTo  = searchParams.get("redirect_to");

  // Se o Supabase redirecionou com redirect_to contendo nosso callback,
  // o token PKCE já foi processado pelo Supabase — só precisamos
  // pegar a sessão que foi criada
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  let session = null;

  // Caso 1: code OAuth/PKCE
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) session = data.session;
  }

  // Caso 2: token PKCE direto (vem como ?token=pkce_...)
  if (!session && token) {
    // token PKCE — trocar pela sessão
    const { data, error } = await supabase.auth.exchangeCodeForSession(token);
    if (!error && data.session) session = data.session;
  }

  if (!session) {
    return NextResponse.redirect(
      new URL("/auth/login?error=link_invalido_ou_expirado", origin)
    );
  }

  const { access_token, refresh_token, expires_in } = session;
  const cookieName  = "sb-btkhntalnjfwdqkioeoi-auth-token";
  const cookieValue = JSON.stringify({
    access_token, refresh_token, expires_in,
    token_type: "bearer",
    user: session.user,
  });

  const dest = type === "recovery" ? "/auth/reset-password" : "/dashboard";
  const response = NextResponse.redirect(new URL(dest, origin));

  response.cookies.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: expires_in,
    path: "/",
  });

  return response;
}
