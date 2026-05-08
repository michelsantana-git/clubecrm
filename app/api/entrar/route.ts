import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;
  const origin   = request.nextUrl.origin;

  if (!email || !password) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_fields", origin), { status: 303 });
  }

  // Usar o cliente simples para autenticar
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code = error.message === "Invalid login credentials"
      ? "invalid_credentials"
      : error.message.includes("Email not confirmed")
      ? "email_not_confirmed"
      : encodeURIComponent(error.message);
    return NextResponse.redirect(new URL(`/auth/login?error=${code}`, origin), { status: 303 });
  }

  if (!data.session) {
    return NextResponse.redirect(new URL("/auth/login?error=no_session", origin), { status: 303 });
  }

  const { access_token, refresh_token, expires_in } = data.session;

  // Nome exato do cookie que o middleware verifica
  const cookieName = `sb-btkhntalnjfwdqkioeoi-auth-token`;
  const cookieValue = JSON.stringify({
    access_token,
    refresh_token,
    expires_in,
    token_type: "bearer",
    user: data.user,
  });

  const response = NextResponse.redirect(new URL("/dashboard", origin), { status: 303 });

  response.cookies.set(cookieName, cookieValue, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: expires_in,
    path: "/",
  });

  return response;
}
