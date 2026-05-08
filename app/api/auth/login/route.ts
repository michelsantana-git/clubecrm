import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (!email || !password) {
    return NextResponse.redirect(new URL("/auth/login?error=missing_fields", appUrl));
  }

  const response = NextResponse.redirect(new URL("/dashboard", appUrl), { status: 303 });

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

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const code = error.message === "Invalid login credentials"
      ? "invalid_credentials"
      : error.message.includes("Email not confirmed")
      ? "email_not_confirmed"
      : "unknown";
    return NextResponse.redirect(new URL(`/auth/login?error=${code}`, appUrl), { status: 303 });
  }

  return response;
}
