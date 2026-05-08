import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email    = formData.get("email") as string;
  const password = formData.get("password") as string;
  const origin   = request.nextUrl.origin;

  const redirect = (path: string) =>
    new NextResponse(
      `<!DOCTYPE html><html><head>
        <meta http-equiv="refresh" content="0;url=${origin}${path}">
      </head><body><p>Redirecionando...</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );

  if (!email || !password) {
    return redirect("/auth/login?error=missing_fields");
  }

  const cookieHeader: string[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const opts = [
              `${name}=${encodeURIComponent(value)}`,
              "Path=/",
              options?.maxAge ? `Max-Age=${options.maxAge}` : "",
              "SameSite=Lax",
            ].filter(Boolean).join("; ");
            cookieHeader.push(opts);
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
    return redirect(`/auth/login?error=${code}`);
  }

  if (!data.session) {
    return redirect("/auth/login?error=no_session");
  }

  // Login bem sucedido — setar cookies e ir para dashboard
  const response = redirect("/dashboard");
  cookieHeader.forEach(c => response.headers.append("Set-Cookie", c));
  return response;
}
