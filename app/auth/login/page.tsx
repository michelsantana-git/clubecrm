"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card: { width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label: { fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input: { width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" } as React.CSSProperties,
  btn: { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err: { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 } as React.CSSProperties,
};

function LoginForm() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), password,
    });
    if (error) {
      setError("Erro: " + error.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      // Mostrar cookies para debug
      setDebug("LOGIN OK - cookies: " + document.cookie.substring(0, 200));
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 3000);
    } else {
      setError("Sem sessao.");
      setLoading(false);
    }
  };

  return (
    <div style={S.card}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 6px" }}>ClubeCRM — Login</h1>
      </div>
      {error && <div style={S.err}>{error}</div>}
      {debug && (
        <div style={{ padding:"12px", background:"#e8f4ff", border:"1px solid #1d6aff30", borderRadius:10, fontSize:11, color:"#185FA5", marginBottom:16, wordBreak:"break-all", fontFamily:"monospace" }}>
          {debug}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom:16 }}>
          <label style={S.label}>E-mail</label>
          <input type="email" value={email} placeholder="seu@email.com" required autoFocus
            onChange={e => setEmail(e.target.value)} style={S.input} />
        </div>
        <div style={{ marginBottom:22 }}>
          <label style={S.label}>Senha</label>
          <input type="password" value={password} placeholder="Sua senha" required
            onChange={e => setPassword(e.target.value)} style={S.input} />
        </div>
        <button type="submit" disabled={loading}
          style={{ ...S.btn, opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#6b7f99" }}>
        <a href="/auth/register" style={{ color:"#1d6aff" }}>Criar conta</a>
        {" · "}
        <a href="/auth/forgot-password" style={{ color:"#1d6aff" }}>Esqueci a senha</a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main style={S.wrap}>
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
