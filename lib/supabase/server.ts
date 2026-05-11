import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

// Extrai a sessão do nosso cookie customizado
function getSessionFromCookie() {
  const cookieStore = cookies();
  const cookie = cookieStore.get("sb-btkhntalnjfwdqkioeoi-auth-token");
  if (!cookie?.value) return null;
  try {
    return JSON.parse(decodeURIComponent(cookie.value));
  } catch { return null; }
}

// Cliente autenticado com o access_token do nosso cookie
export const createClient = () => {
  const session = getSessionFromCookie();
  
  const client = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {},
      },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  return client;
};

// Cliente admin — ignora RLS
export const createAdminClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
};
