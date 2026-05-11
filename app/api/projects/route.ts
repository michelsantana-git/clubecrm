import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

function getSession() {
  const cookieStore = cookies();
  const cookie = cookieStore.get("sb-btkhntalnjfwdqkioeoi-auth-token");
  if (!cookie?.value) return null;
  try {
    const decoded = JSON.parse(decodeURIComponent(cookie.value));
    return decoded;
  } catch { return null; }
}

export async function GET() {
  const session = getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, forms(*), leads(id,stage,score,newsletter_subscribed)")
    .eq("owner_id", session.user.id)
    .order("created_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const body = await request.json();
  const supabase = createClient();
  if (body.id) {
    // Atualizar projeto existente
    const { data, error } = await supabase
      .from("projects")
      .update({
        name: body.name,
        description: body.description,
        color: body.color,
        icon: body.icon,
        funnel_stages: body.funnel_stages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.id)
      .eq("owner_id", session.user.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ project: data });
  }
  // Criar novo projeto
  const { data, error } = await supabase
    .from("projects")
    .insert({
      owner_id: session.user.id,
      name: body.name,
      description: body.description || "",
      color: body.color || "#1d6aff",
      icon: body.icon || "◈",
      funnel_stages: body.funnel_stages || ["novo","contato","qualificado","proposta","fechado"],
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ project: data });
}

export async function DELETE(request: NextRequest) {
  const session = getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const supabase = createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id).eq("owner_id", session.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
