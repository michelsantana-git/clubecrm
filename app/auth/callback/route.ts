import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Este endpoint é chamado automaticamente pelo Supabase quando o usuário
// clica no link de confirmação de e-mail ou de recuperação de senha.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code  = searchParams.get("code");
  const type  = searchParams.get("type");   // "recovery" | "signup"
  const next  = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Recuperação de senha → levar para tela de nova senha
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      // Confirmação de cadastro → levar para dashboard
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Código inválido ou expirado
  return NextResponse.redirect(
    `${origin}/auth/login?error=link_invalido_ou_expirado`
  );
}
