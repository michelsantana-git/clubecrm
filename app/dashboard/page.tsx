import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main style={{ minHeight:"100vh", background:"#f0f4f8", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:40 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0d1b2e", marginBottom:10 }}>
          Ola, {user.email}!
        </h1>
        <p style={{ fontSize:15, color:"#6b7f99", marginBottom:28 }}>
          Login funcionando com sucesso!
        </p>
        <a href="/auth/login" style={{ padding:"10px 24px", background:"#1d6aff", color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>
          Sair
        </a>
      </div>
    </main>
  );
}
