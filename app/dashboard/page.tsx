import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const allCookies = (await cookieStore).getAll();
  
  return (
    <main style={{ padding:40, fontFamily:"sans-serif" }}>
      <h1 style={{ fontSize:20, marginBottom:20 }}>Dashboard — Debug de Cookies</h1>
      <div style={{ background:"#f5f6fa", borderRadius:10, padding:20 }}>
        <p style={{ fontSize:13, marginBottom:12, fontWeight:700 }}>
          Total de cookies recebidos pelo servidor: {allCookies.length}
        </p>
        {allCookies.map(c => (
          <div key={c.name} style={{ fontSize:11, fontFamily:"monospace", marginBottom:6, wordBreak:"break-all", background:"#fff", padding:"6px 10px", borderRadius:6 }}>
            <strong>{c.name}</strong>: {c.value.substring(0, 80)}...
          </div>
        ))}
        {allCookies.length === 0 && (
          <p style={{ color:"red", fontSize:13 }}>Nenhum cookie chegou ao servidor!</p>
        )}
      </div>
    </main>
  );
}
