import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

function getSession() {
  const cookieStore = cookies();
  const cookie = cookieStore.get("sb-btkhntalnjfwdqkioeoi-auth-token");
  if (!cookie?.value) return null;
  try { return JSON.parse(decodeURIComponent(cookie.value)); }
  catch { return null; }
}

export async function GET() {
  const session = getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, forms(*)")
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

  const fields: any = {
    name: body.name,
    description: body.description ?? body.desc ?? "",
    color: body.color ?? "#1d6aff",
    icon: body.icon ?? "◈",
    funnel_stages: body.funnel_stages ?? body.funnel ?? ["novo","contato","qualificado","proposta","fechado"],
    updated_at: new Date().toISOString(),
  };
  if (body.scoring_rules !== undefined) fields.scoring_rules = body.scoring_rules;

  if (body.id) {
    const { data, error } = await supabase
      .from("projects")
      .update(fields)
      .eq("id", body.id)
      .eq("owner_id", session.user.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ project: data });
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...fields, owner_id: session.user.id })
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
