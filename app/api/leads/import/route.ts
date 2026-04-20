import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const rowSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  score: z.coerce.number().min(0).max(100).default(40),
  stage: z.string().optional().default("novo"),
  source: z.string().optional().default("Importação CSV"),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { project_id, rows } = body ?? {};

  if (!project_id || !Array.isArray(rows) || rows.length === 0)
    return NextResponse.json({ error: "project_id e rows obrigatórios" }, { status: 400 });

  // Validar e transformar cada linha
  const leads: any[] = [];
  const errors: string[] = [];

  rows.forEach((row: any, i: number) => {
    const parsed = rowSchema.safeParse(row);
    if (!parsed.success) {
      errors.push(`Linha ${i + 2}: ${Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")}`);
      return;
    }
    const d = parsed.data;
    leads.push({
      project_id,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      tags: d.tags ? d.tags.split(";").map((t: string) => t.trim()).filter(Boolean) : [],
      score: d.score,
      stage: d.stage,
      source: d.source,
      newsletter_subscribed: false,
    });
  });

  if (leads.length === 0)
    return NextResponse.json({ error: "Nenhum lead válido encontrado.", details: errors }, { status: 400 });

  const { data, error } = await supabase.from("leads").insert(leads).select("id");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    imported: data?.length ?? 0,
    skipped: errors.length,
    errors: errors.slice(0, 10), // max 10 erros retornados
  }, { status: 201 });
}
