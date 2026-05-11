import { Resend } from "resend";

// Lazy initialization — só cria o cliente quando chamado, não no import
const getResend = () => new Resend(process.env.RESEND_API_KEY);

const FROM = () => `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL;

const baseHtml = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><title>ClubeCRM</title></head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e4e8f0;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#1d6aff,#5b21b6);padding:28px 36px;">
          <div style="font-size:20px;font-weight:900;color:#ffffff;">◈ ClubeCRM</div>
        </td></tr>
        <tr><td style="padding:36px;">${content}</td></tr>
        <tr><td style="padding:20px 36px;background:#f5f6fa;border-top:1px solid #e4e8f0;text-align:center;">
          <p style="font-size:11px;color:#6b7f99;margin:0;">© 2025 ClubeCRM</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${APP_URL()}/auth/reset-password?token=${token}`;
  return getResend().emails.send({
    from: FROM(), to,
    subject: "Recuperar senha — ClubeCRM",
    html: baseHtml(`<h2>Recuperar sua senha</h2><p>Olá, ${name}!</p><div style="text-align:center;margin:28px 0;"><a href="${resetUrl}" style="background:#1d6aff;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">Criar nova senha →</a></div><p style="font-size:12px;color:#6b7f99;">Link expira em 30 minutos.</p>`),
  });
}

export async function sendWelcomeEmail(to: string, name: string) {
  return getResend().emails.send({
    from: FROM(), to,
    subject: `Bem-vindo ao ClubeCRM, ${name}!`,
    html: baseHtml(`<h2>Bem-vindo ao ClubeCRM! 🎉</h2><p>Olá, ${name}! Sua conta foi criada com sucesso.</p><div style="text-align:center;margin:24px 0;"><a href="${APP_URL()}/dashboard" style="background:#1d6aff;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">Acessar o painel →</a></div>`),
  });
}

export async function sendDoubleOptinEmail(to: string, name: string, confirmUrl: string) {
  return getResend().emails.send({
    from: FROM(), to,
    subject: "Confirme seu cadastro",
    html: baseHtml(`<h2>Confirme seu cadastro</h2><p>Olá, ${name}!</p><div style="text-align:center;margin:28px 0;"><a href="${confirmUrl}" style="background:#1d6aff;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;">Confirmar meu cadastro ✓</a></div>`),
  });
}

export async function sendTestEmail(to: string, campaignTitle: string, campaignSubject: string) {
  return getResend().emails.send({
    from: FROM(), to,
    subject: `[TESTE] ${campaignSubject}`,
    html: baseHtml(`<div style="background:#fff8e6;border:1px solid #f0a50030;border-radius:8px;padding:12px 14px;margin-bottom:20px;"><p style="color:#c47f00;margin:0;font-weight:700;">⚠ E-mail de TESTE</p></div><h2>${campaignTitle}</h2><p>E-mail entregue com sucesso. Sua configuração está funcionando corretamente.</p>`),
  });
}
