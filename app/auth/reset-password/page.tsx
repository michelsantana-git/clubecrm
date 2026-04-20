"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const S = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"'DM Sans','Segoe UI',sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card: { width:"100%", maxWidth:420, background:"#ffffff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label:{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input:{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" } as React.CSSProperties,
  btn:  { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err:  { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 } as React.CSSProperties,
};

const getScore = (p: string) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};
const colors = ["#e4e8f0","#d42e2e","#e07020","#c47f00","#0a9e6e"];
const labels = ["","Muito fraca","Fraca","Razoável","Forte"];

export default function ResetPasswordPage() {
  const router  = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [checking,   setChecking]   = useState(true);
  const [focused,    setFocused]    = useState("");

  useEffect(() => {
    // Verificar se há sessão válida (vinda do link de recuperação)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setChecking(false);
    });
  }, []);

  const score = getScore(password);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password)          { setError("Digite a nova senha."); return; }
    if (password.length < 8){ setError("A senha precisa ter pelo menos 8 caracteres."); return; }
    if (score < 2)           { setError("Senha muito fraca. Use maiúsculas, números ou símbolos."); return; }
    if (password !== confirm){ setError("As senhas não coincidem."); return; }
    setError(null); setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Não foi possível redefinir a senha. O link pode ter expirado. Solicite um novo.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setDone(true);
    setTimeout(() => {
      router.push("/auth/login?message=senha_alterada");
    }, 2500);
  };

  const inp = (field: string) => ({
    ...S.input,
    borderColor: focused === field ? "#1d6aff" : "#e4e8f0",
    boxShadow:   focused === field ? "0 0 0 3px #1d6aff14" : "none",
  });

  if (checking) {
    return (
      <main style={S.wrap}>
        <div style={{ textAlign:"center", color:"#6b7f99", fontSize:14 }}>Verificando link…</div>
      </main>
    );
  }

  if (!hasSession) {
    return (
      <main style={S.wrap}>
        <div style={S.card}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
            <h2 style={{ fontSize:20, fontWeight:900, color:"#0d1b2e", marginBottom:10 }}>Link inválido ou expirado</h2>
            <p style={{ fontSize:14, color:"#6b7f99", marginBottom:22, lineHeight:1.5 }}>
              Este link de recuperação não é mais válido. Os links expiram em 1 hora e só podem ser usados uma vez.
            </p>
            <a href="/auth/forgot-password"
              style={{ display:"block", padding:"13px", background:"#1d6aff", color:"#fff", borderRadius:10, fontSize:14, fontWeight:700, textDecoration:"none", textAlign:"center" }}>
              Solicitar novo link
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main style={S.wrap}>
        <div style={S.card}>
          <div style={{ textAlign:"center" }}>
            <div style={{ width:70, height:70, borderRadius:"50%", background:"#0a9e6e12", border:"2px solid #0a9e6e30", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 22px", fontSize:30 }}>✅</div>
            <h2 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:10 }}>Senha alterada!</h2>
            <p style={{ fontSize:14, color:"#6b7f99" }}>Redirecionando para o login…</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Criar nova senha</h1>
          <p style={{ fontSize:14, color:"#6b7f99", margin:0 }}>Escolha uma senha forte para sua conta.</p>
        </div>

        {error && <div style={S.err}>{error}</div>}

        <form onSubmit={handleReset}>
          <div style={{ marginBottom:8 }}>
            <label style={S.label}>Nova senha</label>
            <input type="password" value={password} placeholder="Mínimo 8 caracteres" required autoFocus
              onChange={e => { setPassword(e.target.value); setError(null); }}
              onFocus={() => setFocused("pw")} onBlur={() => setFocused("")}
              style={inp("pw")} />
          </div>

          {/* Força */}
          {password.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", gap:4, marginBottom:5 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ flex:1, height:3, borderRadius:99, background: i <= score ? colors[score] : "#e4e8f0", transition:"background 0.3s" }} />
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"flex-end" }}>
                <span style={{ fontSize:11, fontWeight:700, color: colors[score] }}>{labels[score]}</span>
              </div>
            </div>
          )}

          <div style={{ marginBottom:22 }}>
            <label style={S.label}>Confirmar nova senha</label>
            <input type="password" value={confirm} placeholder="Repita a nova senha" required
              onChange={e => { setConfirm(e.target.value); setError(null); }}
              onFocus={() => setFocused("cf")} onBlur={() => setFocused("")}
              style={{ ...inp("cf"), borderColor: confirm && confirm !== password ? "#d42e2e" : focused === "cf" ? "#1d6aff" : "#e4e8f0" }} />
            {confirm && confirm !== password && (
              <div style={{ fontSize:12, color:"#d42e2e", marginTop:5 }}>As senhas não coincidem</div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
