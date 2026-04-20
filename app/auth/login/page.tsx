"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setError(null); setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos. Verifique e tente novamente."
          : "Erro ao fazer login. Tente novamente."
      );
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    // UI renderizada pelo componente React do auth-system.jsx integrado ao Next.js
    // Em produção substituir pelo componente LoginScreen do auth-system.jsx
    <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f6fa", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:"1px solid #e4e8f0" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:28, fontWeight:900, letterSpacing:"-0.03em", color:"#0d1b2e", marginBottom:6 }}>ClubeCRM</div>
          <div style={{ fontSize:14, color:"#6b7f99" }}>Entre na sua conta para continuar</div>
        </div>
        {error && <div style={{ padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 }}>E-mail</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required
              style={{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 }}>Senha</label>
            <input type={showPw?"text":"password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Sua senha" required
              style={{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ textAlign:"right", marginBottom:22 }}>
            <Link href="/auth/forgot-password" style={{ fontSize:13, color:"#1d6aff", fontWeight:600, textDecoration:"none" }}>Esqueci minha senha</Link>
          </div>
          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
            {loading ? "Entrando…" : "Entrar na conta"}
          </button>
        </form>
        <div style={{ textAlign:"center", marginTop:20, fontSize:14, color:"#6b7f99" }}>
          Não tem conta? <Link href="/auth/register" style={{ color:"#1d6aff", fontWeight:700, textDecoration:"none" }}>Criar conta grátis</Link>
        </div>
      </div>
    </main>
  );
}
