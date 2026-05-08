import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        name: "sb-session",
        lifetime: 60 * 60 * 24 * 7,
        domain: "clubecrm.vercel.app",
        path: "/",
        sameSite: "lax",
      },
    }
  );
