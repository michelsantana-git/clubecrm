import { NextRequest, NextResponse } from "next/server";

function getResend() {
  const { Resend } = require("resend");
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { subject, content, recipients, projectName, isTest, testEmail } = body;

  if (!subject || !content) {
    return NextResponse.json({ error: "subject e content obrigatorios" }, { status: 400 });
  }

  const resend = getResend();
  const from = `${process.env.RESEND_FROM_NAME || "ClubeCRM"} <${process.env.RESEND_FROM_EMAIL}>`;

  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><title>${subject}</title></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;"><tr><td align="center">
<table width="100%" style="max-width:600px;background:#fff;border-radius:16px;border:1px solid #e4e8f0;">
<tr><td style="background:linear-gradient(135deg,#1d6aff,#5b21b6);padding:24px 36px;border-radius:16px 16px 0 0;">
<div style="font-size:18px;font-weight:900;color:#fff;">◈ ${projectName || "ClubeCRM"}</div></td></tr>
<tr><td style="padding:36px;font-size:15px;color:#2d3748;line-height:1.7;">${content.replace(/\n/g, "<br/>")}</td></tr>
<tr><td style="padding:20px 36px;background:#f5f6fa;border-top:1px solid #e4e8f0;text-align:center;border-radius:0 0 16px 16px;">
<p style="font-size:11px;color:#6b7f99;margin:0;">Voce recebeu este e-mail por fazer parte da lista de ${projectName || "ClubeCRM"}.</p>
</td></tr></table></td></tr></table></body></html>`;

  try {
    if (isTest) {
      const { data, error } = await resend.emails.send({ from, to: testEmail, subject: `[TESTE] ${subject}`, html });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, sent: 1, id: data?.id });
    }

    const emails = recipients || [];
    if (emails.length === 0) return NextResponse.json({ error: "Nenhum destinatario" }, { status: 400 });

    let sent = 0;
    const errors: string[] = [];
    for (let i = 0; i < emails.length; i += 50) {
      const batch = emails.slice(i, i + 50);
      try {
        const { error } = await resend.emails.send({ from, to: batch, subject, html });
        if (error) errors.push(error.message);
        else sent += batch.length;
      } catch (e: any) { errors.push(e.message); }
      if (i + 50 < emails.length) await new Promise(r => setTimeout(r, 300));
    }
    return NextResponse.json({ ok: true, sent, total: emails.length, errors: errors.length ? errors : undefined });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
