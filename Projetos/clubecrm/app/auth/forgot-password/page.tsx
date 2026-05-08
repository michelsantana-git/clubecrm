"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"'DM Sans','Segoe UI',sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card: { width:"100%", maxWidth:420, background:"#ffffff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label:{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input:{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" } as React.CSSProperties,
  btn:  { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err:  { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 } as React.CSSProperties,
};

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email)                        { setError("Digite seu e-mail."); return; }
    if (!/\S+@\S+\.\S+/.test(email))   { setError("E-mail inválido."); return; }
    setError(null); setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });

    // Sempre mostrar "enviado" — não revelar se o e-mail existe ou não (segurança)
    if (error && !error.message.includes("rate limit")) {
      setError("Erro ao enviar e-mail. Aguarde alguns instantes e tente novamente.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <main style={S.wrap}>
        <div style={S.card}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"#0a9e6e12", border:"2px solid #0a9e6e30", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px", fontSize:30 }}>
              ✉
            </div>
            <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 10px", letterSpacing:"-0.02em" }}>Link enviado!</h1>
            <p style={{ fontSize:14, color:"#6b7f99", lineHeight:1.6, margin:"0 0 6px" }}>
              Se esse e-mail estiver cadastrado, você receberá um link para criar uma nova senha em:
            </p>
            <p style={{ fontSize:14, fontWeight:700, color:"#0d1b2e", margin:"0 0 22px", fontFamily:"monospace" }}>{email}</p>
            <div style={{ padding:"12px 14px", background:"#1d6aff10", border:"1px solid #1d6aff30", borderRadius:10, fontSize:13, color:"#185FA5", marginBottom:22, lineHeight:1.5 }}>
              O link expira em <strong>1 hora</strong>. Verifique também a pasta de spam.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <button onClick={handleSubmit}
                style={{ ...S.btn, background:"transparent", color:"#1d6aff", border:"1.5px solid #e4e8f0" }}>
                Reenviar link
              </button>
              <Link href="/auth/login"
                style={{ display:"block", padding:"12px", textAlign:"center", color:"#6b7f99", fontSize:14, textDecoration:"none", fontWeight:600 }}>
                ← Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={S.wrap}>
      <div style={S.card}>
        <Link href="/auth/login" style={{ display:"flex", gap:6, alignItems:"center", color:"#6b7f99", fontSize:13, fontWeight:600, textDecoration:"none", marginBottom:24 }}>
          ← Voltar
        </Link>

        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:"#1d6aff10", border:"2px solid #1d6aff20", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px", fontSize:26 }}>🔑</div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Recuperar senha</h1>
          <p style={{ fontSize:14, color:"#6b7f99", margin:0, lineHeight:1.5 }}>
            Digite seu e-mail e enviaremos um link para criar uma nova senha.
          </p>
        </div>

        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:20 }}>
            <label style={S.label}>E-mail cadastrado</label>
            <input type="email" value={email} placeholder="seu@email.com" required autoFocus
              onChange={e => { setEmail(e.target.value); setError(null); }}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              style={{ ...S.input, borderColor: focused ? "#1d6aff" : "#e4e8f0", boxShadow: focused ? "0 0 0 3px #1d6aff14" : "none" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Enviando…" : "Enviar link de recuperação"}
          </button>
        </form>

        <div style={{ marginTop:20, padding:"12px 14px", background:"#faeeda", border:"1px solid #EF9F2730", borderRadius:10, fontSize:12, color:"#854F0B", lineHeight:1.5 }}>
          O link enviado é válido por <strong>1 hora</strong> e de uso único. Após clicar, você poderá criar uma nova senha.
        </div>
      </div>
    </main>
  );
}
