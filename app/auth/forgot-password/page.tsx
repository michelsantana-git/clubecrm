"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card: { width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label:{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input:{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" } as React.CSSProperties,
  btn:  { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err:  { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 } as React.CSSProperties,
};

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Digite seu e-mail."); return; }
    setError(null); setLoading(true);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/auth/callback?type=recovery`,
    });

    if (error && !error.message.includes("rate limit")) {
      setError("Erro ao enviar. Tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) return (
    <main style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✉</div>
          <h1 style={{ fontSize:20, fontWeight:900, color:"#0d1b2e", marginBottom:10 }}>Link enviado!</h1>
          <p style={{ fontSize:14, color:"#6b7f99", marginBottom:20 }}>Verifique <strong>{email}</strong> e clique no link. Confira o spam.</p>
          <Link href="/auth/login" style={{ color:"#1d6aff", fontWeight:700, textDecoration:"none", fontSize:14 }}>← Voltar para o login</Link>
        </div>
      </div>
    </main>
  );

  return (
    <main style={S.wrap}>
      <div style={S.card}>
        <Link href="/auth/login" style={{ display:"block", color:"#6b7f99", fontSize:13, fontWeight:600, textDecoration:"none", marginBottom:24 }}>← Voltar</Link>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 8px" }}>Recuperar senha</h1>
          <p style={{ fontSize:14, color:"#6b7f99", margin:0 }}>Enviaremos um link para criar uma nova senha.</p>
        </div>
        {error && <div style={S.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:20 }}>
            <label style={S.label}>E-mail cadastrado</label>
            <input type="email" value={email} placeholder="seu@email.com" required autoFocus
              onChange={e => { setEmail(e.target.value); setError(null); }} style={S.input} />
          </div>
          <button type="submit" disabled={loading}
            style={{ ...S.btn, opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}>
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>
      </div>
    </main>
  );
}
