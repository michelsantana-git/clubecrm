"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"'DM Sans','Segoe UI',sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card:  { width:"100%", maxWidth:420, background:"#ffffff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label: { fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input: { width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" } as React.CSSProperties,
  btn:   { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err:   { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18, lineHeight:1.5 } as React.CSSProperties,
  info:  { padding:"12px 14px", background:"#1d6aff10", border:"1px solid #1d6aff30", borderRadius:10, color:"#185FA5", fontSize:13, marginBottom:18, lineHeight:1.5 } as React.CSSProperties,
};

// Componente interno que usa useSearchParams — deve estar dentro do Suspense
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [info,     setInfo]     = useState<string | null>(null);
  const [focused,  setFocused]  = useState("");

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "link_invalido_ou_expirado") {
      setError("O link expirou ou já foi usado. Solicite um novo abaixo.");
    }
    const msg = searchParams.get("message");
    if (msg === "senha_alterada") {
      setInfo("Senha alterada com sucesso! Faça login com a nova senha.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha e-mail e senha."); return; }
    setError(null); setInfo(null); setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setError("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.");
      } else {
        setError("Erro ao fazer login: " + error.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const inp = (field: string) => ({
    ...S.input,
    borderColor: focused === field ? "#1d6aff" : "#e4e8f0",
    boxShadow:   focused === field ? "0 0 0 3px #1d6aff14" : "none",
  });

  return (
    <div style={S.card}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:28 }}>
        <div style={{ width:36, height:36, background:"linear-gradient(135deg,#1d6aff,#5b21b6)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff" }}>C</div>
        <span style={{ fontSize:20, fontWeight:900, color:"#0d1b2e", letterSpacing:"-0.03em" }}>ClubeCRM</span>
      </div>

      <div style={{ textAlign:"center", marginBottom:28 }}>
        <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 6px", letterSpacing:"-0.02em" }}>Bem-vindo de volta</h1>
        <p style={{ fontSize:14, color:"#6b7f99", margin:0 }}>Entre na sua conta para continuar</p>
      </div>

      {error && <div style={S.err}>{error}</div>}
      {info  && <div style={S.info}>{info}</div>}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom:16 }}>
          <label style={S.label}>E-mail</label>
          <input type="email" value={email} placeholder="seu@email.com" required autoFocus
            onChange={e => { setEmail(e.target.value); setError(null); }}
            onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
            style={inp("email")} />
        </div>

        <div style={{ marginBottom:8 }}>
          <label style={S.label}>Senha</label>
          <div style={{ position:"relative" }}>
            <input type={showPw ? "text" : "password"} value={password} placeholder="Sua senha" required
              onChange={e => { setPassword(e.target.value); setError(null); }}
              onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
              style={{ ...inp("password"), paddingRight:56 }} />
            <button type="button" onClick={() => setShowPw(s => !s)}
              style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#6b7f99", fontSize:11, fontWeight:600, padding:"4px 6px" }}>
              {showPw ? "ocultar" : "mostrar"}
            </button>
          </div>
        </div>

        <div style={{ textAlign:"right", marginBottom:22 }}>
          <Link href="/auth/forgot-password" style={{ fontSize:13, color:"#1d6aff", fontWeight:600, textDecoration:"none" }}>
            Esqueci minha senha
          </Link>
        </div>

        <button type="submit" disabled={loading}
          style={{ ...S.btn, opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}>
          {loading ? "Entrando…" : "Entrar na conta"}
        </button>
      </form>

      <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0" }}>
        <div style={{ flex:1, height:1, background:"#e4e8f0" }} />
        <span style={{ fontSize:12, color:"#6b7f99", fontWeight:600 }}>ou</span>
        <div style={{ flex:1, height:1, background:"#e4e8f0" }} />
      </div>

      <div style={{ textAlign:"center", fontSize:14, color:"#6b7f99" }}>
        Não tem conta?{" "}
        <Link href="/auth/register" style={{ color:"#1d6aff", fontWeight:700, textDecoration:"none" }}>
          Criar conta grátis
        </Link>
      </div>
    </div>
  );
}

// Página raiz envolve o form em Suspense — obrigatório no Next.js 15
export default function LoginPage() {
  return (
    <main style={S.wrap}>
      <Suspense fallback={
        <div style={{ color:"#6b7f99", fontSize:14 }}>Carregando…</div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
