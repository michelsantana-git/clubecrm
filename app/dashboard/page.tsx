import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("sb-btkhntalnjfwdqkioeoi-auth-token");

  if (!sessionCookie?.value) {
    redirect("/auth/login");
  }

  // Extrair email do cookie
  let userEmail = "usuário";
  try {
    const decoded = JSON.parse(decodeURIComponent(sessionCookie.value));
    userEmail = decoded?.user?.email ?? decoded?.user?.user_metadata?.name ?? "usuário";
  } catch {}

  return (
    <main style={{ minHeight:"100vh", background:"#f0f4f8", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", padding:40 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>🚀</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0d1b2e", marginBottom:10, letterSpacing:"-0.03em" }}>
          Ola, {userEmail}!
        </h1>
        <p style={{ fontSize:15, color:"#6b7f99", marginBottom:28 }}>
          Login funcionando com sucesso!
        </p>
        <form action="/api/auth/signout" method="POST">
          <button type="submit" style={{ padding:"10px 24px", background:"#1d6aff", color:"#fff", borderRadius:8, fontSize:13, fontWeight:700, border:"none", cursor:"pointer" }}>
            Sair
          </button>
        </form>
      </div>
    </main>
  );
}
