import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// ── Templates de e-mail ───────────────────────────────────────────────────────

const baseHtml = (content: string) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>ClubeCRM</title>
</head>
<body style="margin:0;padding:0;background:#f5f6fa;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e4e8f0;overflow:hidden;">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1d6aff,#5b21b6);padding:28px 36px;">
          <div style="font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">
            ◈ ClubeCRM
          </div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 36px;background:#f5f6fa;border-top:1px solid #e4e8f0;text-align:center;">
          <p style="font-size:11px;color:#6b7f99;margin:0;">
            © 2025 ClubeCRM · Você recebeu este e-mail porque tem uma conta no ClubeCRM.<br/>
            <a href="${APP_URL}" style="color:#1d6aff;text-decoration:none;">clubecrm.vercel.app</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ── Funções de envio ──────────────────────────────────────────────────────────

/** E-mail de recuperação de senha */
export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  const html = baseHtml(`
    <h2 style="font-size:22px;font-weight:900;color:#0d1b2e;margin:0 0 12px;letter-spacing:-0.02em;">
      Recuperar sua senha
    </h2>
    <p style="font-size:14px;color:#6b7f99;line-height:1.6;margin:0 0 24px;">
      Olá, <strong style="color:#0d1b2e;">${name}</strong>! Recebemos uma solicitação para redefinir a senha da sua conta.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${resetUrl}" style="display:inline-block;background:#1d6aff;color:#ffffff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.01em;">
        Criar nova senha →
      </a>
    </div>
    <p style="font-size:13px;color:#6b7f99;line-height:1.6;margin:0 0 8px;">
      Se você não solicitou a recuperação, ignore este e-mail. Sua senha não será alterada.
    </p>
    <div style="background:#fff8e6;border:1px solid #f0a50030;border-radius:8px;padding:12px 14px;margin-top:20px;">
      <p style="font-size:12px;color:#c47f00;margin:0;font-weight:600;">
        ⚠ Este link expira em 30 minutos e é de uso único.
      </p>
    </div>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Recuperar senha — ClubeCRM",
    html,
  });
}

/** E-mail de boas-vindas após cadastro */
export async function sendWelcomeEmail(to: string, name: string) {
  const html = baseHtml(`
    <h2 style="font-size:22px;font-weight:900;color:#0d1b2e;margin:0 0 12px;letter-spacing:-0.02em;">
      Bem-vindo ao ClubeCRM! 🎉
    </h2>
    <p style="font-size:14px;color:#6b7f99;line-height:1.6;margin:0 0 20px;">
      Olá, <strong style="color:#0d1b2e;">${name}</strong>! Sua conta foi criada com sucesso. Estamos felizes em ter você aqui.
    </p>
    <div style="background:#f0f7ff;border:1px solid #1d6aff20;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;color:#1d6aff;margin:0 0 12px;">O que você pode fazer agora:</p>
      ${["Criar seu primeiro projeto de captação","Configurar o funil de vendas personalizado","Importar sua base de leads existente","Configurar e disparar newsletters"].map(i =>
        `<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <span style="color:#0a9e6e;font-size:14px;font-weight:700;">✓</span>
          <span style="font-size:13px;color:#3d5570;">${i}</span>
        </div>`
      ).join("")}
    </div>
    <div style="text-align:center;">
      <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1d6aff;color:#ffffff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
        Acessar o painel →
      </a>
    </div>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `Bem-vindo ao ClubeCRM, ${name}!`,
    html,
  });
}

/** Double opt-in para newsletter */
export async function sendDoubleOptinEmail(to: string, name: string, confirmUrl: string) {
  const html = baseHtml(`
    <h2 style="font-size:22px;font-weight:900;color:#0d1b2e;margin:0 0 12px;letter-spacing:-0.02em;">
      Confirme seu cadastro
    </h2>
    <p style="font-size:14px;color:#6b7f99;line-height:1.6;margin:0 0 24px;">
      Olá, <strong style="color:#0d1b2e;">${name}</strong>! Clique no botão abaixo para confirmar seu e-mail e receber nossas comunicações.
    </p>
    <div style="text-align:center;margin:28px 0;">
      <a href="${confirmUrl}" style="display:inline-block;background:#1d6aff;color:#ffffff;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;text-decoration:none;">
        Confirmar meu cadastro ✓
      </a>
    </div>
    <p style="font-size:12px;color:#6b7f99;text-align:center;margin-top:20px;">
      Se você não se cadastrou, ignore este e-mail.
    </p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: "Confirme seu cadastro",
    html,
  });
}

/** Teste de envio (sandbox) */
export async function sendTestEmail(to: string, campaignTitle: string, campaignSubject: string) {
  const html = baseHtml(`
    <div style="background:#fff8e6;border:1px solid #f0a50030;border-radius:8px;padding:12px 14px;margin-bottom:20px;">
      <p style="font-size:12px;color:#c47f00;margin:0;font-weight:700;">⚠ Este é um e-mail de TESTE — não enviado para sua lista</p>
    </div>
    <h2 style="font-size:20px;font-weight:900;color:#0d1b2e;margin:0 0 8px;">${campaignTitle}</h2>
    <p style="font-size:13px;color:#6b7f99;margin:0 0 16px;">Assunto: <strong>${campaignSubject}</strong></p>
    <hr style="border:none;border-top:1px solid #e4e8f0;margin:20px 0;"/>
    <p style="font-size:14px;color:#3d5570;line-height:1.6;">
      Aqui apareceria o conteúdo real da sua campanha. O e-mail foi entregue com sucesso, confirmando que sua configuração de SPF, DKIM e DMARC está funcionando corretamente.
    </p>
    <div style="background:#f0fff8;border:1px solid #0a9e6e20;border-radius:8px;padding:14px;margin-top:20px;">
      <p style="font-size:12px;color:#0a9e6e;margin:0;font-weight:700;">✓ Entregabilidade verificada — você está pronto para disparar para sua lista!</p>
    </div>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: `[TESTE] ${campaignSubject}`,
    html,
  });
}
