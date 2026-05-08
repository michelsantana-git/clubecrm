import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const token = searchParams.get("token");
  const type  = searchParams.get("type"); // "recovery" | "signup"

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  let session = null;

  // Caso 1: code (PKCE flow)
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) session = data.session;
  }

  // Caso 2: token hash (e-mail confirmation/recovery)
  if (!session && token && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any,
    });
    if (!error) session = data.session;
  }

  if (!session) {
    return NextResponse.redirect(new URL("/auth/login?error=link_invalido_ou_expirado", origin));
  }

  const { access_token, refresh_token, expires_in } = session;
  const cookieName = "sb-btkhntalnjfwdqkioeoi-auth-token";
  const cookieValue = JSON.stringify({
    access_token, refresh_token, expires_in,
    token_type: "bearer",
    user: session.user,
  });

  // Recuperação de senha → ir para tela de nova senha
  if (type === "recovery") {
    const response = NextResponse.redirect(new URL("/auth/reset-password", origin));
    response.cookies.set(cookieName, cookieValue, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: expires_in, path: "/",
    });
    return response;
  }

  // Confirmação de cadastro → ir para dashboard
  const response = NextResponse.redirect(new URL("/dashboard", origin));
  response.cookies.set(cookieName, cookieValue, {
    httpOnly: true, secure: true, sameSite: "lax",
    maxAge: expires_in, path: "/",
  });
  return response;
}
