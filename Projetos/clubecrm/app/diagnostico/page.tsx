// Página de diagnóstico — acesse /diagnostico para verificar o ambiente
// REMOVA este arquivo após confirmar que tudo funciona
export default function DiagnosticoPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const checks = [
    {
      label: "NEXT_PUBLIC_SUPABASE_URL",
      ok: !!supabaseUrl,
      value: supabaseUrl ? supabaseUrl.replace(/^(https:\/\/[^.]{6}).*/, "$1***") : "❌ NÃO DEFINIDA",
    },
    {
      label: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ok: !!supabaseKey,
      value: supabaseKey ? "✓ Definida (" + supabaseKey.slice(0, 12) + "…)" : "❌ NÃO DEFINIDA",
    },
    {
      label: "Rota /auth/register",
      ok: true,
      value: "✓ Se esta página carregou, o roteamento Next.js está funcionando",
    },
    {
      label: "Middleware",
      ok: true,
      value: "✓ Esta rota passou pelo middleware sem bloqueio",
    },
  ];

  return (
    <main style={{ minHeight:"100vh", background:"#f5f6fa", fontFamily:"'DM Sans',sans-serif", padding:40 }}>
      <div style={{ maxWidth:600, margin:"0 auto" }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:6 }}>Diagnóstico ClubeCRM</h1>
        <p style={{ fontSize:14, color:"#6b7f99", marginBottom:28 }}>Remova esta página após validar.</p>

        {checks.map(c => (
          <div key={c.label} style={{ background:"#fff", border:"1px solid #e4e8f0", borderRadius:10, padding:"14px 18px", marginBottom:10, display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ fontSize:18, flexShrink:0 }}>{c.ok ? "✅" : "❌"}</div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"#0d1b2e", marginBottom:3 }}>{c.label}</div>
              <div style={{ fontSize:12, color:"#6b7f99", fontFamily:"monospace" }}>{c.value}</div>
            </div>
          </div>
        ))}

        <div style={{ marginTop:24, padding:"14px 18px", background:"#1d6aff10", border:"1px solid #1d6aff30", borderRadius:10, fontSize:13, color:"#185FA5", lineHeight:1.6 }}>
          <strong>Se SUPABASE_URL ou ANON_KEY aparecem como NÃO DEFINIDA:</strong><br/>
          Vá na Vercel → seu projeto → Settings → Environment Variables e verifique se as variáveis foram salvas corretamente. Após corrigir, faça um novo Redeploy.
        </div>

        <div style={{ marginTop:14, display:"flex", gap:10 }}>
          <a href="/auth/login" style={{ padding:"10px 18px", background:"#1d6aff", color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>Ir para Login</a>
          <a href="/auth/register" style={{ padding:"10px 18px", background:"transparent", color:"#1d6aff", border:"1px solid #1d6aff", borderRadius:8, fontSize:13, fontWeight:700, textDecoration:"none" }}>Ir para Cadastro</a>
        </div>
      </div>
    </main>
  );
}
