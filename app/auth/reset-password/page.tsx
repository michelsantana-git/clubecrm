"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Supabase coloca o token na URL como hash — ele é processado automaticamente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { setError("Digite a nova senha."); return; }
    if (password.length < 8) { setError("Mínimo 8 caracteres."); return; }
    if (password !== confirm) { setError("As senhas não coincidem."); return; }
    setError(null); setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError("Não foi possível redefinir a senha. O link pode ter expirado.");
      setLoading(false);
      return;
    }
    setDone(true);
    setTimeout(() => { router.push("/auth/login"); }, 2500);
  };

  if (done) {
    return (
      <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f6fa", fontFamily:"'DM Sans',sans-serif" }}>
        <div style={{ textAlign:"center", padding:40 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <h2 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:8 }}>Senha alterada!</h2>
          <p style={{ fontSize:14, color:"#6b7f99" }}>Redirecionando para o login…</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#f5f6fa", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ width:"100%", maxWidth:400, background:"#fff", borderRadius:20, padding:"36px 40px", boxShadow:"0 8px 40px rgba(0,0,0,0.1)", border:"1px solid #e4e8f0" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h2 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:8 }}>Criar nova senha</h2>
          <p style={{ fontSize:14, color:"#6b7f99" }}>Escolha uma senha forte para sua conta.</p>
        </div>
        {error && <div style={{ padding:"12px 14px", background:"#d42e2e10", border:"1px solid #d42e2e30", borderRadius:10, color:"#d42e2e", fontSize:13, marginBottom:18 }}>{error}</div>}
        <form onSubmit={handleReset}>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 }}>Nova senha</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(null); }} placeholder="Mínimo 8 caracteres" required
              style={{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ marginBottom:22 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#3d5570", display:"block", marginBottom:6 }}>Confirmar nova senha</label>
            <input type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(null); }} placeholder="Repita a nova senha" required
              style={{ width:"100%", background:"#f5f6fa", border:"1.5px solid #e4e8f0", borderRadius:10, color:"#0d1b2e", padding:"12px 14px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:"100%", padding:"13px", background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
            {loading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}
