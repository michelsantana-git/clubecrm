import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";

export const createClient = () => {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Retorna o access_token do cookie para uso no servidor
export const getSessionFromCookie = async () => {
  const cookieStore = await cookies();
  const raw = cookieStore.get("sb-btkhntalnjfwdqkioeoi-auth-token")?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed?.access_token ?? null;
  } catch {
    return null;
  }
};
