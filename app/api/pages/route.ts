import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — listar páginas de um projeto
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");
  const supabase = createClient();

  const query = supabase.from("landing_pages").select("*").order("created_at", { ascending: false });
  if (project_id) query.eq("project_id", project_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ pages: data });
}

// POST — criar ou atualizar página
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, project_id, title, blocks, published } = body;
  const supabase = createClient();

  // Gerar slug a partir do título
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);

  if (id) {
    // Atualizar página existente
    const { data, error } = await supabase
      .from("landing_pages")
      .update({ title, slug, blocks, published, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ page: data });
  }

  // Criar nova página
  const { data, error } = await supabase
    .from("landing_pages")
    .insert({ project_id, title, slug, blocks: blocks || [], published: published || false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ page: data });
}

// DELETE — excluir página
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const supabase = createClient();
  const { error } = await supabase.from("landing_pages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
