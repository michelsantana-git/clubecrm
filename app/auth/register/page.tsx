"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"'DM Sans','Segoe UI',sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card:  { width:"100%", maxWidth:440, background:"#ffffff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label: { fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input: { width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" } as React.CSSProperties,
  btn:   { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err:   { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:16, lineHeight:1.6 } as React.CSSProperties,
  ok:    { padding:"12px 14px", background:"#0a9e6e12", border:"1px solid #0a9e6e30", borderRadius:10, color:"#0a9e6e", fontSize:13, marginBottom:16, lineHeight:1.6 } as React.CSSProperties,
};

// Regras de senha — devem bater exatamente com a política do Supabase
const RULES = [
  { label:"8 ou mais caracteres",    test: (p: string) => p.length >= 8 },
  { label:"Letra maiúscula (A-Z)",   test: (p: string) => /[A-Z]/.test(p) },
  { label:"Letra minúscula (a-z)",   test: (p: string) => /[a-z]/.test(p) },
  { label:"Número (0-9)",            test: (p: string) => /[0-9]/.test(p) },
];

const score = (p: string) => RULES.filter(r => r.test(p)).length;
const strengthColor = ["#e4e8f0","#d42e2e","#e07020","#c47f00","#0a9e6e"];
const strengthLabel = ["","Muito fraca","Fraca","Razoável","Forte"];

// Traduz erros do Supabase para português
function translateError(msg: string): string {
  if (msg.includes("already registered") || msg.includes("User already registered"))
    return "Este e-mail já está cadastrado. Tente fazer login ou recuperar a senha.";
  if (msg.includes("did not match the expected pattern") || msg.includes("Password should"))
    return "A senha não atende aos requisitos. Use pelo menos 8 caracteres com maiúscula, minúscula e número.";
  if (msg.includes("invalid email") || msg.includes("Invalid email"))
    return "E-mail inválido. Verifique o endereço digitado.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  if (msg.includes("network") || msg.includes("fetch"))
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  return "Erro ao criar conta. Tente novamente em instantes.";
}

export default function RegisterPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [sent,     setSent]     = useState(false);
  const [focused,  setFocused]  = useState("");

  const pw_score = score(password);
  const allRulesOk = RULES.every(r => r.test(password));

  const validate = (): string | null => {
    if (!name.trim() || name.trim().length < 2)
      return "Nome deve ter pelo menos 2 caracteres.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      return "E-mail inválido.";
    if (!password)
      return "Digite uma senha.";
    if (!allRulesOk)
      return "A senha não atende a todos os requisitos listados abaixo.";
    if (password !== confirm)
      return "As senhas não coincidem.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError(null); setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(translateError(error.message));
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  const inp = (field: string, extraStyle?: React.CSSProperties) => ({
    ...S.input,
    borderColor: focused === field ? "#1d6aff" : "#e4e8f0",
    boxShadow:   focused === field ? "0 0 0 3px #1d6aff14" : "none",
    ...extraStyle,
  });

  // Tela de confirmação
  if (sent) {
    return (
      <main style={S.wrap}>
        <div style={S.card}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"#0a9e6e12", border:"2px solid #0a9e6e30", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:32 }}>✉</div>
            <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 10px", letterSpacing:"-0.02em" }}>Confirme seu e-mail</h1>
            <p style={{ fontSize:14, color:"#6b7f99", lineHeight:1.6, margin:"0 0 6px" }}>Enviamos um link de confirmação para</p>
            <p style={{ fontSize:14, fontWeight:700, color:"#0d1b2e", margin:"0 0 22px", fontFamily:"monospace" }}>{email}</p>
            <div style={S.ok}>
              Clique no link do e-mail para ativar sua conta. Verifique também a pasta de spam.
            </div>
            <Link href="/auth/login" style={{ display:"block", padding:"12px", background:"transparent", color:"#1d6aff", border:"1.5px solid #e4e8f0", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", textAlign:"center" }}>
              ← Voltar para o login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={S.wrap}>
      <div style={S.card}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:24 }}>
          <div style={{ width:34, height:34, background:"linear-gradient(135deg,#1d6aff,#5b21b6)", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:"#fff" }}>C</div>
          <span style={{ fontSize:19, fontWeight:900, color:"#0d1b2e", letterSpacing:"-0.03em" }}>ClubeCRM</span>
        </div>

        <div style={{ textAlign:"center", marginBottom:24 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 5px", letterSpacing:"-0.02em" }}>Criar sua conta</h1>
          <p style={{ fontSize:13, color:"#6b7f99", margin:0 }}>Comece gratuitamente, sem cartão de crédito</p>
        </div>

        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleRegister}>
          {/* Nome */}
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Nome completo *</label>
            <input type="text" value={name} placeholder="João Silva" required autoFocus
              onChange={e => { setName(e.target.value); setError(null); }}
              onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
              style={inp("name")} />
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>E-mail *</label>
            <input type="email" value={email} placeholder="seu@email.com" required
              onChange={e => { setEmail(e.target.value); setError(null); }}
              onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
              style={inp("email")} />
          </div>

          {/* Senha */}
          <div style={{ marginBottom:10 }}>
            <label style={S.label}>Senha *</label>
            <input type="password" value={password} placeholder="Crie uma senha forte" required
              onChange={e => { setPassword(e.target.value); setError(null); }}
              onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
              style={inp("password")} />
          </div>

          {/* Requisitos de senha — sempre visíveis */}
          <div style={{ background:"#f5f6fa", border:"1px solid #e4e8f0", borderRadius:9, padding:"12px 14px", marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#6b7f99", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Requisitos da senha</div>
            {RULES.map(r => {
              const ok = r.test(password);
              return (
                <div key={r.label} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                  <span style={{ fontSize:13, color: ok ? "#0a9e6e" : "#d42e2e", fontWeight:700, flexShrink:0 }}>
                    {ok ? "✓" : "✗"}
                  </span>
                  <span style={{ fontSize:12, color: ok ? "#0a9e6e" : "#6b7f99", fontWeight: ok ? 600 : 400 }}>
                    {r.label}
                  </span>
                </div>
              );
            })}
            {/* Barra de força */}
            {password.length > 0 && (
              <div style={{ marginTop:10 }}>
                <div style={{ display:"flex", gap:3, marginBottom:4 }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i <= pw_score ? strengthColor[pw_score] : "#e4e8f0", transition:"background 0.3s" }} />
                  ))}
                </div>
                <div style={{ fontSize:11, fontWeight:700, color:strengthColor[pw_score], textAlign:"right" }}>
                  {strengthLabel[pw_score]}
                </div>
              </div>
            )}
          </div>

          {/* Confirmar senha */}
          <div style={{ marginBottom:20 }}>
            <label style={S.label}>Confirmar senha *</label>
            <input type="password" value={confirm} placeholder="Repita a senha" required
              onChange={e => { setConfirm(e.target.value); setError(null); }}
              onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")}
              style={inp("confirm", {
                borderColor: confirm && confirm !== password ? "#d42e2e" : focused === "confirm" ? "#1d6aff" : "#e4e8f0",
              })} />
            {confirm && confirm !== password && (
              <div style={{ fontSize:12, color:"#d42e2e", marginTop:5 }}>As senhas não coincidem</div>
            )}
            {confirm && confirm === password && password.length > 0 && (
              <div style={{ fontSize:12, color:"#0a9e6e", marginTop:5 }}>✓ Senhas coincidem</div>
            )}
          </div>

          <button type="submit" disabled={loading || !allRulesOk || password !== confirm}
            style={{ ...S.btn, opacity: (loading || !allRulesOk || password !== confirm) ? 0.5 : 1, cursor: (loading || !allRulesOk || password !== confirm) ? "not-allowed" : "pointer" }}>
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
          <div style={{ flex:1, height:1, background:"#e4e8f0" }} />
          <span style={{ fontSize:12, color:"#6b7f99", fontWeight:600 }}>ou</span>
          <div style={{ flex:1, height:1, background:"#e4e8f0" }} />
        </div>

        <div style={{ textAlign:"center", fontSize:14, color:"#6b7f99" }}>
          Já tem conta?{" "}
          <Link href="/auth/login" style={{ color:"#1d6aff", fontWeight:700, textDecoration:"none" }}>
            Fazer login
          </Link>
        </div>
      </div>
    </main>
  );
}
