import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Usar o origin da requisição em vez de variável de ambiente
  const origin = request.nextUrl.origin;

  if (!email || !password) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_fields`, { status: 303 });
  }

  const response = NextResponse.redirect(`${origin}/dashboard`, { status: 303 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code = error.message === "Invalid login credentials"
      ? "invalid_credentials"
      : error.message.includes("Email not confirmed")
      ? "email_not_confirmed"
      : encodeURIComponent(error.message);
    return NextResponse.redirect(`${origin}/auth/login?error=${code}`, { status: 303 });
  }

  if (!data.session) {
    return NextResponse.redirect(`${origin}/auth/login?error=no_session`, { status: 303 });
  }

  return response;
}
