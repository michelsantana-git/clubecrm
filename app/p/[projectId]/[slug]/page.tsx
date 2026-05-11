import { createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: { projectId: string; slug: string };
}

// Renderiza um bloco da landing page
function renderBlock(block: any, index: number) {
  const d = block.data;
  
  if (block.type === "hero") {
    const bg = d.bgStyle === "gradient"
      ? `linear-gradient(155deg, ${d.bg} 0%, #0d1f3c 100%)`
      : d.bg;
    return (
      <div key={index} style={{ background: bg, padding: "72px 56px", textAlign: d.align || "center", fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
        {d.badgeOn && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${d.accent}1e`, border: `1px solid ${d.accent}38`, borderRadius: 99, padding: "4px 13px", fontSize: 11, fontWeight: 700, color: d.accent, marginBottom: 18, letterSpacing: "0.06em" }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: d.accent, display: "inline-block" }} />
            {d.badge}
          </div>
        )}
        <h1 style={{ fontSize: 40, fontWeight: 900, color: d.headC, lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 auto 16px", maxWidth: 640 }}>{d.headline}</h1>
        <p style={{ fontSize: 15, color: d.subC, maxWidth: 520, margin: "0 auto 28px", lineHeight: 1.6 }}>{d.sub}</p>
        <a href={d.ctaUrl || "#form"} style={{ display: "inline-block", background: d.accent, color: "#fff", padding: "13px 32px", borderRadius: 9, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: `0 6px 28px ${d.accent}38` }}>{d.cta}</a>
      </div>
    );
  }

  if (block.type === "about") {
    return (
      <div key={index} style={{ background: d.bg, padding: "64px 56px", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {d.tagOn && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 700, color: d.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
              <div style={{ width: 18, height: 2, background: d.accent }} />{d.tag}
            </div>
          )}
          <h2 style={{ fontSize: 30, fontWeight: 800, color: d.textC, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>{d.title}</h2>
          <p style={{ fontSize: 15, color: d.subC, lineHeight: 1.7, marginBottom: 24, whiteSpace: "pre-wrap" }}>{d.body}</p>
          {d.highlight && <div style={{ borderLeft: `3px solid ${d.accent}`, paddingLeft: 14, fontSize: 15, fontWeight: 700, color: d.textC }}>{d.highlight}</div>}
        </div>
      </div>
    );
  }

  if (block.type === "form") {
    const isDark = d.bg && (d.bg.startsWith("#0") || d.bg.startsWith("#1") || d.bg === "#000");
    const cardBg = d.cardBg || (isDark ? "#ffffff14" : "#f5f6fa");
    const cardBorder = isDark ? "#ffffff18" : "#e4e8f0";
    const titleC = d.titleC || (isDark ? "#ffffff" : "#0d1b2e");
    const subC = d.subC || (isDark ? "#aaaacc" : "#5a7593");
    const fieldBg = isDark ? "#ffffff0e" : "#ffffff";
    const fieldBorder = isDark ? "#ffffff1a" : "#dde4ed";
    return (
      <div key={index} id="form" style={{ background: d.bg, padding: "64px 56px", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 18, padding: "36px 32px" }}>
          <h2 style={{ fontSize: 23, fontWeight: 800, color: titleC, marginBottom: 7 }}>{d.title}</h2>
          <p style={{ fontSize: 12, color: subC, marginBottom: 20, lineHeight: 1.5 }}>{d.sub}</p>
          <form action="/api/public/form" method="POST" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input type="hidden" name="project_id" value={d.projectId || ""} />
            <input type="hidden" name="form_id" value={d.formId || ""} />
            {(d.fields || []).map((field: string, i: number) => (
              <input key={i} name={field.toLowerCase().replace(/\s/g, "_")} placeholder={field}
                style={{ background: fieldBg, border: `1px solid ${fieldBorder}`, borderRadius: 7, padding: "11px 14px", fontSize: 13, color: "#0d1b2e", outline: "none", fontFamily: "inherit" }} />
            ))}
            <button type="submit" style={{ background: d.accent, color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>{d.cta}</button>
          </form>
          {d.socialOn && <p style={{ fontSize: 10, color: subC, textAlign: "center", marginTop: 14 }}>{d.social}</p>}
        </div>
      </div>
    );
  }

  return null;
}

export default async function LandingPage({ params }: Props) {
  const { projectId, slug } = params;

  // Buscar a página publicada no Supabase
  try {
    const supabase = createAdminClient();
    const { data: page, error } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("project_id", projectId)
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !page) return notFound();

    const blocks = page.blocks as any[];

    return (
      <html lang="pt-BR">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{page.title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } body { font-family: 'DM Sans', sans-serif; } input, button { font-family: inherit; }`}</style>
        </head>
        <body>
          {blocks.map((block: any, i: number) => renderBlock(block, i))}
        </body>
      </html>
    );
  } catch {
    return notFound();
  }
}
