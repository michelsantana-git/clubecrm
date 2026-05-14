import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");
  const supabase = createClient();
  const query = supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (project_id) query.eq("project_id", project_id);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ leads: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createClient();
  const fields: any = {
    name: body.name, email: body.email,
    phone: body.phone || null, company: body.company || null,
    tags: body.tags || [], score: body.score || 40,
    stage: body.stage || "novo", source: body.source || "Manual",
    newsletter_subscribed: body.newsletter_subscribed || false,
    notes: body.notes || null,
    city: body.city || null,
    annual_revenue: body.annual_revenue || null,
    employees: body.employees || null,
    segment: body.segment || null,
    updated_at: new Date().toISOString(),
  };
  if (body.id) {
    const { data, error } = await supabase.from("leads").update(fields).eq("id", body.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ lead: data });
  }
  const { data, error } = await supabase.from("leads").insert({ ...fields, project_id: body.project_id }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ lead: data });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
