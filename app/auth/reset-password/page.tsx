"use client";
import { useState } from "react";

const S = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"sans-serif", padding:"24px 16px" } as React.CSSProperties,
  card: { width:"100%", maxWidth:420, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.10)", border:"1px solid #e4e8f0" } as React.CSSProperties,
  label: { fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 } as React.CSSProperties,
  input: { width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit" } as React.CSSProperties,
  btn: { width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" } as React.CSSProperties,
  err: { padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:16 } as React.CSSProperties,
  ok:  { padding:"12px 14px", background:"#0a9e6e12", border:"1px solid #0a9e6e30", borderRadius:10, color:"#0a9e6e", fontSize:13, marginBottom:16 } as React.CSSProperties,
};

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [done,     setDone]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Senha deve ter pelo menos 6 caracteres."); return; }
    if (password !== confirm)  { setError("As senhas não coincidem."); return; }
    setError(null); setLoading(true);

    // Importar o client do Supabase dinamicamente
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Erro ao redefinir senha. O link pode ter expirado.");
      setLoading(false);
      return;
    }

    setDone(true);
    setTimeout(() => { window.location.href = "/auth/login?message=senha_alterada"; }, 2000);
  };

  if (done) return (
    <main style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <h2 style={{ fontSize:20, fontWeight:900, color:"#0d1b2e", marginBottom:8 }}>Senha alterada!</h2>
          <p style={{ fontSize:14, color:"#6b7f99" }}>Redirecionando para o login...</p>
        </div>
      </div>
    </main>
  );

  return (
    <main style={S.wrap}>
      <div style={S.card}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <h1 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", margin:"0 0 6px" }}>Criar nova senha</h1>
          <p style={{ fontSize:14, color:"#6b7f99" }}>Escolha uma senha de pelo menos 6 caracteres.</p>
        </div>
        {error && <div style={S.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={S.label}>Nova senha</label>
            <input type="password" value={password} placeholder="Mínimo 6 caracteres" required
              onChange={e => { setPassword(e.target.value); setError(null); }} style={S.input} />
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={S.label}>Confirmar nova senha</label>
            <input type="password" value={confirm} placeholder="Repita a senha" required
              onChange={e => { setConfirm(e.target.value); setError(null); }}
              style={{ ...S.input, borderColor: confirm && confirm !== password ? "#d42e2e" : "#e4e8f0" }} />
            {confirm && confirm !== password && (
              <div style={{ fontSize:12, color:"#d42e2e", marginTop:5 }}>As senhas não coincidem</div>
            )}
          </div>
          <button type="submit" disabled={loading}
            style={{ ...S.btn, opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}>
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
