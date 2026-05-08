import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendTestEmail } from "@/lib/resend";
import { z } from "zod";

const schema = z.object({
  to: z.string().email("E-mail inválido"),
  campaignTitle: z.string().min(1),
  campaignSubject: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { to, campaignTitle, campaignSubject } = parsed.data;

  const { data, error } = await sendTestEmail(to, campaignTitle, campaignSubject);
  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Falha ao enviar e-mail. Verifique sua chave Resend." }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data?.id });
}
