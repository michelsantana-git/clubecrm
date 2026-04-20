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

type LeadInsert = {
  project_id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  tags: string[];
  score: number;
  stage: string;
  source: string;
  newsletter_subscribed: boolean;
};

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { project_id, rows } = body ?? {};

  if (!project_id || !Array.isArray(rows) || rows.length === 0)
    return NextResponse.json({ error: "project_id e rows obrigatórios" }, { status: 400 });

  const leads: LeadInsert[] = [];
  const errors: string[] = [];

  rows.forEach((row: unknown, i: number) => {
    const parsed = rowSchema.safeParse(row);
    if (!parsed.success) {
      errors.push(
        `Linha ${i + 2}: ${Object.values(parsed.error.flatten().fieldErrors).flat().join(", ")}`
      );
      return;
    }
    const d = parsed.data;
    leads.push({
      project_id: project_id as string,
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      tags: d.tags ? d.tags.split(";").map((t) => t.trim()).filter(Boolean) : [],
      score: d.score,
      stage: d.stage,
      source: d.source,
      newsletter_subscribed: false,
    });
  });

  if (leads.length === 0)
    return NextResponse.json(
      { error: "Nenhum lead válido encontrado.", details: errors },
      { status: 400 }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("leads") as any)
    .insert(leads)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(
    {
      imported: (data as { id: string }[])?.length ?? 0,
      skipped: errors.length,
      errors: errors.slice(0, 10),
    },
    { status: 201 }
  );
}
