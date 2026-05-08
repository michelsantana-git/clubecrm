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
  info: { padding:"12px 14px", background:"#1d6aff10", border:"1px solid #1d6aff30", borderRadius:10, color:"#185FA5", fontSize:13, marginBottom:18 } as React.CSSProperties,
};

function LoginForm() {
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("error") === "link_invalido_ou_expirado")
      setError("O link expirou ou ja foi usado.");
    if (searchParams.get("message") === "senha_alterada")
      setInfo("Senha alterada! Faca login.");
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setError(null); setInfo(null); setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(), password,
    });
    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "E-mail ou senha incorretos."
        : error.message.includes("Email not confirmed")
        ? "Confirme seu e-mail antes de entrar."
        : "Erro: " + error.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      window.location.href = "/dashboard";
    } else {
      setError("Sessao nao iniciada. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div style={S.card}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:28 }}>
        <div style={{ width:36, height:36, background:"linear-gradient(135deg,#1d6aff,#5b21b6)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff" }}>C</div>
        <span style={{ fontSize:20, fontWeight:900, color:"#0d1b2e" }}>ClubeCRM</span>
      </div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 6px" }}>Bem-vindo de volta</h1>
        <p style={{ fontSize:14, color:"#6b7f99", margin:0 }}>Entre na sua conta para continuar</p>
      </div>
      {error && <div style={S.err}>{error}</div>}
      {info && <div style={S.info}>{info}</div>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom:16 }}>
          <label style={S.label}>E-mail</label>
          <input type="email" value={email} placeholder="seu@email.com" required autoFocus
            onChange={e => { setEmail(e.target.value); setError(null); }} style={S.input} />
        </div>
        <div style={{ marginBottom:8 }}>
          <label style={S.label}>Senha</label>
          <input type="password" value={password} placeholder="Sua senha" required
            onChange={e => { setPassword(e.target.value); setError(null); }} style={S.input} />
        </div>
        <div style={{ textAlign:"right", marginBottom:22 }}>
          <a href="/auth/forgot-password" style={{ fontSize:13, color:"#1d6aff", fontWeight:600, textDecoration:"none" }}>Esqueci minha senha</a>
        </div>
        <button type="submit" disabled={loading}
          style={{ ...S.btn, opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}>
          {loading ? "Entrando..." : "Entrar na conta"}
        </button>
      </form>
      <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
        <div style={{ flex:1, height:1, background:"#e4e8f0" }} />
        <span style={{ fontSize:12, color:"#6b7f99", fontWeight:600 }}>ou</span>
        <div style={{ flex:1, height:1, background:"#e4e8f0" }} />
      </div>
      <div style={{ textAlign:"center", fontSize:14, color:"#6b7f99" }}>
        Nao tem conta?{" "}
        <a href="/auth/register" style={{ color:"#1d6aff", fontWeight:700, textDecoration:"none" }}>Criar conta gratis</a>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main style={S.wrap}>
      <Suspense fallback={<div style={{ color:"#6b7f99" }}>Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
