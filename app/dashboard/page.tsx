import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main style={{ minHeight:"100vh", background:"#f0f4f8", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:40 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0d1b2e", marginBottom:10, letterSpacing:"-0.03em" }}>
          Ola, {profile?.name ?? user.email}!
        </h1>
        <p style={{ fontSize:15, color:"#6b7f99", marginBottom:28 }}>
          Seu ClubeCRM esta configurado e funcionando.
        </p>
        <div style={{ background:"#fff", border:"1px solid #e4e8f0", borderRadius:16, padding:"24px 28px", maxWidth:480, margin:"0 auto" }}>
          <p style={{ fontSize:14, color:"#3d5570", lineHeight:1.6, marginBottom:16 }}>
            Login, cadastro e autenticacao funcionando corretamente.
          </p>
          <a href="/auth/login" onClick={async (e) => { e.preventDefault(); const { createClient } = await import("@/lib/supabase/client"); const sb = createClient(); await sb.auth.signOut(); window.location.href = "/auth/login"; }}
            style={{ display:"inline-block", padding:"10px 24px", background:"#1d6aff", color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>
            Sair
          </a>
        </div>
      </div>
    </main>
  );
}
