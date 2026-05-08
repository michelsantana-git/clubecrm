import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Server Component — verifica sessão e redireciona para o app
export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Buscar profile
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
          Olá, {profile?.name ?? user.email}!
        </h1>
        <p style={{ fontSize:15, color:"#6b7f99", marginBottom:28 }}>
          Seu ClubeCRM está configurado e pronto para uso.
        </p>
        <div style={{ background:"#fff", border:"1px solid #e4e8f0", borderRadius:16, padding:"24px 28px", maxWidth:480, margin:"0 auto", boxShadow:"0 2px 16px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize:13, fontWeight:700, color:"#6b7f99", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:12 }}>Próximo passo</div>
          <p style={{ fontSize:14, color:"#3d5570", lineHeight:1.6 }}>
            Integre o componente <code style={{ background:"#f0f4f8", padding:"2px 6px", borderRadius:4, fontSize:12 }}>crm-v4.jsx</code> aqui como Client Component para ter o CRM completo rodando com dados reais do Supabase.
          </p>
        </div>
      </div>
    </main>
  );
}
