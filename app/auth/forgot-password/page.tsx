"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]     = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError("Digite seu e-mail."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("E-mail inválido."); return; }
    setError(null); setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
      setError("Erro ao enviar e-mail. Tente novamente em instantes.");
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f6fa", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ width:"100%", maxWidth:400, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:"1px solid #e4e8f0", textAlign:"center" }}>
          <div style={{ width:64, height:64, borderRadius:"50%", background:"#0a9e6e12", border:"2px solid #0a9e6e30", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:28 }}>✓</div>
          <h2 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:10 }}>Link enviado!</h2>
          <p style={{ fontSize:14, color:"#6b7f99", lineHeight:1.6, marginBottom:6 }}>Enviamos um link de recuperação para</p>
          <p style={{ fontSize:14, fontWeight:700, color:"#0d1b2e", marginBottom:24, fontFamily:"monospace" }}>{email}</p>
          <div style={{ padding:"12px 14px", background:"#1d6aff12", border:"1px solid #1d6aff30", borderRadius:10, fontSize:13, color:"#1d6aff", marginBottom:24 }}>
            O link expira em 30 minutos. Verifique também a pasta de spam.
          </div>
          <Link href="/auth/login" style={{ display:"block", padding:"12px", background:"transparent", color:"#1d6aff", border:"1.5px solid #e4e8f0", borderRadius:10, fontSize:13, fontWeight:700, textDecoration:"none", textAlign:"center" }}>
            ← Voltar para o login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f6fa", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:"1px solid #e4e8f0" }}>
        <Link href="/auth/login" style={{ display:"flex", gap:6, alignItems:"center", color:"#6b7f99", fontSize:13, fontWeight:600, textDecoration:"none", marginBottom:24 }}>← Voltar</Link>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:"#1d6aff12", border:"2px solid #1d6aff20", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:22 }}>🔑</div>
          <h2 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:8 }}>Recuperar senha</h2>
          <p style={{ fontSize:14, color:"#6b7f99", lineHeight:1.5 }}>Digite seu e-mail e enviaremos um link para criar uma nova senha.</p>
        </div>
        {error && <div style={{ padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:20 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 }}>E-mail cadastrado</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(null); }} placeholder="seu@email.com" required
              style={{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
            {loading ? "Enviando…" : "Enviar link de recuperação"}
          </button>
        </form>
      </div>
    </main>
  );
}
