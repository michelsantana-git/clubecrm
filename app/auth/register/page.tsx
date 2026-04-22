"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap:  { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"'DM Sans','Segoe UI',sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card:  { width:"100%", maxWidth:440, background:"#ffffff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  logo:  { textAlign:"center", marginBottom:28 } as React.CSSProperties,
  title: { fontSize:24, fontWeight:900, letterSpacing:"-0.03em", color:"#0d1b2e", margin:"0 0 4px" } as React.CSSProperties,
  sub:   { fontSize:14, color:"#6b7f99", margin:0 } as React.CSSProperties,
  label: { fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input: { width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.2s" } as React.CSSProperties,
  inputFocus: { borderColor:"#1d6aff", boxShadow:"0 0 0 3px #1d6aff14" } as React.CSSProperties,
  btn:   { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit", transition:"opacity 0.15s" } as React.CSSProperties,
  err:   { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 } as React.CSSProperties,
  ok:    { padding:"12px 14px", background:"#0a9e6e12", border:"1px solid #0a9e6e30", borderRadius:10, color:"#0a9e6e", fontSize:13, marginBottom:18, lineHeight:1.5 } as React.CSSProperties,
  divider: { display:"flex", alignItems:"center", gap:12, margin:"20px 0" } as React.CSSProperties,
  line:  { flex:1, height:1, background:"#e4e8f0" } as React.CSSProperties,
};

const getStrengthScore = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++; // Adicionado minúscula
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};
const strengthLabel = ["","Muito fraca","Fraca","Razoável","Boa","Forte"];
const strengthColor = ["#e4e8f0","#d42e2e","#e07020","#c47f00","#88b04b","#0a9e6e"];

export default function RegisterPage() {
  const router  = useRouter();
  const supabase = createClient();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [sent,     setSent]     = useState(false);
  const [focused,  setFocused]  = useState("");

  const score = getStrengthScore(password);

  const validate = () => {
    if (!name.trim() || name.trim().length < 2) return "Nome deve ter pelo menos 2 caracteres.";
    if (!email || !/\S+@\S+\.\S+/.test(email))  return "E-mail inválido.";
    if (!password || password.length < 8)         return "Senha deve ter pelo menos 8 caracteres.";
    
    // Validação rigorosa para bater com a política do Supabase
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais.";
    }

    if (password !== confirm)                     return "As senhas não coincidem.";
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError(null); setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          setError("Este e-mail já está cadastrado. Tente fazer login ou recuperar a senha.");
        } else {
          setError("Erro ao criar conta: " + error.message);
        }
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err: any) {
      setError("Ocorreu um erro inesperado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field: string) => ({
    ...S.input,
    ...(focused === field ? S.inputFocus : {}),
  });

  if (sent) {
    return (
      <main style={S.wrap}>
        <div style={S.card}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"#0a9e6e12", border:"2px solid #0a9e6e30", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px", fontSize:32 }}>
              ✉
            </div>
            <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 10px", letterSpacing:"-0.02em" }}>
              Confirme seu e-mail
            </h1>
            <p style={{ fontSize:14, color:"#6b7f99", lineHeight:1.6, margin:"0 0 6px" }}>
              Enviamos um link de confirmação para
            </p>
            <p style={{ fontSize:14, fontWeight:700, color:"#0d1b2e", margin:"0 0 24px", fontFamily:"monospace" }}>
              {email}
            </p>
            <div style={S.ok}>
              Clique no link do e-mail para ativar sua conta e acessar o sistema. Verifique também a pasta de spam.
            </div>
            <Link href="/auth/login"
              style={{ display:"block", padding:"12px", background:"transparent", color:"#1d6aff", border:"1.5px solid #e4e8f0", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", textAlign:"center" }}>
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
        <div style={S.logo}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginBottom:16 }}>
            <div style={{ width:36, height:36, background:"linear-gradient(135deg,#1d6aff,#5b21b6)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:900, color:"#fff" }}>C</div>
            <span style={{ fontSize:20, fontWeight:900, color:"#0d1b2e", letterSpacing:"-0.03em" }}>ClubeCRM</span>
          </div>
          <h1 style={S.title}>Criar sua conta</h1>
          <p style={S.sub}>Comece gratuitamente, sem cartão de crédito</p>
        </div>

        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleRegister}>
          {/* Nome */}
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>Nome completo *</label>
            <input
              type="text" value={name} placeholder="João Silva" required autoFocus
              onChange={e => { setName(e.target.value); setError(null); }}
              onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
              style={inputStyle("name")}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom:16 }}>
            <label style={S.label}>E-mail *</label>
            <input
              type="email" value={email} placeholder="seu@email.com" required
              onChange={e => { setEmail(e.target.value); setError(null); }}
              onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
              style={inputStyle("email")}
            />
          </div>

          {/* Senha */}
          <div style={{ marginBottom:8 }}>
            <label style={S.label}>Senha *</label>
            <input
              type="password" value={password} placeholder="Mínimo 8 caracteres" required
              onChange={e => { setPassword(e.target.value); setError(null); }}
              onFocus={() => setFocused("password")} onBlur={() => setFocused("")}
              style={inputStyle("password")}
            />
          </div>

          {/* Força da senha */}
          {password.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:4, marginBottom:5 }}>
                {[1,2,3,4,5].map(i => (
                  <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i <= score ? strengthColor[score] : "#e4e8f0", transition:"background 0.3s" }} />
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  {[
                    { ok: password.length >= 8, label: "8+ carac." },
                    { ok: /[A-Z]/.test(password), label: "Maiúsc." },
                    { ok: /[a-z]/.test(password), label: "Minúsc." },
                    { ok: /[0-9]/.test(password), label: "Número" },
                    { ok: /[^A-Za-z0-9]/.test(password), label: "Símbolo" },
                  ].map(r => (
                    <span key={r.label} style={{ fontSize:10, color: r.ok ? "#0a9e6e" : "#6b7f99", fontWeight: r.ok ? 700 : 400 }}>
                      {r.ok ? "✓ " : "○ "}{r.label}
                    </span>
                  ))}
                </div>
                {score > 0 && (
                  <span style={{ fontSize:11, fontWeight:700, color: strengthColor[score] }}>
                    {strengthLabel[score]}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Confirmar senha */}
          <div style={{ marginBottom:20 }}>
            <label style={S.label}>Confirmar senha *</label>
            <input
              type="password" value={confirm} placeholder="Repita a senha" required
              onChange={e => { setConfirm(e.target.value); setError(null); }}
              onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")}
              style={{
                ...inputStyle("confirm"),
                borderColor: confirm && confirm !== password ? "#d42e2e" : focused === "confirm" ? "#1d6aff" : "#e4e8f0",
              }}
            />
            {confirm && confirm !== password && (
              <div style={{ fontSize:12, color:"#d42e2e", marginTop:5 }}>As senhas não coincidem</div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <div style={S.divider}>
          <div style={S.line} />
          <span style={{ fontSize:12, color:"#6b7f99", fontWeight:600 }}>ou</span>
          <div style={S.line} />
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
