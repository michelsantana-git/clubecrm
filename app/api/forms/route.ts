import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");
  const supabase = createClient();
  const query = supabase.from("forms").select("*").order("created_at", { ascending: true });
  if (project_id) query.eq("project_id", project_id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ forms: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createClient();
  if (body.id) {
    const { data, error } = await supabase
      .from("forms")
      .update({ name: body.name, fields: body.fields, tag: body.tag })
      .eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ form: data });
  }
  const { data, error } = await supabase.from("forms").insert({
    project_id: body.project_id, name: body.name,
    fields: body.fields || [], tag: body.tag || "",
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ form: data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const supabase = createClient();
  const { error } = await supabase.from("forms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
