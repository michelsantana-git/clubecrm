import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get("code");
  const token = searchParams.get("token");
  const type  = searchParams.get("type");
  const next  = searchParams.get("next") ?? "/dashboard";

  const supabase = createClient();

  // Caso 1: code (OAuth / magic link moderno)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Caso 2: token PKCE direto (confirmação de e-mail)
  if (token && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any,
    });
    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Falhou
  return NextResponse.redirect(
    `${origin}/auth/login?error=link_invalido_ou_expirado`
  );
}
