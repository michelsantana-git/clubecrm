import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CRMWrapper from "./crm-wrapper";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("sb-btkhntalnjfwdqkioeoi-auth-token");

  if (!sessionCookie?.value) {
    redirect("/auth/login");
  }

  // Extrair dados do usuário do cookie
  let userEmail = "";
  let userName = "";
  let userId = "";

  try {
    const decoded = JSON.parse(decodeURIComponent(sessionCookie.value));
    userEmail = decoded?.user?.email ?? "";
    userName  = decoded?.user?.user_metadata?.name ?? "";
    userId    = decoded?.user?.id ?? "";
  } catch {}

  return (
    <CRMWrapper
      userEmail={userEmail}
      userName={userName}
      userId={userId}
    />
  );
}
