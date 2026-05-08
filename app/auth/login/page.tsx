export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <main style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#eef2ff 0%,#f5f6fa 50%,#e8f4ff 100%)", fontFamily:"sans-serif", padding:"24px 16px" }}>
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
