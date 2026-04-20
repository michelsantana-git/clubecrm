import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendDoubleOptinEmail } from "@/lib/resend";
import { z } from "zod";

const submissionSchema = z.object({
  form_id: z.string().uuid(),
  project_id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  double_optin: z.boolean().default(true),
});

// POST — receber submissão pública de formulário (embed externo)
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const supabase = createAdminClient(); // admin para contornar RLS em submissões públicas
  const { form_id, project_id, name, email, phone, company, double_optin } = parsed.data;

  // Buscar form para obter a tag
  const { data: form, error: formErr } = await supabase
    .from("forms")
    .select("id, tag")
    .eq("id", form_id)
    .single();

  if (formErr || !form) return NextResponse.json({ error: "Formulário não encontrado" }, { status: 404 });

  // Verificar se lead já existe no projeto
  const { data: existing } = await supabase
    .from("leads")
    .select("id, tags")
    .eq("project_id", project_id)
    .eq("email", email)
    .single();

  if (existing) {
    // Atualizar tags sem duplicar
    const newTags = Array.from(new Set([...existing.tags, form.tag]));
    await supabase.from("leads").update({ tags: newTags }).eq("id", existing.id);
  } else {
    // Criar novo lead
    await supabase.from("leads").insert({
      project_id,
      name, email,
      phone: phone || null,
      company: company || null,
      tags: [form.tag],
      score: 10,
      stage: "novo",
      source: `Formulário: ${form_id}`,
      newsletter_subscribed: !double_optin, // se não tem double optin, já inscreve
    });
  }

  // Incrementar contador de submissões
  await supabase.rpc("increment_form_submissions", { form_uuid: form_id });

  // Enviar double opt-in se habilitado
  if (double_optin) {
    const confirmUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/public/confirm?email=${encodeURIComponent(email)}&project=${project_id}`;
    await sendDoubleOptinEmail(email, name, confirmUrl).catch(console.error);
  }

  return NextResponse.json({ success: true, double_optin });
}
