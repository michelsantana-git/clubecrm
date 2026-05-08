import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;
  const origin   = request.nextUrl.origin;

  if (!email || !password) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_fields", origin), { status: 303 });
  }

  // Criar resposta de redirect para o dashboard
  const successResponse = NextResponse.redirect(new URL("/dashboard", origin), { status: 303 });
  const errorResponse = (code: string) =>
    NextResponse.redirect(new URL(`/auth/login?error=${code}`, origin), { status: 303 });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Setar cookies na resposta de sucesso
          cookiesToSet.forEach(({ name, value, options }) => {
            successResponse.cookies.set(name, value, {
              ...options,
              sameSite: "lax",
              httpOnly: true,
              secure: true,
              path: "/",
            });
          });
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
    return errorResponse(code);
  }

  if (!data.session) {
    return errorResponse("no_session");
  }

  return successResponse;
}
