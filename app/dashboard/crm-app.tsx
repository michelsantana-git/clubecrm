"use client";
// ClubeCRM — CRM App integrado ao Supabase
// Baseado no crm-v4.jsx com integração real de dados

import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// THEME SYSTEM — Light (default) + Dark
// ═══════════════════════════════════════════════════════════════════════════════
const THEMES = {
  light: {
    bg: "#f0f4f8", surface: "#ffffff", card: "#ffffff", border: "#dde4ed",
    borderHover: "#b8c8da", muted: "#eef2f7", mutedHover: "#e2e9f2",
    text: "#0f1c2e", textSub: "#5a7593", textMid: "#3d5a7a",
    accent: "#1d6aff", accentSoft: "#1d6aff18", accentHover: "#1457e0",
    green: "#0a9e6e", greenSoft: "#0a9e6e15",
    amber: "#c47f00", amberSoft: "#c47f0015",
    red: "#d42e2e", redSoft: "#d42e2e15",
    purple: "#6b42e8", purpleSoft: "#6b42e815",
    shadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
    shadowCard: "0 1px 3px rgba(0,0,0,0.07)",
  },
  dark: {
    bg: "#03070e", surface: "#070e19", card: "#0b1520", border: "#0f1e30",
    borderHover: "#1a3050", muted: "#0f1e30", mutedHover: "#162840",
    text: "#ddeaf8", textSub: "#3d5a7a", textMid: "#6a8fae",
    accent: "#1d6aff", accentSoft: "#1d6aff1a", accentHover: "#4d8fff",
    green: "#0fb981", greenSoft: "#0fb98118",
    amber: "#f0a500", amberSoft: "#f0a50018",
    red: "#e84040", redSoft: "#e8404018",
    purple: "#7c5cfc", purpleSoft: "#7c5cfc18",
    shadow: "0 1px 4px rgba(0,0,0,0.4)",
    shadowCard: "0 1px 3px rgba(0,0,0,0.3)",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════════════════════════
const IP = {
  grid:    <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></>,
  crm:     <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  leads:   <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></>,
  mail:    <><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></>,
  score:   <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></>,
  page:    <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>,
  plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  close:   <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  eye:     <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  edit:    <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  trash:   <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
  copy:    <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
  link:    <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
  globe:   <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
  chevD:   <><polyline points="6 9 12 15 18 9"/></>,
  chevU:   <><polyline points="18 15 12 9 6 15"/></>,
  check:   <><polyline points="20 6 9 17 4 12"/></>,
  phone:   <><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></>,
  desktop: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>,
  send:    <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  zap:     <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  shield:  <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  drag:    <><circle cx="9" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="19" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="19" r="1" fill="currentColor" stroke="none"/></>,
  layout:  <><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></>,
  menu:    <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  arrow:   <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  folder:  <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>,
  download:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  upload:  <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
  sun:     <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
  moon:    <><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></>,
  flask:   <><path d="M9 3h6v8l3.5 6a2 2 0 0 1-1.72 3H7.22a2 2 0 0 1-1.72-3L9 11V3z"/><line x1="9" y1="3" x2="15" y2="3"/></>,
  user:    <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
};
const Icon = ({ n, size = 15, color, style: s }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color || "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={s}>
    {IP[n]}
  </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════════
const mkHero = () => ({ id: "h" + Date.now(), type: "hero", data: { badge: "Evento Exclusivo", badgeOn: true, headline: "Transforme Sua Empresa em 90 Dias", sub: "Junte-se ao grupo seleto de empresários que estão escalando seus negócios com mentoria e networking de alto nível.", cta: "Quero Participar", ctaUrl: "#form", bg: "#ffffff", headC: "#0d1b2e", subC: "#5a7593", accent: "#1d6aff", align: "center", bgStyle: "solid", logoUrl: "", bgImageUrl: "", overlayColor: "#000000", overlayOpacity: 0 } });
const mkAbout = () => ({ id: "a" + Date.now(), type: "about", data: { tagOn: true, tag: "Sobre o Programa", title: "O que é o Clube de Empresários?", body: "Um ambiente exclusivo para empresários que faturam acima de R$ 500k/ano trocarem experiências, fecharem parcerias e acelerarem seus resultados com mentoria especializada.", highlight: "Mais de 200 empresários já transformaram seus negócios.", bg: "#f5f6fa", textC: "#0d1b2e", subC: "#5a7593", accent: "#1d6aff", bgImageUrl: "", overlayColor: "#000000", overlayOpacity: 0 } });
const mkForm = (forms = []) => ({ id: "f" + Date.now(), type: "form", data: { title: "Reserve sua vaga", sub: "Vagas limitadas. Preencha e entraremos em contato.", formId: forms[0]?.id || null, formName: forms[0]?.name || null, cta: "Quero Me Inscrever →", bg: "#ffffff", accent: "#1d6aff", socialOn: true, social: "✓ Seguro  ✓ Sem spam  ✓ Cancelamento fácil", fields: forms[0]?.fields || ["Nome completo", "E-mail", "Telefone", "Empresa"] } });

const INITIAL = [
  {
    id: "clube", name: "Clube de Empresários", color: "#1d6aff", icon: "◈",
    desc: "Captação e qualificação de empresários para o clube exclusivo",
    leads: [
      { id: 1, name: "Rafael Mendes", email: "rafael@techcorp.com", phone: "(11) 99201-4422", company: "TechCorp", tags: ["empresário","quente"], score: 87, stage: "qualificado", source: "Landing Page", date: "2025-03-01", nl: true },
      { id: 2, name: "Camila Torres", email: "camila@inova.io", phone: "(21) 98833-1100", company: "Inova.io", tags: ["empresário"], score: 62, stage: "contato", source: "Formulário", date: "2025-03-03", nl: true },
      { id: 3, name: "Diego Alves", email: "diego@alves.me", phone: "(31) 97744-5566", company: "Alves & Cia", tags: ["frio"], score: 34, stage: "novo", source: "Landing Page", date: "2025-03-05", nl: false },
      { id: 4, name: "Fernanda Lopes", email: "fernanda@grupo-fl.com.br", phone: "(41) 96655-7788", company: "Grupo FL", tags: ["empresário","quente"], score: 91, stage: "proposta", source: "Indicação", date: "2025-02-28", nl: true },
      { id: 5, name: "Juliana Rios", email: "ju@empresa.com", phone: "(11) 94477-2233", company: "Empresa S.A.", tags: ["empresário","morno"], score: 73, stage: "negociação", source: "Landing Page", date: "2025-02-20", nl: true },
    ],
    funnel: ["novo","contato","qualificado","proposta","negociação","fechado"],
    forms: [
      { id: 1, name: "Formulário Principal", fields: ["Nome","E-mail","Telefone","Empresa","Faturamento"], tag: "empresário", subs: 47 },
      { id: 2, name: "LP Evento Março", fields: ["Nome","E-mail","Telefone"], tag: "evento-mar", subs: 31 },
    ],
    newsletters: [
      { id: 1, title: "Boas-vindas ao Clube", subject: "Bem-vindo! Aqui começa sua jornada", status: "enviado", sent: 156, opened: 102, clicked: 44, date: "2025-03-01" },
      { id: 2, title: "Encontro de Março", subject: "Você está convidado: Networking Exclusivo", status: "enviado", sent: 148, opened: 95, clicked: 67, date: "2025-03-08" },
      { id: 3, title: "Newsletter Mensal #4", subject: "Oportunidades desta semana", status: "rascunho", sent: 0, opened: 0, clicked: 0, date: "2025-03-20" },
    ],
    pages: [],
  },
  {
    id: "mentoria", name: "Mentoria Estratégica", color: "#7c5cfc", icon: "◆",
    desc: "Pipeline de vendas para programa de mentoria individual e em grupo",
    leads: [
      { id: 10, name: "Bruno Carvalho", email: "bruno@bcarv.com", phone: "(51) 95566-9900", company: "B.Carvalho ME", tags: ["morno"], score: 55, stage: "contato", source: "Formulário", date: "2025-03-06", nl: true },
      { id: 11, name: "Aline Souza", email: "aline@souza.net", phone: "(31) 92299-6677", company: "Souza & Filhos", tags: ["quente"], score: 80, stage: "fechado", source: "Indicação", date: "2025-02-15", nl: true },
      { id: 12, name: "Marcos Pinto", email: "marcos@pinto.com", phone: "(21) 93388-4455", company: "Pinto Consultoria", tags: ["frio"], score: 21, stage: "novo", source: "Formulário", date: "2025-03-07", nl: false },
      { id: 13, name: "Patrícia Nunes", email: "patricia@nunes.com.br", phone: "(11) 91188-3344", company: "Nunes & Assoc.", tags: ["quente","interessado"], score: 78, stage: "proposta", source: "Landing Page", date: "2025-03-02", nl: true },
    ],
    funnel: ["novo","contato","descoberta","proposta","fechado"],
    forms: [
      { id: 3, name: "Aplicação para Mentoria", fields: ["Nome","E-mail","Telefone","Empresa","Desafio principal"], tag: "aplicante", subs: 23 },
    ],
    newsletters: [
      { id: 4, title: "Boas-vindas — Mentoria", subject: "Sua transformação começa agora", status: "enviado", sent: 89, opened: 71, clicked: 38, date: "2025-03-04" },
      { id: 5, title: "Conteúdo Semanal #2", subject: "3 decisões que transformam empresas", status: "agendado", sent: 0, opened: 0, clicked: 0, date: "2025-03-18" },
    ],
    pages: [],
  },
];

const STAGE_COLORS = { novo:"#3d5a7a", contato:"#f0a500", descoberta:"#1d6aff", qualificado:"#1d6aff", proposta:"#7c5cfc", negociação:"#e07020", fechado:"#0fb981" };
const TAG_PAL = {
  quente:     { bg:"#e8404018", c:"#e84040", b:"#e8404030" },
  morno:      { bg:"#f0a50018", c:"#c47f00", b:"#f0a50030" },
  frio:       { bg:"#1d6aff18", c:"#1d6aff", b:"#1d6aff30" },
  empresário: { bg:"#0fb98118", c:"#0a9e6e", b:"#0fb98130" },
  interessado:{ bg:"#7c5cfc18", c:"#6b42e8", b:"#7c5cfc30" },
  aplicante:  { bg:"#0ecbca18", c:"#0a9b9a", b:"#0ecbca30" },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT / IMPORT HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const toCSV = (rows, cols) => {
  const header = cols.join(",");
  const body = rows.map(r => cols.map(c => `"${(r[c] ?? "").toString().replace(/"/g,'""')}"`).join(",")).join("\n");
  return header + "\n" + body;
};
const downloadCSV = (content, filename) => {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════════
const ScoreBar = ({ score, C }) => {
  const col = score >= 75 ? C.green : score >= 50 ? C.amber : C.red;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ flex:1, height:4, background:C.muted, borderRadius:99 }}>
        <div style={{ width:`${score}%`, height:"100%", background:col, borderRadius:99 }} />
      </div>
      <span style={{ fontSize:13, fontWeight:700, color:col, minWidth:24, fontFamily:"monospace" }}>{score}</span>
    </div>
  );
};

const TagBadge = ({ t, C }) => {
  const p = TAG_PAL[t] || { bg:`${C.muted}`, c:C.textMid, b:C.border };
  return <span style={{ padding:"3px 9px", borderRadius:99, fontSize:11, fontWeight:700, background:p.bg, color:p.c, border:`1px solid ${p.b}` }}>{t}</span>;
};

const StatusDot = ({ status, C }) => {
  const map = {
    enviado:   { bg:C.greenSoft, c:C.green },
    agendado:  { bg:C.amberSoft, c:C.amber },
    rascunho:  { bg:C.muted, c:C.textMid },
    ativo:     { bg:C.greenSoft, c:C.green },
    pausado:   { bg:C.muted, c:C.textMid },
    publicada: { bg:C.greenSoft, c:C.green },
  };
  const s = map[status] || map.rascunho;
  return <span style={{ padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:700, background:s.bg, color:s.c }}>{status}</span>;
};

const Btn = ({ children, v="primary", icon, small, onClick, disabled, style:sx, C }) => {
  const styles = {
    primary: { background:C.accent, color:"#fff", border:"none" },
    ghost:   { background:"transparent", color:C.textMid, border:`1px solid ${C.border}` },
    danger:  { background:C.redSoft, color:C.red, border:`1px solid ${C.red}30` },
    success: { background:C.greenSoft, color:C.green, border:`1px solid ${C.green}30` },
  };
  const b = styles[v] || styles.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:6, padding:small?"6px 12px":"9px 17px", borderRadius:8, fontSize:small?11:13, fontWeight:700, cursor:disabled?"not-allowed":"pointer", fontFamily:"inherit", opacity:disabled?0.4:1, transition:"opacity 0.15s", background:b.background, color:b.color, border:b.border, ...sx }}>
      {icon && <Icon n={icon} size={small?11:13} />}{children}
    </button>
  );
};

const Inp = ({ label, C, ...p }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</label>}
    <input {...p} style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", ...p.style }} />
  </div>
);

const Txa = ({ label, C, ...p }) => (
  <div style={{ marginBottom:12 }}>
    {label && <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</label>}
    <textarea {...p} style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical", minHeight:90, ...p.style }} />
  </div>
);

const Modal = ({ title, onClose, wide, children, C }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", backdropFilter:"blur(6px)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
    onClick={e => e.target===e.currentTarget && onClose()}>
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:wide?800:520, maxHeight:"88vh", overflow:"auto", boxShadow:C.shadow }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 16px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:C.surface, zIndex:1 }}>
        <h2 style={{ fontSize:17, fontWeight:800, color:C.text, margin:0 }}>{title}</h2>
        <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMid, cursor:"pointer", padding:4, display:"flex" }}><Icon n="close" size={17} /></button>
      </div>
      <div style={{ padding:"20px 24px" }}>{children}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════════════════
const ThemeToggle = ({ theme, setTheme, C }) => (
  <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
    title={theme === "light" ? "Mudar para tema escuro" : "Mudar para tema claro"}
    style={{ display:"flex", alignItems:"center", gap:6, background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", cursor:"pointer", color:C.textMid, fontSize:12, fontWeight:600, transition:"all 0.2s" }}>
    <Icon n={theme === "light" ? "moon" : "sun"} size={14} />
    {theme === "light" ? "Escuro" : "Claro"}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT SELECTOR
// ═══════════════════════════════════════════════════════════════════════════════
const ProjectSelector = ({ projects, activeId, onChange, onNew, C }) => {
  const [open, setOpen] = useState(false);
  const active = projects.find(p => p.id === activeId);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display:"flex", alignItems:"center", gap:9, background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:"8px 12px", cursor:"pointer", width:"100%", fontFamily:"inherit" }}>
        <span style={{ fontSize:15, color:active?.color }}>{active?.icon}</span>
        <span style={{ fontSize:13, fontWeight:700, color:C.text, flex:1, textAlign:"left", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{active?.name}</span>
        <Icon n="chevD" size={12} style={{ color:C.textSub, transform:open?"rotate(180deg)":"none", transition:"transform 0.2s" }} />
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, background:C.surface, border:`1px solid ${C.border}`, borderRadius:11, overflow:"hidden", boxShadow:C.shadow, zIndex:300 }}>
          {projects.map(p => (
            <button key={p.id} onClick={() => { onChange(p.id); setOpen(false); }}
              style={{ display:"flex", alignItems:"center", gap:9, width:"100%", padding:"10px 13px", background:p.id===activeId?C.accentSoft:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontSize:14, color:p.color }}>{p.icon}</span>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{p.name}</div>
                <div style={{ fontSize:11, color:C.textSub }}>{p.leads.length} leads</div>
              </div>
            </button>
          ))}
          <button onClick={() => { onNew(); setOpen(false); }}
            style={{ display:"flex", alignItems:"center", gap:7, width:"100%", padding:"10px 13px", background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit", color:C.accent, fontSize:12, fontWeight:700 }}>
            <Icon n="plus" size={13} color={C.accent} /> Novo projeto
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
const GlobalDashboard = ({ projects, C }) => {
  const all = projects.flatMap(p => p.leads);
  const total = all.length, hot = all.filter(l => l.tags.includes("quente")).length;
  const closed = all.filter(l => l.stage==="fechado").length;
  const avg = total ? Math.round(all.reduce((a,b) => a+b.score,0)/total) : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:26 }}>
      <div>
        <div style={{ fontSize:12, color:C.textSub, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:6, fontWeight:600 }}>Visão consolidada</div>
        <h1 style={{ fontSize:30, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>Dashboard Global</h1>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[{l:"Total de leads",v:total,c:C.accent},{l:"Leads quentes",v:hot,c:C.red},{l:"Score médio",v:avg,c:C.amber},{l:"Fechados",v:closed,c:C.green}].map(s => (
          <div key={s.l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px", boxShadow:C.shadowCard }}>
            <div style={{ fontSize:11, color:C.textSub, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10, fontWeight:600 }}>{s.l}</div>
            <div style={{ fontSize:32, fontWeight:900, color:s.c, lineHeight:1, marginBottom:4 }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:14 }}>
        {projects.map(p => {
          const hotP = p.leads.filter(l => l.tags.includes("quente")).length;
          const closedP = p.leads.filter(l => l.stage==="fechado").length;
          const avgP = p.leads.length ? Math.round(p.leads.reduce((a,b)=>a+b.score,0)/p.leads.length) : 0;
          const nlSent = p.newsletters.filter(n => n.status==="enviado");
          const sent = nlSent.reduce((a,b)=>a+b.sent,0), opened = nlSent.reduce((a,b)=>a+b.opened,0);
          const or = sent ? Math.round(opened/sent*100) : 0;
          return (
            <div key={p.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:15, padding:22, boxShadow:C.shadowCard }}>
              <div style={{ display:"flex", gap:11, alignItems:"center", marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`${p.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, color:p.color, border:`1px solid ${p.color}30` }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:C.text }}>{p.name}</div>
                  <div style={{ fontSize:11, color:C.textSub }}>{p.desc.slice(0,50)}…</div>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:14 }}>
                {[["Leads",p.leads.length],["Quentes",hotP],["Score",avgP]].map(([l,v]) => (
                  <div key={l} style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 12px" }}>
                    <div style={{ fontSize:10, color:C.textSub, marginBottom:3, fontWeight:600 }}>{l}</div>
                    <div style={{ fontSize:18, fontWeight:900, color:C.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {[[`${p.forms.length} formulários`,`${p.forms.reduce((a,b)=>a+b.subs,0)} submissões`],[`${p.newsletters.length} newsletters`,`${or}% abertura`],[`${p.pages?.length||0} landing pages`,`${p.pages?.filter(pg=>pg.published).length||0} publicadas`],[`Funil`,`${p.funnel.length} etapas · ${closedP} fechados`]].map(([l,r])=>(
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                    <span style={{ color:C.textSub }}>{l}</span>
                    <span style={{ color:C.text, fontWeight:700 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CRM KANBAN
// ═══════════════════════════════════════════════════════════════════════════════
const CRM = ({ proj, setProj, C }) => {
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState("");

  const move = (lid, stage) => {
    setProj(p => ({ ...p, leads: p.leads.map(l => l.id===lid ? {...l, stage} : l) }));
    if (sel?.id===lid) setSel(s => ({...s, stage}));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:proj.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>{proj.icon} {proj.name}</div>
          <h1 style={{ fontSize:27, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>Funil de Vendas</h1>
          <p style={{ color:C.textSub, fontSize:13, marginTop:3 }}>Arraste cards entre etapas · clique para detalhes</p>
        </div>
        <Btn C={C} icon="plus">Novo Lead</Btn>
      </div>

      <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:12, minHeight:480 }}>
        {proj.funnel.map(sid => {
          const sLeads = proj.leads.filter(l => l.stage===sid);
          const col = STAGE_COLORS[sid] || C.textMid;
          const isOver = over===sid;
          return (
            <div key={sid}
              onDragOver={e => { e.preventDefault(); setOver(sid); }}
              onDrop={() => { if (dragging) move(dragging, sid); setDragging(null); setOver(null); }}
              onDragLeave={() => setOver(null)}
              style={{ minWidth:210, flex:"0 0 210px", background:isOver?C.accentSoft:C.muted, border:`1px solid ${isOver?C.accent:C.border}`, borderRadius:12, padding:11, display:"flex", flexDirection:"column", gap:8, transition:"all 0.15s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:9, borderBottom:`2px solid ${col}30` }}>
                <span style={{ fontSize:12, fontWeight:700, color:C.textMid, textTransform:"capitalize" }}>{sid}</span>
                <span style={{ fontSize:11, fontWeight:800, color:col, background:`${col}18`, borderRadius:99, padding:"1px 8px" }}>{sLeads.length}</span>
              </div>
              {sLeads.map(lead => (
                <div key={lead.id} draggable
                  onDragStart={() => setDragging(lead.id)}
                  onDragEnd={() => { setDragging(null); setOver(null); }}
                  onClick={() => setSel(lead)}
                  style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:11, cursor:"grab", opacity:dragging===lead.id?0.4:1, display:"flex", flexDirection:"column", gap:8, boxShadow:C.shadowCard }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{lead.name}</div>
                    <Icon n="drag" size={12} style={{ color:C.border }} />
                  </div>
                  <div style={{ fontSize:12, color:C.textSub }}>{lead.company}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>{lead.tags.map(t => <TagBadge key={t} t={t} C={C} />)}</div>
                  <ScoreBar score={lead.score} C={C} />
                </div>
              ))}
              {!sLeads.length && <div style={{ textAlign:"center", color:C.border, fontSize:12, padding:"16px 0" }}>vazio</div>}
            </div>
          );
        })}
      </div>

      {sel && (
        <Modal title={sel.name} onClose={() => setSel(null)} C={C}>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              {[["Empresa",sel.company],["E-mail",sel.email],["Telefone",sel.phone],["Origem",sel.source],["Cadastro",sel.date]].map(([k,v]) => (
                <div key={k}><div style={{ fontSize:10, color:C.textSub, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{k}</div><div style={{ fontSize:13, color:C.text, fontWeight:600 }}>{v}</div></div>
              ))}
            </div>
            <div><div style={{ fontSize:10, color:C.textSub, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Tags</div><div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>{sel.tags.map(t => <TagBadge key={t} t={t} C={C} />)}</div></div>
            <div><div style={{ fontSize:10, color:C.textSub, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Score</div><ScoreBar score={sel.score} C={C} /></div>
            <div>
              <div style={{ fontSize:10, color:C.textSub, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Mover etapa</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {proj.funnel.map(s => { const c=STAGE_COLORS[s]||C.textMid, act=s===sel.stage; return (
                  <button key={s} onClick={() => move(sel.id, s)}
                    style={{ padding:"6px 12px", borderRadius:7, border:`1px solid ${act?c:C.border}`, background:act?`${c}18`:"transparent", color:act?c:C.textSub, fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"capitalize" }}>{s}</button>
                ); })}
              </div>
            </div>
            <Txa C={C} label="Nota / Follow-up" value={note} onChange={e => setNote(e.target.value)} placeholder="Registre contato, observação ou próxima ação..." />
            <Btn C={C}>Salvar nota</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEADS PAGE — with import/export
// ═══════════════════════════════════════════════════════════════════════════════
const LeadsPage = ({ proj, setProj, C }) => {
  const [q, setQ] = useState(""); const [ft, setFt] = useState("todos");
  const [showNew, setShowNew] = useState(false); const [showForm, setShowForm] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [nl, setNl] = useState({ name:"", email:"", phone:"", company:"", tags:[] });
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef();

  const [showFormEditor, setShowFormEditor] = useState<any>(null);
  const [editLead, setEditLead] = useState<any>(null);

  // Campos customizáveis de leads
  const leadFields = proj.leadFields || ["name","email","phone","company"];
  const fieldLabels: Record<string,string> = { name:"Nome", email:"E-mail", phone:"Telefone", company:"Empresa", website:"Website", cpf:"CPF/CNPJ", instagram:"Instagram", linkedin:"LinkedIn", notes:"Observações" };
  const allPossibleFields = ["name","email","phone","company","website","cpf","instagram","linkedin","notes"];

  const allTags = ["todos", ...Array.from(new Set(proj.leads.flatMap((l:any) => l.tags)))];
  const filtered = proj.leads.filter(l => {
    const m = l.name.toLowerCase().includes(q.toLowerCase()) || l.email.toLowerCase().includes(q.toLowerCase()) || l.company.toLowerCase().includes(q.toLowerCase());
    return m && (ft==="todos" || l.tags.includes(ft));
  });

  const addLead = () => {
    if (!nl.name || !nl.email) return;
    setProj(p => ({ ...p, leads: [{ ...nl, id:Date.now(), score:Math.floor(Math.random()*40)+20, stage:"novo", source:"Manual", date:new Date().toISOString().split("T")[0], nl:false }, ...p.leads] }));
    setNl({ name:"", email:"", phone:"", company:"", tags:[] }); setShowNew(false);
  };

  // Export leads
  const exportLeads = () => {
    const cols = ["name","email","phone","company","tags","score","stage","source","date"];
    const rows = proj.leads.map(l => ({ ...l, tags: l.tags.join(";") }));
    downloadCSV(toCSV(rows, cols), `leads-${proj.id}-${new Date().toISOString().slice(0,10)}.csv`);
  };

  // Export funnel template
  const exportFunnel = () => {
    const cols = ["name","email","phone","company","stage","score","tags","source","date"];
    const header = cols.join(",") + "\n";
    const example = `"Nome Exemplo","email@exemplo.com","(11) 99999-9999","Empresa Exemplo","${proj.funnel[0]}","50","tag1;tag2","Manual","${new Date().toISOString().slice(0,10)}"`;
    downloadCSV(header + example, `template-funil-${proj.id}.csv`);
  };

  // Import CSV
  const handleImport = () => {
    const lines = importText.trim().split("\n");
    if (lines.length < 2) { setImportResult({ ok:false, msg:"Arquivo inválido ou vazio." }); return; }
    const headers = lines[0].split(",").map(h => h.replace(/"/g,"").trim());
    const imported = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(",").map(v => v.replace(/"/g,"").trim());
      const row = {};
      headers.forEach((h,idx) => { row[h] = vals[idx] || ""; });
      if (!row.email) continue;
      imported.push({
        id: Date.now() + i,
        name: row.name || row.nome || "—",
        email: row.email,
        phone: row.phone || row.telefone || "",
        company: row.company || row.empresa || "",
        tags: row.tags ? row.tags.split(";").map(t=>t.trim()).filter(Boolean) : [],
        score: parseInt(row.score) || 40,
        stage: proj.funnel.includes(row.stage) ? row.stage : proj.funnel[0],
        source: "Importação CSV",
        date: new Date().toISOString().slice(0,10),
        nl: false,
      });
    }
    if (!imported.length) { setImportResult({ ok:false, msg:"Nenhum lead válido encontrado." }); return; }
    setProj(p => ({ ...p, leads: [...imported, ...p.leads] }));
    setImportResult({ ok:true, msg:`${imported.length} lead${imported.length>1?"s":""} importado${imported.length>1?"s":""}!` });
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => setImportText(ev.target.result);
    reader.readAsText(f, "UTF-8");
  };

  const embedCode = f => `<!-- ${f.name} — ${proj.name} -->
<div id="crm-form-${f.id}"></div>
<script>
  window.CRMConfig = {
    projectId: "${proj.id}", formId: "${f.id}",
    tag: "${f.tag}", doubleOptin: true, redirect: "/obrigado"
  };
</script>
<script src="https://seu-app.vercel.app/embed.js"></script>`;


  // FormEditor modal
  const FormEditorModal = () => {
    const f = showFormEditor;
    const isNew = !f?.id;
    const [fname, setFname] = useState(f?.name || "");
    const [ftag, setFtag]   = useState(f?.tag || "");
    const [ffields, setFfields] = useState<string[]>(f?.fields || ["Nome","E-mail","Telefone"]);
    const [nfield, setNfield] = useState("");
    return (
      <Modal title={isNew ? "Novo Formulário" : "Editar Formulário"} onClose={()=>setShowFormEditor(null)} C={C}>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <Inp C={C} label="Nome do formulário" value={fname} onChange={(e:any)=>setFname(e.target.value)} placeholder="Ex: Formulário Principal" />
          <Inp C={C} label="Tag automática" value={ftag} onChange={(e:any)=>setFtag(e.target.value)} placeholder="Ex: lead-frio, evento-jan" />
          <div>
            <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Campos do formulário</label>
            {ffields.map((field:string, i:number) => (
              <div key={i} style={{ display:"flex", gap:6, marginBottom:5, alignItems:"center" }}>
                {/* Reordenar */}
                <div style={{ display:"flex", flexDirection:"column", gap:1 }}>
                  <button onClick={()=>{ if(i===0) return; const f=[...ffields]; [f[i-1],f[i]]=[f[i],f[i-1]]; setFfields(f); }} style={{ background:"transparent", border:"none", color:i===0?C.border:C.textSub, cursor:i===0?"default":"pointer", fontSize:10, padding:"0 2px", lineHeight:1 }}>▲</button>
                  <button onClick={()=>{ if(i===ffields.length-1) return; const f=[...ffields]; [f[i],f[i+1]]=[f[i+1],f[i]]; setFfields(f); }} style={{ background:"transparent", border:"none", color:i===ffields.length-1?C.border:C.textSub, cursor:i===ffields.length-1?"default":"pointer", fontSize:10, padding:"0 2px", lineHeight:1 }}>▼</button>
                </div>
                {/* Renomear inline */}
                <input value={field} onChange={e=>{ const f=[...ffields]; f[i]=e.target.value; setFfields(f); }}
                  style={{ flex:1, background:C.muted, border:`1px solid ${C.border}`, borderRadius:7, padding:"7px 10px", fontSize:13, color:C.text, fontFamily:"inherit", outline:"none" }} />
                <button onClick={()=>setFfields((p:string[])=>p.filter((_:string,idx:number)=>idx!==i))} style={{ background:"transparent", border:"none", color:C.red, cursor:"pointer", fontSize:16 }}>×</button>
              </div>
            ))}
            <div style={{ display:"flex", gap:6, marginTop:4 }}>
              <input value={nfield} onChange={e=>setNfield(e.target.value)} placeholder="Novo campo..." onKeyDown={e=>{ if(e.key==="Enter"&&nfield){ setFfields((p:string[])=>[...p,nfield]); setNfield(""); }}}
                style={{ flex:1, background:C.muted, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:"7px 10px", fontSize:13, fontFamily:"inherit", outline:"none" }} />
              <button onClick={()=>{ if(nfield){ setFfields((p:string[])=>[...p,nfield]); setNfield(""); }}} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Adicionar</button>
            </div>
          </div>
          <Btn C={C} sx={{ width:"100%", justifyContent:"center" }} onClick={()=>{
            if (!fname) return;
            const updated = isNew
              ? { id: Date.now(), name: fname, tag: ftag, fields: ffields, subs: 0 }
              : { ...f, name: fname, tag: ftag, fields: ffields };
            setProj((p:any) => ({
              ...p,
              forms: isNew ? [...p.forms, updated] : p.forms.map((fm:any) => fm.id === f.id ? updated : fm)
            }));
            setShowFormEditor(null);
          }}>{isNew ? "Criar formulário" : "Salvar alterações"}</Btn>
          {!isNew && <button onClick={async()=>{
            if(f.dbId||f.id) { try { await fetch(`/api/forms?id=${f.dbId||f.id}`,{method:"DELETE"}); } catch {} }
            setProj((p:any)=>({...p,forms:p.forms.filter((fm:any)=>fm.id!==f.id)}));
            setShowFormEditor(null);
          }} style={{ background:"transparent", border:`1px solid ${C.red}40`, color:C.red, borderRadius:8, padding:"8px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Excluir formulário</button>}
        </div>
      </Modal>
    );
  };

  // LeadEditor modal
  const LeadEditorModal = () => {
    const l = editLead;
    const [ldata, setLdata] = useState({ ...l });
    const [tagInput, setTagInput] = useState(l.tags?.join(", ") || "");
    return (
      <Modal title="Editar Lead" onClose={()=>setEditLead(null)} C={C}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {allPossibleFields.filter((f:string) => leadFields.includes(f) || ["name","email"].includes(f)).map((field:string) => (
            <Inp key={field} C={C} label={fieldLabels[field] || field} value={ldata[field] || ""} onChange={(e:any)=>setLdata((p:any)=>({...p,[field]:e.target.value}))} />
          ))}
          <Inp C={C} label="Tags (separadas por vírgula)" value={tagInput} onChange={(e:any)=>setTagInput(e.target.value)} placeholder="quente, empresa, vip" />
          <div style={{ display:"flex", gap:8 }}>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:5 }}>Etapa</label>
              <select value={ldata.stage} onChange={e=>setLdata((p:any)=>({...p,stage:e.target.value}))}
                style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none" }}>
                {proj.funnel.map((s:string)=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:5 }}>Score (0-100)</label>
              <input type="number" min={0} max={100} value={ldata.score} onChange={e=>setLdata((p:any)=>({...p,score:parseInt(e.target.value)||0}))}
                style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:7, color:C.text, padding:"8px 10px", fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn C={C} sx={{ flex:1, justifyContent:"center" }} onClick={async()=>{
              const tags = tagInput.split(",").map((t:string)=>t.trim()).filter(Boolean);
              const updatedLead = {...ldata, tags};
              const projectId = proj.dbId || proj.id;
              await saveLead({...updatedLead, dbId: l.dbId||l.id}, projectId);
              setProj((p:any)=>({...p, leads: p.leads.map((ld:any)=>ld.id===l.id?updatedLead:ld)}));
              setEditLead(null);
            }}>Salvar</Btn>
            <button onClick={async()=>{
              if(l.dbId||l.id) { try { await fetch(`/api/leads?id=${l.dbId||l.id}`,{method:"DELETE"}); } catch {} }
              setProj((p:any)=>({...p,leads:p.leads.filter((ld:any)=>ld.id!==l.id)}));
              setEditLead(null);
            }}
              style={{ background:"transparent", border:`1px solid ${C.red}40`, color:C.red, borderRadius:8, padding:"0 16px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Excluir</button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {showFormEditor && <FormEditorModal />}
      {editLead && <LeadEditorModal />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:proj.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>{proj.icon} {proj.name}</div>
          <h1 style={{ fontSize:27, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>Leads & Captura</h1>
          <p style={{ color:C.textSub, fontSize:13, marginTop:3 }}>{filtered.length} leads · {proj.forms.length} formulários</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn C={C} v="ghost" icon="upload" onClick={() => setShowImport(true)}>Importar</Btn>
          <Btn C={C} v="ghost" icon="download" onClick={exportLeads}>Exportar</Btn>
          <Btn C={C} v="ghost" icon="plus" onClick={() => setShowFormEditor({})}>Novo formulário</Btn>
          <Btn C={C} icon="plus" onClick={() => setShowNew(true)}>Novo Lead</Btn>
        </div>
      </div>

      {/* Forms strip */}
      <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
        {proj.forms.map(f => (
          <div key={f.id} onClick={()=>setShowFormEditor(f)}
            style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"11px 15px", cursor:"pointer", display:"flex", gap:12, alignItems:"center", flex:1, minWidth:220, boxShadow:C.shadowCard, transition:"border-color 0.15s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor=C.accent}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor=C.border}>
            <Icon n="folder" size={15} color={proj.color} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{f.name}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{f.subs} submissões · tag: <span style={{ color:proj.color, fontWeight:700 }}>{f.tag}</span></div>
            </div>
            <Icon n="arrow" size={13} color={C.textSub} />
          </div>
        ))}
        <div onClick={() => setShowFormEditor({})} style={{ background:"transparent", border:`1px dashed ${C.borderHover}`, borderRadius:10, padding:"11px 15px", cursor:"pointer", display:"flex", gap:7, alignItems:"center", color:C.textSub, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
          <Icon n="plus" size={12} /> Novo formulário
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:C.textSub }}><Icon n="search" size={14} /></span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar leads..."
            style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, color:C.text, padding:"9px 12px 9px 33px", fontSize:13, outline:"none", boxSizing:"border-box" }} />
        </div>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {allTags.map(t => (
            <button key={t} onClick={() => setFt(t)}
              style={{ padding:"7px 13px", borderRadius:8, border:`1px solid ${ft===t?C.accent:C.border}`, background:ft===t?C.accentSoft:"transparent", color:ft===t?C.accent:C.textSub, fontSize:12, fontWeight:700, cursor:"pointer" }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, overflow:"auto", boxShadow:C.shadowCard }}>
        <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
          <thead>
            <tr style={{ borderBottom:`1px solid ${C.border}`, background:C.muted }}>
              {["Nome","Empresa","E-mail","Tags","Score","Etapa","Data"].map(h => (
                <th key={h} style={{ padding:"12px 15px", textAlign:"left", fontSize:11, fontWeight:700, color:C.textSub, letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <tr key={l.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}>
                <td style={{ padding:"12px 15px" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{l.name}</div>
                  <div style={{ fontSize:11, color:C.textSub }}>{l.phone}</div>
                </td>
                <td style={{ padding:"12px 15px", fontSize:13, color:C.textMid }}>{l.company}</td>
                <td style={{ padding:"12px 15px", fontSize:11, color:C.textSub, fontFamily:"monospace" }}>{l.email}</td>
                <td style={{ padding:"12px 15px" }}><div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>{l.tags.map(t => <TagBadge key={t} t={t} C={C} />)}</div></td>
                <td style={{ padding:"12px 15px", minWidth:110 }}><ScoreBar score={l.score} C={C} /></td>
                <td style={{ padding:"12px 15px" }}><span style={{ fontSize:12, color:STAGE_COLORS[l.stage]||C.textMid, fontWeight:700, textTransform:"capitalize" }}>{l.stage}</span></td>
                <td style={{ padding:"12px 15px", fontSize:12, color:C.textSub, whiteSpace:"nowrap" }}>{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IMPORT MODAL */}
      {showImport && (
        <Modal title="Importar / Exportar Leads" onClose={() => { setShowImport(false); setImportResult(null); setImportText(""); }} wide C={C}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:C.text, marginBottom:14 }}>📥 Importar CSV</div>
              <div style={{ background:C.muted, border:`1px dashed ${C.border}`, borderRadius:10, padding:16, marginBottom:12, textAlign:"center" }}>
                <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display:"none" }} />
                <Btn C={C} v="ghost" icon="upload" onClick={() => fileRef.current?.click()}>Selecionar arquivo CSV</Btn>
                <div style={{ fontSize:11, color:C.textSub, marginTop:8 }}>ou cole o conteúdo abaixo</div>
              </div>
              <Txa C={C} label="Conteúdo CSV" value={importText} onChange={e => setImportText(e.target.value)} placeholder={"name,email,phone,company,stage,tags\n\"João Silva\",\"joao@ex.com\",\"(11)99999\",\"Empresa\",\"novo\",\"quente\""} style={{ minHeight:120, fontSize:11, fontFamily:"monospace" }} />
              {importResult && (
                <div style={{ padding:"10px 14px", borderRadius:9, background:importResult.ok?C.greenSoft:C.redSoft, border:`1px solid ${importResult.ok?C.green:C.red}30`, color:importResult.ok?C.green:C.red, fontSize:13, fontWeight:700, marginBottom:12 }}>
                  {importResult.ok ? "✓ " : "✗ "}{importResult.msg}
                </div>
              )}
              <Btn C={C} icon="upload" onClick={handleImport} disabled={!importText.trim()}>Importar Leads</Btn>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:800, color:C.text, marginBottom:14 }}>📤 Exportar</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { label:"Exportar todos os leads", sub:`${proj.leads.length} leads com todos os campos`, icon:"download", action:exportLeads },
                  { label:"Exportar leads filtrados", sub:`${filtered.length} lead${filtered.length!==1?"s":""} do filtro atual`, icon:"download", action:() => { const rows=filtered.map(l=>({...l,tags:l.tags.join(";")})); downloadCSV(toCSV(rows,["name","email","phone","company","tags","score","stage","source","date"]),`leads-filtrados-${proj.id}.csv`); } },
                  { label:"Baixar template de importação", sub:"Planilha formatada para preenchimento", icon:"download", action:exportFunnel },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    style={{ display:"flex", gap:12, alignItems:"center", padding:"14px 16px", background:C.muted, border:`1px solid ${C.border}`, borderRadius:10, cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"border-color 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <div style={{ width:36, height:36, borderRadius:9, background:C.accentSoft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Icon n={item.icon} size={16} color={C.accent} />
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{item.label}</div>
                      <div style={{ fontSize:11, color:C.textSub }}>{item.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop:16, padding:14, background:C.muted, borderRadius:10, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, fontWeight:700, color:C.textSub, marginBottom:8 }}>FORMATO ESPERADO DO CSV</div>
                <code style={{ fontSize:10, color:C.accent, fontFamily:"monospace", lineHeight:1.7 }}>
                  name, email, phone, company<br/>
                  stage, tags (separadas por ;)<br/>
                  score (0–100)
                </code>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Form modal */}
      {showForm && (
        <Modal title={showForm.name} onClose={() => setShowForm(null)} wide C={C}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:11, padding:16 }}>
              <div style={{ fontSize:11, color:C.textSub, marginBottom:11, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Preview</div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {showForm.fields.map(f => <input key={f} placeholder={f} readOnly style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, color:C.textMid, padding:"9px 11px", fontSize:12 }} />)}
                <button style={{ background:proj.color, color:"#fff", border:"none", borderRadius:8, padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer", marginTop:2 }}>Quero Participar →</button>
              </div>
              <div style={{ marginTop:10, display:"flex", gap:6, alignItems:"center", fontSize:11, color:C.textSub }}>Tag: <TagBadge t={showForm.tag} C={C} /></div>
            </div>
            <div>
              <div style={{ fontSize:11, color:C.textSub, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Código embed</div>
              <pre style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:12, fontSize:10, color:C.green, overflow:"auto", fontFamily:"monospace", lineHeight:1.7, margin:0 }}>{embedCode(showForm)}</pre>
              <Btn C={C} sx={{ marginTop:10, width:"100%", justifyContent:"center" }}>Copiar código</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* New lead modal */}
      {showNew && (
        <Modal title="Novo Lead" onClose={() => setShowNew(false)} C={C}>
          <div style={{ display:"flex", flexDirection:"column" }}>
            {[["Nome *","name","text"],["E-mail *","email","email"],["Telefone","phone","tel"],["Empresa","company","text"]].map(([l,f,type]) => (
              <Inp key={f} C={C} label={l} type={type} value={nl[f]} onChange={e => setNl(p => ({...p,[f]:e.target.value}))} />
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:7, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Tags</label>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {Object.keys(TAG_PAL).map(t => { const s=nl.tags.includes(t); return (
                  <button key={t} onClick={() => setNl(p => ({...p, tags: s?p.tags.filter(x=>x!==t):[...p.tags,t]}))}
                    style={{ padding:"6px 13px", borderRadius:99, border:`1px solid ${s?C.accent:C.border}`, background:s?C.accentSoft:"transparent", color:s?C.accent:C.textSub, fontSize:12, cursor:"pointer", fontWeight:700 }}>{t}</button>
                ); })}
              </div>
            </div>
            <Btn C={C} onClick={addLead} sx={{ width:"100%", justifyContent:"center" }}>Cadastrar Lead</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL PAGE — with manual subscriber + test send
// ═══════════════════════════════════════════════════════════════════════════════
const EmailPage = ({ proj, setProj, C }) => {
  const [tab, setTab] = useState("campanhas");
  const [showNew, setShowNew] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [showAddSub, setShowAddSub] = useState(false);
  const [showTest, setShowTest] = useState(null);
  const [newSub, setNewSub] = useState({ name:"", email:"", company:"" });
  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState(null);
  const [newCampaign, setNewCampaign] = useState({ title:"", subject:"", content:"" });

  const subs = proj.leads.filter(l => l.nl);
  const sent = proj.newsletters.filter(n => n.status==="enviado");
  const tSent = sent.reduce((a,b)=>a+b.sent,0), tOpen = sent.reduce((a,b)=>a+b.opened,0), tClick = sent.reduce((a,b)=>a+b.clicked,0);
  const or = tSent?Math.round(tOpen/tSent*100):0, cr = tOpen?Math.round(tClick/tOpen*100):0;

  // Export subscribers
  const exportSubs = () => {
    const cols = ["name","email","company","date"];
    downloadCSV(toCSV(subs.map(l=>({name:l.name,email:l.email,company:l.company,date:l.date})), cols), `inscritos-${proj.id}.csv`);
  };

  const addSubscriber = () => {
    if (!newSub.name || !newSub.email) return;
    const existing = proj.leads.find(l => l.email === newSub.email);
    if (existing) {
      setProj(p => ({ ...p, leads: p.leads.map(l => l.email===newSub.email ? {...l, nl:true} : l) }));
    } else {
      setProj(p => ({ ...p, leads: [{ id:Date.now(), ...newSub, tags:[], score:40, stage:"novo", source:"Manual", date:new Date().toISOString().slice(0,10), nl:true }, ...p.leads] }));
    }
    setNewSub({ name:"", email:"", company:"" }); setShowAddSub(false);
  };

  const sendTest = () => {
    if (!testEmail) return;
    setTestStatus("sending");
    setTimeout(() => {
      // Simulated test — in production this calls the Resend API
      setTestStatus(testEmail.includes("@") ? "success" : "error");
    }, 1800);
  };

  const saveCampaign = (status) => {
    if (!newCampaign.title || !newCampaign.subject) return;
    setProj(p => ({ ...p, newsletters: [{ id: Date.now(), ...newCampaign, status, sent:0, opened:0, clicked:0, date:new Date().toISOString().slice(0,10) }, ...p.newsletters] }));
    setNewCampaign({ title:"", subject:"", content:"" }); setShowNew(false);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:proj.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>{proj.icon} {proj.name}</div>
          <h1 style={{ fontSize:27, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>E-mail & Newsletter</h1>
          <p style={{ color:C.textSub, fontSize:13, marginTop:3 }}>{subs.length} inscritos confirmados via double opt-in</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Btn C={C} v="ghost" icon="flask" onClick={() => setShowTest({})}>Testar Envio</Btn>
          <Btn C={C} v="ghost" icon="shield" onClick={() => setShowHealth(true)}>Saúde do Domínio</Btn>
          <Btn C={C} icon="plus" onClick={() => setShowNew(true)}>Nova Campanha</Btn>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[{l:"Inscritos",v:subs.length,c:C.accent},{l:"Enviados",v:tSent,c:C.textMid},{l:"Abertura",v:`${or}%`,c:C.green},{l:"Clique",v:`${cr}%`,c:C.amber}].map(s => (
          <div key={s.l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px", boxShadow:C.shadowCard }}>
            <div style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8, fontWeight:600 }}>{s.l}</div>
            <div style={{ fontSize:26, fontWeight:900, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:1, background:C.muted, border:`1px solid ${C.border}`, borderRadius:10, padding:3, width:"fit-content" }}>
        {["campanhas","automações","inscritos"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:"7px 18px", borderRadius:8, border:"none", background:tab===t?C.surface:"transparent", color:tab===t?C.text:C.textSub, fontSize:12, fontWeight:700, cursor:"pointer", textTransform:"capitalize", boxShadow:tab===t?C.shadowCard:"none" }}>{t}</button>
        ))}
      </div>

      {tab==="campanhas" && (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {proj.newsletters.map(n => (
            <div key={n.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"15px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:C.shadowCard, cursor:"pointer", transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{n.title}</div>
                <div style={{ fontSize:11, color:C.textSub, marginTop:2 }}>{n.subject} · {n.date}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                {n.status==="enviado" && <div style={{ display:"flex", gap:12, fontSize:12 }}>
                  <span style={{ color:C.accent, fontWeight:700 }}>✉ {n.sent}</span>
                  <span style={{ color:C.green, fontWeight:700 }}>↗ {n.opened}</span>
                  <span style={{ color:C.amber, fontWeight:700 }}>↳ {n.clicked}</span>
                </div>}
                <StatusDot status={n.status} C={C} />
                <button onClick={() => setShowTest(n)} style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:7, padding:"5px 10px", color:C.textMid, fontSize:11, cursor:"pointer", display:"flex", gap:5, alignItems:"center" }}>
                  <Icon n="flask" size={11} /> Testar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="automações" && (
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {[
            {n:"Double Opt-in",t:"Cadastro via formulário",a:"E-mail de confirmação imediata",s:"ativo"},
            {n:"Boas-vindas",t:"Confirmação de cadastro",a:"E-mail de boas-vindas após 5 min",s:"ativo"},
            {n:"Lead Quente",t:"Score ≥ 75",a:"Alerta interno + tag 'quente'",s:"ativo"},
            {n:"Follow-up D+3",t:"Lead sem contato em 3 dias",a:"Notificação interna de tarefa",s:"ativo"},
            {n:"Reengajamento",t:"Sem abertura em 30 dias",a:"Sequência de 2 e-mails",s:"pausado"},
          ].map((a,i) => (
            <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"14px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:C.shadowCard }}>
              <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:a.s==="ativo"?C.green:C.textSub, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{a.n}</div>
                  <div style={{ fontSize:11, color:C.textSub }}>{a.t} → {a.a}</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}><StatusDot status={a.s} C={C} /><Btn C={C} v="ghost" small>Editar</Btn></div>
            </div>
          ))}
        </div>
      )}

      {tab==="inscritos" && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div style={{ fontSize:13, color:C.textSub, fontWeight:600 }}>{subs.length} inscritos ativos</div>
            <div style={{ display:"flex", gap:8 }}>
              <Btn C={C} v="ghost" small icon="download" onClick={exportSubs}>Exportar</Btn>
              <Btn C={C} small icon="plus" onClick={() => setShowAddSub(true)}>Adicionar inscrito</Btn>
            </div>
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:13, overflow:"auto", boxShadow:C.shadowCard }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${C.border}`, background:C.muted }}>
                  {["Nome","E-mail","Empresa","Inscrito em","Status"].map(h => (
                    <th key={h} style={{ padding:"11px 15px", textAlign:"left", fontSize:11, fontWeight:700, color:C.textSub, letterSpacing:"0.07em", textTransform:"uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map((l,i) => (
                  <tr key={l.id} style={{ borderBottom:i<subs.length-1?`1px solid ${C.border}`:"none" }}>
                    <td style={{ padding:"12px 15px", fontSize:13, fontWeight:700, color:C.text }}>{l.name}</td>
                    <td style={{ padding:"12px 15px", fontSize:11, color:C.textSub, fontFamily:"monospace" }}>{l.email}</td>
                    <td style={{ padding:"12px 15px", fontSize:12, color:C.textMid }}>{l.company}</td>
                    <td style={{ padding:"12px 15px", fontSize:11, color:C.textSub }}>{l.date}</td>
                    <td style={{ padding:"12px 15px" }}><span style={{ padding:"3px 9px", borderRadius:99, fontSize:11, fontWeight:700, background:C.greenSoft, color:C.green }}>confirmado</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD SUBSCRIBER MODAL */}
      {showAddSub && (
        <Modal title="Adicionar Inscrito Manualmente" onClose={() => setShowAddSub(false)} C={C}>
          <div style={{ marginBottom:8, padding:"12px 14px", background:C.amberSoft, border:`1px solid ${C.amber}30`, borderRadius:9, fontSize:12, color:C.amber }}>
            ⚠ Em produção, inscritos adicionados manualmente devem ter confirmado recebimento conforme a LGPD.
          </div>
          <div style={{ display:"flex", flexDirection:"column", marginTop:14 }}>
            <Inp C={C} label="Nome *" value={newSub.name} onChange={e=>setNewSub(p=>({...p,name:e.target.value}))} />
            <Inp C={C} label="E-mail *" type="email" value={newSub.email} onChange={e=>setNewSub(p=>({...p,email:e.target.value}))} />
            <Inp C={C} label="Empresa" value={newSub.company} onChange={e=>setNewSub(p=>({...p,company:e.target.value}))} />
            <div style={{ display:"flex", gap:8, marginTop:4 }}>
              <Btn C={C} onClick={addSubscriber} disabled={!newSub.name||!newSub.email} sx={{ flex:1, justifyContent:"center" }}>Adicionar inscrito</Btn>
              <Btn C={C} v="ghost" onClick={() => setShowAddSub(false)} sx={{ flex:1, justifyContent:"center" }}>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* TEST SEND MODAL */}
      {showTest !== null && (
        <Modal title="Testar Envio de E-mail" onClose={() => { setShowTest(null); setTestStatus(null); setTestEmail(""); }} C={C}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {showTest?.title && (
              <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:"12px 14px" }}>
                <div style={{ fontSize:11, color:C.textSub, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Campanha</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{showTest.title}</div>
                <div style={{ fontSize:11, color:C.textSub }}>Assunto: {showTest.subject}</div>
              </div>
            )}
            <Inp C={C} label="Enviar e-mail de teste para *" type="email" value={testEmail} onChange={e => { setTestEmail(e.target.value); setTestStatus(null); }} placeholder="seu@email.com" />

            {testStatus === "sending" && (
              <div style={{ padding:"12px 14px", borderRadius:9, background:C.accentSoft, border:`1px solid ${C.accent}30`, fontSize:13, color:C.accent, fontWeight:700 }}>
                ⏳ Enviando e-mail de teste…
              </div>
            )}
            {testStatus === "success" && (
              <div style={{ padding:"12px 14px", borderRadius:9, background:C.greenSoft, border:`1px solid ${C.green}30`, fontSize:13, color:C.green, fontWeight:700 }}>
                ✓ E-mail de teste enviado para <strong>{testEmail}</strong>!<br/>
                <span style={{ fontSize:11, fontWeight:400 }}>Verifique sua caixa de entrada. Se não chegou em 2 min, cheque o spam e valide seu SPF/DKIM.</span>
              </div>
            )}
            {testStatus === "error" && (
              <div style={{ padding:"12px 14px", borderRadius:9, background:C.redSoft, border:`1px solid ${C.red}30`, fontSize:13, color:C.red, fontWeight:700 }}>
                ✗ E-mail inválido. Verifique o endereço digitado.
              </div>
            )}

            <div style={{ padding:"14px", background:C.muted, borderRadius:10, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.textSub, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.07em" }}>Checklist antes de disparar</div>
              {[
                ["SPF configurado","Registros DNS verificados","✓"],
                ["DKIM ativo","Assinatura criptográfica válida","✓"],
                ["DMARC","p=none (mínimo) configurado","⚠"],
                ["Remetente","Usa domínio próprio (não gmail/yahoo)","✓"],
                ["Provedor","Resend configurado com domínio verificado","✓"],
              ].map(([k,v,s]) => (
                <div key={k} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:7 }}>
                  <span style={{ fontSize:13, color:s==="✓"?C.green:C.amber, flexShrink:0 }}>{s}</span>
                  <div><div style={{ fontSize:12, fontWeight:700, color:C.text }}>{k}</div><div style={{ fontSize:11, color:C.textSub }}>{v}</div></div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:8 }}>
              <Btn C={C} icon="send" onClick={sendTest} disabled={!testEmail || testStatus==="sending"} sx={{ flex:1, justifyContent:"center" }}>
                {testStatus==="sending" ? "Enviando…" : "Enviar teste"}
              </Btn>
              <Btn C={C} v="ghost" onClick={() => { setTestStatus(null); setTestEmail(""); }} sx={{ flex:1, justifyContent:"center" }}>Limpar</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* HEALTH MODAL */}
      {showHealth && (
        <Modal title="Saúde do Domínio & Entregabilidade" onClose={() => setShowHealth(false)} C={C}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:10, padding:14 }}>
              <div style={{ fontSize:11, color:C.textSub, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Registros DNS</div>
              {[{r:"SPF",s:"ok",d:"v=spf1 include:resend.com ~all"},{r:"DKIM",s:"ok",d:"Chave RSA 2048-bit verificada"},{r:"DMARC",s:"warn",d:"p=none — recomendado: p=quarantine"},{r:"MX",s:"ok",d:"Bounce handling configurado"}].map(d => (
                <div key={d.r} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ display:"flex", gap:9, alignItems:"center" }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:d.s==="ok"?C.greenSoft:C.amberSoft, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {d.s==="ok" ? <Icon n="check" size={11} color={C.green} /> : <span style={{ fontSize:10, color:C.amber, fontWeight:700 }}>!</span>}
                    </div>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{d.r}</div>
                      <div style={{ fontSize:10, color:C.textSub, fontFamily:"monospace" }}>{d.d}</div>
                    </div>
                  </div>
                  <StatusDot status={d.s==="ok"?"ativo":"agendado"} C={C} />
                </div>
              ))}
            </div>
            <div style={{ background:C.amberSoft, border:`1px solid ${C.amber}30`, borderRadius:9, padding:13 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.amber, marginBottom:5 }}>⚠ DMARC em modo monitor</div>
              <div style={{ fontSize:12, color:C.textMid, lineHeight:1.6 }}>Mude para <code style={{ background:C.muted, padding:"1px 5px", borderRadius:4 }}>p=quarantine</code> após 2 semanas monitorando relatórios para máxima entregabilidade.</div>
            </div>
          </div>
        </Modal>
      )}

      {/* NEW CAMPAIGN MODAL */}
      {showNew && (
        <Modal title="Nova Campanha" onClose={() => setShowNew(false)} C={C}>
          <div style={{ display:"flex", flexDirection:"column" }}>
            <Inp C={C} label="Título interno *" value={newCampaign.title} onChange={e=>setNewCampaign(p=>({...p,title:e.target.value}))} placeholder="Ex: Newsletter Semanal #5" />
            <Inp C={C} label="Assunto do e-mail *" value={newCampaign.subject} onChange={e=>setNewCampaign(p=>({...p,subject:e.target.value}))} placeholder="Ex: As melhores oportunidades desta semana" />
            <Txa C={C} label="Conteúdo" value={newCampaign.content} onChange={e=>setNewCampaign(p=>({...p,content:e.target.value}))} placeholder="Escreva o conteúdo do e-mail..." style={{ minHeight:120 }} />
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Ação</label>
              <div style={{ display:"flex", gap:8 }}>
                <Btn C={C} icon="send" onClick={() => saveCampaign("enviado")} disabled={!newCampaign.title||!newCampaign.subject} sx={{ flex:1, justifyContent:"center" }}>Enviar Agora</Btn>
                <Btn C={C} v="ghost" onClick={() => saveCampaign("agendado")} disabled={!newCampaign.title} sx={{ flex:1, justifyContent:"center" }}>Agendar</Btn>
                <Btn C={C} v="ghost" onClick={() => saveCampaign("rascunho")} disabled={!newCampaign.title} sx={{ flex:1, justifyContent:"center" }}>Rascunho</Btn>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const ScoringPage = ({ proj, setProj, C }) => {
  const sorted = [...proj.leads].sort((a,b) => b.score-a.score);
  const rules = proj.scoringRules || [
    { id:1, label:"Preencher formulário", points:10 },
    { id:2, label:"Abrir e-mail", points:5 },
    { id:3, label:"Clicar em link", points:8 },
    { id:4, label:"Tag empresário/aplicante", points:15 },
    { id:5, label:"Participar de evento", points:20 },
    { id:6, label:"Sem interação 15 dias", points:-10 },
    { id:7, label:"Descadastro newsletter", points:-20 },
  ];
  const [showNewRule, setShowNewRule] = useState(false);
  const [newRule, setNewRule] = useState({ label:"", points:10 });

  const saveRules = (updatedRules: any[]) => {
    setProj((p: any) => ({ ...p, scoringRules: updatedRules }));
  };
  const deleteRule = (id: number) => saveRules(rules.filter(r => r.id !== id));
  const addRule = () => {
    if (!newRule.label) return;
    saveRules([...rules, { ...newRule, id: Date.now() }]);
    setNewRule({ label:"", points:10 }); setShowNewRule(false);
  };
  const updatePoints = (id: number, points: number) => {
    saveRules(rules.map(r => r.id === id ? { ...r, points } : r));
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <div style={{ fontSize:11, color:proj.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>{proj.icon} {proj.name}</div>
        <h1 style={{ fontSize:27, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>Lead Scoring</h1>
        <p style={{ color:C.textSub, fontSize:13, marginTop:3 }}>Pontuação automática por comportamento e perfil.</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, boxShadow:C.shadowCard }}>
          <div style={{ fontSize:11, fontWeight:700, color:C.textSub, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.07em" }}>Ranking</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {sorted.map((l,i) => (
              <div key={l.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:22, height:22, borderRadius:6, background:i<3?`${proj.color}18`:C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900, color:i<3?proj.color:C.textSub, flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.name}</div>
                  <div style={{ fontSize:11, color:C.textSub }}>{l.company}</div>
                </div>
                <div style={{ minWidth:100 }}><ScoreBar score={l.score} C={C} /></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, flex:1, boxShadow:C.shadowCard }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.07em" }}>Regras</div>
              <Btn C={C} v="ghost" small icon="plus" onClick={()=>setShowNewRule(r=>!r)}>Adicionar</Btn>
            </div>
            {rules.map(r => (
              <div key={r.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 11px", background:C.muted, borderRadius:7, marginBottom:5 }}>
                <div style={{ display:"flex", gap:7, alignItems:"center", flex:1 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:r.points>0?C.green:C.red }} />
                  <span style={{ fontSize:12, color:C.textMid, flex:1 }}>{r.label}</span>
                </div>
                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <input type="number" value={r.points} onChange={e=>updatePoints(r.id, parseInt(e.target.value)||0)}
                    style={{ width:54, background:C.surface, border:`1px solid ${C.border}`, borderRadius:5, color:r.points>0?C.green:C.red, padding:"3px 6px", fontSize:12, fontWeight:800, textAlign:"center", fontFamily:"monospace", outline:"none" }} />
                  <button onClick={()=>deleteRule(r.id)} style={{ background:"transparent", border:"none", color:C.red, cursor:"pointer", fontSize:14, padding:"0 2px" }}>×</button>
                </div>
              </div>
            ))}
            {showNewRule && (
              <div style={{ display:"flex", gap:6, marginTop:6 }}>
                <input value={newRule.label} onChange={e=>setNewRule(r=>({...r,label:e.target.value}))} placeholder="Nome da regra"
                  style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"6px 9px", fontSize:12, fontFamily:"inherit", outline:"none" }} />
                <input type="number" value={newRule.points} onChange={e=>setNewRule(r=>({...r,points:parseInt(e.target.value)||0}))}
                  style={{ width:54, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"6px 9px", fontSize:12, textAlign:"center", fontFamily:"monospace", outline:"none" }} />
                <button onClick={addRule} style={{ background:C.accent, border:"none", color:"#fff", borderRadius:6, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer" }}>OK</button>
              </div>
            )}
          </div>
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:18, boxShadow:C.shadowCard }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textSub, marginBottom:11, textTransform:"uppercase", letterSpacing:"0.07em" }}>Automações por score</div>
            {[["≥ 75","Tag quente + alerta",C.green],["40–74","Tag morno",C.amber],["< 40","Tag frio",C.textSub]].map(([r,a,c]) => (
              <div key={r} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, fontWeight:800, color:c, fontFamily:"monospace", minWidth:50 }}>{r}</span>
                <span style={{ fontSize:12, color:C.textMid }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE BUILDER
// ═══════════════════════════════════════════════════════════════════════════════
const PrevHero = ({ d, mob }) => {
  const bg = d.bgStyle==="gradient" ? `linear-gradient(155deg, ${d.bg} 0%, #0d1f3c 100%)` : d.bg;
  const hasOverlay = d.bgImageUrl && d.overlayOpacity > 0;
  return (
    <div style={{ background:bg, padding:mob?"44px 22px":"72px 56px", textAlign:d.align, fontFamily:"'DM Sans',sans-serif", position:"relative", overflow:"hidden",
      backgroundImage: d.bgImageUrl ? `url(${d.bgImageUrl})` : undefined,
      backgroundSize: "cover", backgroundPosition: "center" }}>
      {hasOverlay && <div style={{ position:"absolute", inset:0, background:d.overlayColor, opacity:d.overlayOpacity/100, pointerEvents:"none" }} />}
      <div style={{ position:"relative", zIndex:1 }}>
        {d.logoUrl && <img src={d.logoUrl} alt="Logo" style={{ height:mob?40:56, marginBottom:20, objectFit:"contain" }} />}
        {d.badgeOn && <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:`${d.accent}1e`, border:`1px solid ${d.accent}38`, borderRadius:99, padding:"4px 13px", fontSize:mob?9:11, fontWeight:700, color:d.accent, marginBottom:18, letterSpacing:"0.06em" }}><span style={{ width:4, height:4, borderRadius:"50%", background:d.accent, display:"inline-block" }}/>{d.badge}</div>}
        <h1 style={{ fontSize:mob?24:40, fontWeight:900, color:d.headC, lineHeight:1.1, letterSpacing:"-0.03em", margin:"0 auto 16px", maxWidth:mob?"100%":640 }}>{d.headline}</h1>
        <p style={{ fontSize:mob?13:15, color:d.subC, maxWidth:mob?"100%":520, margin:"0 auto 28px", lineHeight:1.6 }}>{d.sub}</p>
        <a href={d.ctaUrl} style={{ display:"inline-block", background:d.accent, color:"#fff", padding:mob?"11px 24px":"13px 32px", borderRadius:9, fontWeight:700, fontSize:mob?12:14, textDecoration:"none", boxShadow:`0 6px 28px ${d.accent}38` }}>{d.cta}</a>
      </div>
    </div>
  );
};
const PrevAbout = ({ d, mob }) => (
  <div style={{ background:d.bg, padding:mob?"36px 22px":"64px 56px", fontFamily:"'DM Sans',sans-serif", position:"relative",
    backgroundImage: d.bgImageUrl ? `url(${d.bgImageUrl})` : undefined,
    backgroundSize: "cover", backgroundPosition: "center" }}>
    {d.bgImageUrl && d.overlayOpacity > 0 && <div style={{ position:"absolute", inset:0, background:d.overlayColor||"#000", opacity:(d.overlayOpacity||0)/100, pointerEvents:"none" }} />}
    <div style={{ maxWidth:640, margin:"0 auto", position:"relative", zIndex:1 }}>
      {d.tagOn && <div style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:10, fontWeight:700, color:d.accent, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:14 }}><div style={{ width:18, height:2, background:d.accent }}/>{d.tag}</div>}
      <h2 style={{ fontSize:mob?20:30, fontWeight:800, color:d.textC, lineHeight:1.2, letterSpacing:"-0.02em", marginBottom:16 }}>{d.title}</h2>
      <p style={{ fontSize:mob?13:15, color:d.subC, lineHeight:1.7, marginBottom:24, whiteSpace:"pre-wrap" }}>{d.body}</p>
      {d.highlight && <div style={{ borderLeft:`3px solid ${d.accent}`, paddingLeft:14, fontSize:mob?13:15, fontWeight:700, color:d.textC }}>{d.highlight}</div>}
    </div>
  </div>
);
const PrevForm = ({ d, mob }) => {
  // Derivar cores do card baseado no fundo — claro ou escuro
  const isDark = d.bg && (d.bg.startsWith("#0") || d.bg.startsWith("#1") || d.bg === "#000");
  const cardBg = d.cardBg || (isDark ? "#ffffff14" : "#f5f6fa");
  const cardBorder = isDark ? "#ffffff18" : "#e4e8f0";
  const titleC = d.titleC || (isDark ? "#ffffff" : "#0d1b2e");
  const subC = d.subC || (isDark ? "#aaaacc" : "#5a7593");
  const fieldBg = isDark ? "#ffffff0e" : "#ffffff";
  const fieldBorder = isDark ? "#ffffff1a" : "#dde4ed";
  const fieldC = isDark ? "#ccccdd" : "#3d5a7a";
  return (
    <div style={{ background:d.bg, padding:mob?"36px 18px":"64px 56px", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ maxWidth:440, margin:"0 auto", background:cardBg, border:`1px solid ${cardBorder}`, borderRadius:18, padding:mob?"24px 18px":"36px 32px" }}>
        <h2 style={{ fontSize:mob?18:23, fontWeight:800, color:titleC, marginBottom:7 }}>{d.title}</h2>
        <p style={{ fontSize:12, color:subC, marginBottom:20, lineHeight:1.5 }}>{d.sub}</p>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {(d.fields||[]).map((f:string,i:number) => <div key={i} style={{ background:fieldBg, border:`1px solid ${fieldBorder}`, borderRadius:7, padding:"9px 12px", fontSize:12, color:fieldC }}>{f}</div>)}
          <button style={{ background:d.accent, color:"#fff", border:"none", borderRadius:8, padding:"12px", fontSize:13, fontWeight:700, cursor:"pointer", marginTop:4 }}>{d.cta}</button>
        </div>
        {d.socialOn && <p style={{ fontSize:10, color:subC, textAlign:"center", marginTop:14 }}>{d.social}</p>}
      </div>
    </div>
  );
};
const BlockPrev = ({ b, mob }) => {
  if (b.type==="hero") return <PrevHero d={b.data} mob={mob} />;
  if (b.type==="about") return <PrevAbout d={b.data} mob={mob} />;
  if (b.type==="form") return <PrevForm d={b.data} mob={mob} />;
  return null;
};

const PC = ({ label, value, onChange, C }) => (
  <div style={{ marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <label style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</label>
    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
      <span style={{ fontSize:10, color:C.textMid, fontFamily:"monospace" }}>{value}</span>
      <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ width:26, height:26, borderRadius:6, border:`1px solid ${C.border}`, background:"none", cursor:"pointer", padding:2 }} />
    </div>
  </div>
);
const PT = ({ label, value, onChange, C }) => (
  <div style={{ marginBottom:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
    <label style={{ fontSize:10, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</label>
    <button onClick={() => onChange(!value)} style={{ width:34, height:19, borderRadius:99, border:"none", background:value?C.accent:C.muted, cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
      <div style={{ width:13, height:13, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:value?18:3, transition:"left 0.2s" }} />
    </button>
  </div>
);
const PI = ({ label, value, onChange, multiline, C }) => (
  <div style={{ marginBottom:10 }}>
    <label style={{ fontSize:10, color:C.textSub, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</label>
    {multiline
      ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"7px 9px", fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"inherit", resize:"vertical" }} />
      : <input value={value} onChange={e => onChange(e.target.value)} style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"7px 9px", fontSize:12, outline:"none", boxSizing:"border-box", fontFamily:"inherit" }} />}
  </div>
);
const PS = ({ label, value, onChange, opts, C }) => (
  <div style={{ marginBottom:10 }}>
    <label style={{ fontSize:10, color:C.textSub, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"7px 9px", fontSize:12, outline:"none", fontFamily:"inherit" }}>
      {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </div>
);
const Sec = ({ title, C, children }) => (
  <div style={{ marginBottom:18 }}>
    <div style={{ fontSize:9, fontWeight:700, color:C.accent, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:9, paddingBottom:5, borderBottom:`1px solid ${C.border}` }}>{title}</div>
    {children}
  </div>
);

const HeroPanel = ({ d, u, C }) => <>
  <Sec title="Logo & Mídia" C={C}><PI C={C} label="URL do logo" value={d.logoUrl||""} onChange={v=>u("logoUrl",v)} placeholder="https://..."/><PI C={C} label="URL imagem de fundo" value={d.bgImageUrl||""} onChange={v=>u("bgImageUrl",v)} placeholder="https://..."/>{d.bgImageUrl && <><PC C={C} label="Cor do overlay" value={d.overlayColor||"#000000"} onChange={v=>u("overlayColor",v)}/><PI C={C} label="Opacidade overlay (0-100)" value={String(d.overlayOpacity||0)} onChange={v=>u("overlayOpacity",parseInt(v)||0)}/></>}</Sec><Sec title="Conteúdo" C={C}><PT C={C} label="Badge visível" value={d.badgeOn} onChange={v=>u("badgeOn",v)}/>{d.badgeOn&&<PI C={C} label="Texto do badge" value={d.badge} onChange={v=>u("badge",v)}/>}<PI C={C} label="Título" value={d.headline} onChange={v=>u("headline",v)} multiline/><PI C={C} label="Subtítulo" value={d.sub} onChange={v=>u("sub",v)} multiline/><PI C={C} label="CTA texto" value={d.cta} onChange={v=>u("cta",v)}/><PI C={C} label="CTA link" value={d.ctaUrl} onChange={v=>u("ctaUrl",v)}/></Sec>
  <Sec title="Logo" C={C}><PI C={C} label="URL da logo" value={d.logoUrl||""} onChange={v=>u("logoUrl",v)} placeholder="https://..."/>{d.logoUrl&&<div style={{marginBottom:8}}><label style={{fontSize:10,color:C.textSub,display:"block",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.07em",fontWeight:600}}>Tamanho (px)</label><input type="range" min={30} max={200} value={d.logoSize||60} onChange={e=>u("logoSize",parseInt(e.target.value))} style={{width:"100%"}}/><span style={{fontSize:10,color:C.textSub}}>{d.logoSize||60}px</span></div>}</Sec>
  <Sec title="Imagem de fundo" C={C}><PI C={C} label="URL da imagem" value={d.bgImage||""} onChange={v=>u("bgImage",v)} placeholder="https://..."/><PT C={C} label="Overlay ativo" value={d.bgOverlayOn||false} onChange={v=>u("bgOverlayOn",v)}/>{d.bgOverlayOn&&<PC C={C} label="Cor do overlay" value={d.bgOverlay||"#00000060"} onChange={v=>u("bgOverlay",v)}/>}</Sec>
  <Sec title="Estilo" C={C}><PS C={C} label="Alinhamento" value={d.align} onChange={v=>u("align",v)} opts={[{v:"center",l:"Centralizado"},{v:"left",l:"Esquerda"}]}/><PS C={C} label="Fundo" value={d.bgStyle} onChange={v=>u("bgStyle",v)} opts={[{v:"gradient",l:"Gradiente"},{v:"solid",l:"Sólido"}]}/><PC C={C} label="Cor fundo" value={d.bg} onChange={v=>u("bg",v)}/><PC C={C} label="Título" value={d.headC} onChange={v=>u("headC",v)}/><PC C={C} label="Subtítulo" value={d.subC} onChange={v=>u("subC",v)}/><PC C={C} label="Destaque" value={d.accent} onChange={v=>u("accent",v)}/></Sec>
</>;
const AboutPanel = ({ d, u, C }) => <>
  <Sec title="Conteúdo" C={C}><PT C={C} label="Tag visível" value={d.tagOn} onChange={v=>u("tagOn",v)}/>{d.tagOn&&<PI C={C} label="Tag" value={d.tag} onChange={v=>u("tag",v)}/>}<PI C={C} label="Título" value={d.title} onChange={v=>u("title",v)}/><PI C={C} label="Corpo" value={d.body} onChange={v=>u("body",v)} multiline/><PI C={C} label="Destaque" value={d.highlight} onChange={v=>u("highlight",v)}/></Sec>
  <Sec title="Imagem de fundo" C={C}><PI C={C} label="URL da imagem" value={d.bgImage||""} onChange={v=>u("bgImage",v)} placeholder="https://..."/><PT C={C} label="Overlay ativo" value={d.bgOverlayOn||false} onChange={v=>u("bgOverlayOn",v)}/>{d.bgOverlayOn&&<PC C={C} label="Cor do overlay" value={d.bgOverlay||"#00000060"} onChange={v=>u("bgOverlay",v)}/>}</Sec>
  <Sec title="Estilo" C={C}><PC C={C} label="Fundo" value={d.bg} onChange={v=>u("bg",v)}/><PC C={C} label="Texto" value={d.textC} onChange={v=>u("textC",v)}/><PC C={C} label="Secundário" value={d.subC} onChange={v=>u("subC",v)}/><PC C={C} label="Destaque" value={d.accent} onChange={v=>u("accent",v)}/></Sec><Sec title="Imagem de fundo" C={C}><PI C={C} label="URL da imagem" value={d.bgImageUrl||""} onChange={v=>u("bgImageUrl",v)} placeholder="https://..."/>{d.bgImageUrl && <><PC C={C} label="Cor do overlay" value={d.overlayColor||"#000000"} onChange={v=>u("overlayColor",v)}/><PI C={C} label="Opacidade (0-100)" value={String(d.overlayOpacity||0)} onChange={v=>u("overlayOpacity",parseInt(v)||0)}/></>}</Sec>
</>;
const FormPanel = ({ d, u, forms, C }) => <>
  <Sec title="Formulário vinculado" C={C}>
    {forms.length>0
      ? <select value={d.formId||""} onChange={e=>{
          const f=forms.find(f=>String(f.id)===e.target.value);
          u("formId",f?.id||null);
          u("formName",f?.name||null);
          // Carregar campos do formulário selecionado automaticamente
          if(f?.fields) u("fields", f.fields);
        }} style={{ width:"100%", background:C.muted, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, padding:"7px 9px", fontSize:12, fontFamily:"inherit" }}>
          <option value="">— Selecione —</option>{forms.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      : <div style={{ fontSize:11, color:C.textSub }}>Nenhum formulário. Crie na aba Leads.</div>}
  </Sec>
  <Sec title="Conteúdo" C={C}><PI C={C} label="Título" value={d.title} onChange={v=>u("title",v)}/><PI C={C} label="Subtítulo" value={d.sub} onChange={v=>u("sub",v)}/><PI C={C} label="Texto CTA" value={d.cta} onChange={v=>u("cta",v)}/><PT C={C} label="Prova social" value={d.socialOn} onChange={v=>u("socialOn",v)}/>{d.socialOn&&<PI C={C} label="Texto" value={d.social} onChange={v=>u("social",v)}/>}</Sec>
  <Sec title="Estilo" C={C}><PC C={C} label="Fundo da seção" value={d.bg} onChange={v=>u("bg",v)}/><PC C={C} label="Cor do botão" value={d.accent} onChange={v=>u("accent",v)}/><PC C={C} label="Título" value={d.titleC||"#0d1b2e"} onChange={v=>u("titleC",v)}/><PC C={C} label="Subtítulo" value={d.subC||"#5a7593"} onChange={v=>u("subC",v)}/><PC C={C} label="Fundo do card" value={d.cardBg||"#f5f6fa"} onChange={v=>u("cardBg",v)}/></Sec>
</>;

const BTYPES = [{type:"hero",label:"Hero / Cabeçalho",icon:"zap",desc:"Título, subtítulo e CTA"},{type:"about",label:"Sobre / Descrição",icon:"layout",desc:"Texto, destaque, tag"},{type:"form",label:"Formulário",icon:"send",desc:"Vinculado ao projeto"}];
const TMPLS = [
  {id:"evento",name:"Evento / Encontro",icon:"⬡",desc:"Hero + Descrição + Formulário",color:"#1d6aff"},
  {id:"captacao",name:"Captação de Leads",icon:"◈",desc:"Foco em conversão",color:"#0fb981"},
  {id:"mentoria",name:"Programa / Mentoria",icon:"◆",desc:"Página de vendas",color:"#7c5cfc"},
  {id:"blank",name:"Em branco",icon:"○",desc:"Blocos manuais",color:"#3d5a7a"},
];

// ── BUILDER (fixed scroll) ──
const Builder = ({ page, proj, onSave, onClose, saving, C }) => {
  const [blocks, setBlocks] = useState(page.blocks || []);
  const [sel, setSel] = useState(null);
  const [mob, setMob] = useState(false);
  const [panelTab, setPanelTab] = useState("blocks");
  const [showAdd, setShowAdd] = useState(false);
  const [pub, setPub] = useState(page.published||false);

  const selBlock = blocks.find(b => b.id===sel);
  const upd = (id,f,v) => setBlocks(prev => prev.map(b => b.id===id?{...b,data:{...b.data,[f]:v}}:b));
  const addBlock = type => { const nb=type==="hero"?mkHero():type==="about"?mkAbout():mkForm(proj.forms); setBlocks(p=>[...p,nb]); setSel(nb.id); setPanelTab("props"); setShowAdd(false); };
  const delBlock = id => { setBlocks(p=>p.filter(b=>b.id!==id)); if(sel===id) setSel(null); };
  const mvBlock = (id,dir) => setBlocks(prev=>{const i=prev.findIndex(b=>b.id===id),arr=[...prev];if(dir==="up"&&i===0||dir==="down"&&i===arr.length-1)return prev;const sw=dir==="up"?i-1:i+1;[arr[i],arr[sw]]=[arr[sw],arr[i]];return arr;});
  const slug = (page.slug || page.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""));
  const url = `${process.env.NEXT_PUBLIC_APP_URL || 'https://clubecrm.vercel.app'}/p/${proj.id}/${slug}`;

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", background:C.bg, fontFamily:"'DM Sans',sans-serif", zIndex:200, overflow:"hidden" }}>
      {/* LEFT PANEL */}
      <div style={{ width:252, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0, overflow:"hidden" }}>
        <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div><div style={{ fontSize:12, fontWeight:800, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:170 }}>{page.title}</div><div style={{ fontSize:10, color:C.textSub }}>{proj.icon} {proj.name}</div></div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMid, cursor:"pointer", padding:3, display:"flex" }}><Icon n="close" size={15} /></button>
        </div>
        <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          {["blocks","props"].map(t => <button key={t} onClick={() => setPanelTab(t)} style={{ flex:1, padding:"9px 0", border:"none", background:panelTab===t?C.muted:"transparent", color:panelTab===t?C.text:C.textSub, fontSize:11, fontWeight:700, cursor:"pointer", textTransform:"capitalize", borderBottom:panelTab===t?`2px solid ${C.accent}`:"2px solid transparent" }}>{t==="blocks"?"Blocos":"Propriedades"}</button>)}
        </div>
        {/* SCROLLABLE panel body */}
        <div style={{ flex:1, overflowY:"auto", padding:10, minHeight:0 }}>
          {panelTab==="blocks" && <>
            <div style={{ fontSize:9, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8, paddingLeft:2, fontWeight:700 }}>Estrutura</div>
            {blocks.length===0 && <div style={{ textAlign:"center", padding:"20px 10px", color:C.textSub, fontSize:12 }}>Nenhum bloco</div>}
            {blocks.map((b,i) => {
              const meta=BTYPES.find(bt=>bt.type===b.type), isSel=sel===b.id;
              return <div key={b.id} onClick={() => { setSel(b.id); setPanelTab("props"); }}
                style={{ background:isSel?C.accentSoft:C.muted, border:`1px solid ${isSel?C.accent:C.border}`, borderRadius:8, padding:"9px 11px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <Icon n={meta?.icon||"layout"} size={12} color={isSel?C.accent:C.textMid} />
                  <div><div style={{ fontSize:12, fontWeight:700, color:isSel?C.accent:C.textMid }}>{meta?.label}</div><div style={{ fontSize:9, color:C.textSub }}>#{i+1}</div></div>
                </div>
                <div style={{ display:"flex", gap:1 }} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>mvBlock(b.id,"up")} style={{ background:"none", border:"none", color:C.textSub, cursor:"pointer", padding:3 }}><Icon n="chevU" size={10}/></button>
                  <button onClick={()=>mvBlock(b.id,"down")} style={{ background:"none", border:"none", color:C.textSub, cursor:"pointer", padding:3 }}><Icon n="chevD" size={10}/></button>
                  <button onClick={()=>delBlock(b.id)} style={{ background:"none", border:"none", color:C.red, cursor:"pointer", padding:3 }}><Icon n="trash" size={10}/></button>
                </div>
              </div>;
            })}
            <button onClick={()=>setShowAdd(s=>!s)} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, padding:"9px", borderRadius:8, border:`1px dashed ${C.borderHover}`, background:"transparent", color:C.textMid, fontSize:11, fontWeight:700, cursor:"pointer", width:"100%", marginTop:4 }}>
              <Icon n="plus" size={12}/> Adicionar bloco
            </button>
            {showAdd && <div style={{ marginTop:6, display:"flex", flexDirection:"column", gap:5, background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:9 }}>
              {BTYPES.map(bt => <button key={bt.type} onClick={()=>addBlock(bt.type)} style={{ display:"flex", gap:9, alignItems:"center", padding:"9px 11px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, cursor:"pointer", textAlign:"left", fontFamily:"inherit" }}>
                <Icon n={bt.icon} size={13} color={C.accent}/>
                <div><div style={{ fontSize:12, fontWeight:700, color:C.text }}>{bt.label}</div><div style={{ fontSize:9, color:C.textSub }}>{bt.desc}</div></div>
              </button>)}
            </div>}
          </>}
          {panelTab==="props" && <>
            {!selBlock && <div style={{ textAlign:"center", padding:"20px 10px", color:C.textSub, fontSize:12 }}>Selecione um bloco no canvas.</div>}
            {selBlock?.type==="hero" && <HeroPanel d={selBlock.data} u={(f,v)=>upd(selBlock.id,f,v)} C={C}/>}
            {selBlock?.type==="about" && <AboutPanel d={selBlock.data} u={(f,v)=>upd(selBlock.id,f,v)} C={C}/>}
            {selBlock?.type==="form" && <FormPanel d={selBlock.data} u={(f,v)=>upd(selBlock.id,f,v)} forms={proj.forms} C={C}/>}
          </>}
        </div>
      </div>

      {/* CENTER CANVAS */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        <div style={{ height:50, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px", flexShrink:0 }}>
          <div style={{ display:"flex", gap:3, background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, padding:3 }}>
            {[["desktop","Desktop"],["phone","Mobile"]].map(([ic,l]) => <button key={l} onClick={()=>setMob(ic==="phone")} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:6, border:"none", background:mob===(ic==="phone")?C.surface:"transparent", color:mob===(ic==="phone")?C.text:C.textSub, fontSize:11, fontWeight:700, cursor:"pointer" }}><Icon n={ic} size={12}/>{l}</button>)}
          </div>
          <div style={{ display:"flex", gap:7, alignItems:"center" }}>
            {pub && <div style={{ display:"flex", gap:5, alignItems:"center", background:C.greenSoft, border:`1px solid ${C.green}30`, borderRadius:7, padding:"4px 11px" }}><div style={{ width:5, height:5, borderRadius:"50%", background:C.green }}/><span style={{ fontSize:11, color:C.green, fontWeight:700 }}>Publicada</span></div>}
            <Btn C={C} v="ghost" small onClick={()=>onSave({...page,blocks,published:pub})}>{saving?"Salvando...":"Salvar rascunho"}</Btn>
            <Btn C={C} small icon="globe" onClick={()=>{setPub(true);onSave({...page,blocks,published:true});}}>{saving?"Salvando...":"Publicar"}</Btn>
          </div>
        </div>
        {/* Canvas with proper scroll */}
        <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", background:C.bg==="#f0f4f8"?"#e4eaf2":"#020609", display:"flex", justifyContent:"center", padding:"20px 16px", minHeight:0 }}>
          <div style={{ width:mob?390:"100%", maxWidth:mob?390:860, background:C.bg, borderRadius:mob?22:12, border:`1px solid ${C.border}`, overflow:"hidden", boxShadow:mob?"0 20px 56px rgba(0,0,0,0.3)":C.shadowCard, transition:"all 0.25s ease", minHeight:400, alignSelf:"flex-start" }}>
            {mob && <div style={{ height:28, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:44, height:3, borderRadius:99, background:C.border }}/></div>}
            {blocks.length===0 && <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:10, color:C.textSub }}><Icon n="layout" size={30} color={C.border}/><div style={{ fontSize:14, fontWeight:700 }}>Página vazia</div><div style={{ fontSize:12 }}>Adicione blocos no painel esquerdo</div></div>}
            {blocks.map(b => <div key={b.id} onClick={()=>{setSel(b.id);setPanelTab("props");}} style={{ outline:sel===b.id?`2px solid ${C.accent}`:"2px solid transparent", cursor:"pointer", transition:"outline 0.15s" }}><BlockPrev b={b} mob={mob}/></div>)}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width:200, background:C.surface, borderLeft:`1px solid ${C.border}`, flexShrink:0, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"12px 14px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ fontSize:10, fontWeight:700, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.08em" }}>Publicação</div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:12, minHeight:0 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:11 }}>
              <div style={{ fontSize:9, color:C.textSub, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>Status</div>
              <div style={{ display:"flex", gap:6, alignItems:"center" }}><div style={{ width:6, height:6, borderRadius:"50%", background:pub?C.green:C.amber }}/><span style={{ fontSize:12, fontWeight:700, color:pub?C.green:C.amber }}>{pub?"Publicada":"Rascunho"}</span></div>
            </div>
            <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:11 }}>
              <div style={{ fontSize:9, color:C.textSub, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>URL</div>
              <div style={{ fontSize:9, color:pub?C.accent:C.textSub, fontFamily:"monospace", wordBreak:"break-all", lineHeight:1.5 }}>{pub?url:"Publique para gerar URL"}</div>
            </div>
            <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:9, padding:11 }}>
              <div style={{ fontSize:9, color:C.textSub, marginBottom:7, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:700 }}>Blocos ({blocks.length})</div>
              {blocks.map(b=>{const m=BTYPES.find(bt=>bt.type===b.type);return <div key={b.id} style={{ display:"flex", gap:6, alignItems:"center", marginBottom:5 }}><div style={{ width:16, height:16, borderRadius:4, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon n={m?.icon||"layout"} size={9} color={C.textMid}/></div><span style={{ fontSize:10, color:C.textMid }}>{m?.label}</span></div>;})}
              {!blocks.length && <span style={{ fontSize:10, color:C.textSub }}>Nenhum</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplatePicker = ({ proj, onClose, onCreate, C }) => {
  const [name, setName] = useState(""); const [tmpl, setTmpl] = useState(null);
  const create = () => {
    if (!name||!tmpl) return;
    const blocks = tmpl==="blank"?[]:[mkHero(),mkAbout(),mkForm(proj.forms)];
    onCreate({ id:"pg"+Date.now(), title:name, template:tmpl, blocks, published:false, date:new Date().toISOString().slice(0,10) });
  };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(8px)", zIndex:400, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:20, width:"100%", maxWidth:640, boxShadow:C.shadow, maxHeight:"90vh", overflow:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px 16px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, background:C.surface }}>
          <div><h2 style={{ fontSize:17, fontWeight:800, color:C.text, margin:0 }}>Nova Landing Page</h2><p style={{ fontSize:12, color:C.textSub, marginTop:3 }}>{proj.icon} {proj.name}</p></div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMid, cursor:"pointer" }}><Icon n="close" size={17}/></button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:18 }}>
          <Inp C={C} label="Nome da página *" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Evento Março 2025, Captação Clube..." />
          <div>
            <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:10, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Template</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
              {TMPLS.map(t => <button key={t.id} onClick={()=>setTmpl(t.id)}
                style={{ background:tmpl===t.id?`${t.color}10`:C.muted, border:`1.5px solid ${tmpl===t.id?t.color:C.border}`, borderRadius:11, padding:"13px 15px", cursor:"pointer", textAlign:"left", fontFamily:"inherit", transition:"all 0.15s" }}>
                <div style={{ display:"flex", gap:9, alignItems:"flex-start", marginBottom:8 }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:`${t.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, color:t.color, flexShrink:0 }}>{t.icon}</div>
                  <div><div style={{ fontSize:12, fontWeight:700, color:tmpl===t.id?t.color:C.textMid }}>{t.name}</div><div style={{ fontSize:10, color:C.textSub }}>{t.desc}</div></div>
                </div>
                {tmpl===t.id && <div style={{ display:"flex", gap:4, alignItems:"center", color:t.color, fontSize:10, fontWeight:700 }}><Icon n="check" size={11} color={t.color}/>Selecionado</div>}
              </button>)}
            </div>
          </div>
          <button onClick={create} disabled={!name||!tmpl}
            style={{ background:name&&tmpl?C.accent:C.muted, color:name&&tmpl?"#fff":C.textSub, border:"none", borderRadius:9, padding:"13px", fontSize:13, fontWeight:700, cursor:name&&tmpl?"pointer":"not-allowed", fontFamily:"inherit" }}>
            {tmpl==="blank"?"Criar página em branco →":"Criar com template →"}
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPages = ({ proj, setProj, C }) => {
  const [editing, setEditing] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const pages = proj.pages || [];
  const slug = t => t.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");

  // Salvar no banco e no estado local
  const savePage = async (u: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: u.dbId || undefined,
          project_id: proj.id,
          title: u.title,
          slug: u.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,""),
          blocks: u.blocks,
          published: u.published,
        }),
      });
      if (res.ok) {
        const { page } = await res.json();
        const updated = { ...u, dbId: page.id };
        setProj((p: any) => ({ ...p, pages: (p.pages||[]).map((pg: any) => pg.id===u.id ? updated : pg) }));
        setSaving(false);
        return updated;
      }
    } catch (e) {
      console.error("Erro ao salvar página:", e);
    }
    // Fallback: salvar só no estado local
    setProj((p: any) => ({ ...p, pages: (p.pages||[]).map((pg: any) => pg.id===u.id?u:pg) }));
    setSaving(false);
    return u;
  };

  const addPage = async (pg: any) => {
    setProj((p: any) => ({ ...p, pages: [...(p.pages||[]), pg] }));
    // Salvar no banco imediatamente
    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: proj.id,
          title: pg.title,
          blocks: pg.blocks,
          published: pg.published,
        }),
      });
      if (res.ok) {
        const { page } = await res.json();
        setProj((p: any) => ({ ...p, pages: (p.pages||[]).map((x: any) => x.id===pg.id ? { ...x, dbId: page.id } : x) }));
      }
    } catch (e) { console.error("Erro ao criar página:", e); }
  };

  const delPage = async (id: string) => {
    // Encontrar dbId para deletar do banco
    const pg = pages.find((p: any) => p.id === id);
    setProj((p: any) => ({ ...p, pages: (p.pages||[]).filter((pg: any) => pg.id!==id) }));
    if (pg?.dbId) {
      try { await fetch(`/api/pages?id=${pg.dbId}`, { method: "DELETE" }); } catch {}
    }
  };

  if (editing) return <Builder page={editing} proj={proj} C={C} saving={saving}
    onSave={async (pg: any)=>{ const updated = await savePage(pg); setEditing(updated); }}
    onClose={()=>setEditing(null)}/>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontSize:11, color:proj.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4, fontWeight:700 }}>{proj.icon} {proj.name}</div>
          <h1 style={{ fontSize:27, fontWeight:900, color:C.text, margin:0, letterSpacing:"-0.03em" }}>Landing Pages</h1>
          <p style={{ color:C.textSub, fontSize:13, marginTop:3 }}>{pages.length} página{pages.length!==1?"s":""} · {pages.filter(p=>p.published).length} publicada{pages.filter(p=>p.published).length!==1?"s":""}</p>
        </div>
        <Btn C={C} icon="plus" onClick={()=>setShowPicker(true)}>Nova Landing Page</Btn>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:12 }}>
        {pages.map(pg => {
          const tmpl=TMPLS.find(t=>t.id===pg.template);
          const url=`${process.env.NEXT_PUBLIC_APP_URL || 'https://clubecrm.vercel.app'}/p/${proj.id}/${slug(pg.title)}`;
          return (
            <div key={pg.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:C.shadowCard, transition:"border-color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{ height:130, background:C.bg==="#f0f4f8"?"#e4eaf2":"#020609", overflow:"hidden", position:"relative", cursor:"pointer" }} onClick={()=>setEditing(pg)}>
                <div style={{ transform:"scale(0.37)", transformOrigin:"top left", width:"270%", pointerEvents:"none" }}>
                  {(pg.blocks||[]).slice(0,2).map(b=><BlockPrev key={b.id} b={b} mob={false}/>)}
                </div>
                <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, transparent 30%, ${C.surface} 100%)` }}/>
                <div style={{ position:"absolute", top:8, right:8 }}>
                  <StatusDot status={pg.published?"publicada":"rascunho"} C={C} />
                </div>
              </div>
              <div style={{ padding:"13px 15px", flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{pg.title}</div>
                <div style={{ fontSize:11, color:C.textSub, marginTop:2 }}>{tmpl?.name} · {(pg.blocks||[]).length} blocos · {pg.date}</div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginTop:8 }}>
                  {(pg.blocks||[]).map(b=>{const m=BTYPES.find(bt=>bt.type===b.type);return <span key={b.id} style={{ display:"flex", gap:3, alignItems:"center", padding:"2px 7px", background:C.muted, borderRadius:5, fontSize:10, color:C.textMid }}><Icon n={m?.icon||"layout"} size={8}/>{m?.label}</span>;})}
                </div>
                {pg.published && (
                  <div style={{ display:"flex", alignItems:"center", gap:5, background:C.accentSoft, borderRadius:6, padding:"5px 9px", marginTop:9, border:`1px solid ${C.accent}20` }}>
                    <Icon n="link" size={10} color={C.accent}/>
                    <span style={{ fontSize:9, color:C.accent, fontFamily:"monospace", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{url}</span>
                  </div>
                )}
              </div>
              <div style={{ padding:"9px 14px 12px", display:"flex", gap:7, borderTop:`1px solid ${C.border}` }}>
                <Btn C={C} v="ghost" small icon="edit" onClick={()=>setEditing(pg)} sx={{ flex:1, justifyContent:"center" }}>Editar</Btn>
                <button onClick={()=>delPage(pg.id)} style={{ display:"flex", alignItems:"center", justifyContent:"center", background:C.redSoft, border:`1px solid ${C.red}25`, borderRadius:7, padding:"6px 10px", color:C.red, cursor:"pointer" }}><Icon n="trash" size={11}/></button>
              </div>
            </div>
          );
        })}
        <button onClick={()=>setShowPicker(true)}
          style={{ background:"transparent", border:`1.5px dashed ${C.borderHover}`, borderRadius:14, minHeight:240, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:9, cursor:"pointer", color:C.textSub, fontFamily:"inherit" }}>
          <div style={{ width:38, height:38, borderRadius:10, border:`1.5px dashed ${C.borderHover}`, display:"flex", alignItems:"center", justifyContent:"center" }}><Icon n="plus" size={16}/></div>
          <div style={{ fontSize:13, fontWeight:600 }}>Nova página</div>
          <div style={{ fontSize:11 }}>Template ou em branco</div>
        </button>
      </div>
      {showPicker && <TemplatePicker proj={proj} C={C} onClose={()=>setShowPicker(false)} onCreate={pg=>{addPage(pg);setShowPicker(false);setEditing(pg);}}/>}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// NEW PROJECT MODAL
// ═══════════════════════════════════════════════════════════════════════════════


const TeamPage = ({ C, userEmail }) => {
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("membro");
  const [msg, setMsg] = useState<{ok:boolean,text:string}|null>(null);
  const [loading, setLoading] = useState(false);

  const invite = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setMsg({ok:false,text:"E-mail inválido."}); return; }
    setLoading(true);
    // Por ora, salva localmente — integração com convites reais via Supabase em breve
    setMembers(prev => [...prev, { id: Date.now(), email, role, status: "convidado" }]);
    setMsg({ok:true, text:`Convite enviado para ${email}`});
    setEmail(""); setLoading(false);
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ fontSize:27, fontWeight:900, color:C.text, margin:"0 0 4px", letterSpacing:"-0.03em" }}>Equipe</h1>
        <p style={{ color:C.textSub, fontSize:13, margin:0 }}>Gerencie os membros que têm acesso ao painel.</p>
      </div>

      {/* Convidar membro */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, boxShadow:C.shadowCard }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:14 }}>Convidar membro</div>
        <div style={{ display:"flex", gap:10 }}>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email@empresa.com"
            style={{ flex:1, background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"9px 12px", fontSize:13, outline:"none", fontFamily:"inherit" }} />
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"9px 12px", fontSize:13, fontFamily:"inherit", outline:"none" }}>
            <option value="admin">Admin</option>
            <option value="membro">Membro</option>
            <option value="visualizador">Visualizador</option>
          </select>
          <Btn C={C} onClick={invite} disabled={loading}>{loading ? "Enviando..." : "Convidar"}</Btn>
        </div>
        {msg && <div style={{ marginTop:10, padding:"9px 12px", background:msg.ok?C.greenSoft:C.redSoft, border:`1px solid ${msg.ok?C.green:C.red}30`, borderRadius:7, fontSize:13, color:msg.ok?C.green:C.red }}>{msg.text}</div>}
      </div>

      {/* Lista de membros */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:20, boxShadow:C.shadowCard }}>
        <div style={{ fontSize:12, fontWeight:700, color:C.textSub, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:14 }}>Membros ativos</div>
        {/* Dono da conta sempre aparece */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ width:34, height:34, borderRadius:10, background:`linear-gradient(135deg,#1d6aff,#5b21b6)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:"#fff" }}>{(userEmail?.[0]||"U").toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{userEmail}</div>
            <div style={{ fontSize:11, color:C.textSub }}>Proprietário · Você</div>
          </div>
          <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:C.accentSoft, color:C.accent, fontWeight:700 }}>Owner</span>
        </div>
        {members.map(m => (
          <div key={m.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:34, height:34, borderRadius:10, background:C.muted, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:C.textMid }}>{m.email[0].toUpperCase()}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{m.email}</div>
              <div style={{ fontSize:11, color:C.textSub }}>{m.role} · {m.status}</div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20, background:C.amberSoft, color:C.amber, fontWeight:700 }}>{m.status}</span>
              <button onClick={()=>setMembers(p=>p.filter(x=>x.id!==m.id))} style={{ background:"transparent", border:"none", color:C.red, cursor:"pointer", fontSize:16, padding:"2px 6px" }}>×</button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div style={{ padding:"20px 0", textAlign:"center", color:C.textSub, fontSize:13 }}>Nenhum membro convidado ainda.</div>
        )}
      </div>
    </div>
  );
};

const EditProject = ({ proj, onClose, onSave, onDelete, C }) => {
  const [name, setName] = useState(proj.name);
  const [desc, setDesc]   = useState(proj.desc || "");
  const [color, setColor] = useState(proj.color || "#1d6aff");
  const [icon, setIcon]   = useState(proj.icon || "◈");
  const [funnel, setFunnel] = useState(proj.funnel.join(", "));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const COLS  = ["#1d6aff","#7c5cfc","#0fb981","#f0a500","#e84040","#0ecbca","#e07020"];
  const ICONS = ["◈","◆","◉","✦","◐","●","▲"];
  return (
    <Modal title="Editar Projeto" onClose={onClose} C={C}>
      <div style={{ display:"flex", flexDirection:"column" }}>
        <Inp C={C} label="Nome *" value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do projeto" />
        <Txa C={C} label="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Objetivo do projeto..." style={{ minHeight:60 }} />
        <Inp C={C} label="Etapas do funil (separadas por vírgula)" value={funnel} onChange={e=>setFunnel(e.target.value)} placeholder="novo, contato, qualificado, proposta, fechado" />
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Cor</label>
          <div style={{ display:"flex", gap:7 }}>{COLS.map(c=><button key={c} onClick={()=>setColor(c)} style={{ width:28,height:28,borderRadius:7,background:c,border:c===color?"3px solid "+C.text:"3px solid transparent",cursor:"pointer" }}/>)}</div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Ícone</label>
          <div style={{ display:"flex", gap:7 }}>{ICONS.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{ width:36,height:36,borderRadius:7,background:ic===icon?`${color}20`:C.muted,border:`1.5px solid ${ic===icon?color:C.border}`,color:ic===icon?color:C.textMid,fontSize:18,cursor:"pointer" }}>{ic}</button>)}</div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <Btn C={C} sx={{ flex:1, justifyContent:"center" }} onClick={()=>{
            if(!name) return;
            const newFunnel = funnel.split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);
            onSave({ ...proj, name, desc, color, icon, funnel: newFunnel.length ? newFunnel : proj.funnel });
            onClose();
          }}>Salvar alterações</Btn>
        </div>
        {!confirmDelete
          ? <button onClick={()=>setConfirmDelete(true)} style={{ background:"transparent", border:`1px solid ${C.red}40`, color:C.red, borderRadius:8, padding:"9px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Excluir projeto...</button>
          : <div style={{ background:C.redSoft, border:`1px solid ${C.red}30`, borderRadius:8, padding:12 }}>
              <p style={{ fontSize:13, color:C.red, margin:"0 0 10px" }}>Tem certeza? Esta ação não pode ser desfeita. Todos os leads deste projeto serão excluídos.</p>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>setConfirmDelete(false)} style={{ flex:1, background:C.muted, border:`1px solid ${C.border}`, color:C.textMid, borderRadius:7, padding:"8px", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Cancelar</button>
                <button onClick={()=>{ onDelete(proj.id); onClose(); }} style={{ flex:1, background:C.red, border:"none", color:"#fff", borderRadius:7, padding:"8px", fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Confirmar exclusão</button>
              </div>
            </div>
        }
      </div>
    </Modal>
  );
};

const NewProject = ({ onClose, onCreate, C }) => {
  const [name, setName] = useState(""); const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#1d6aff"); const [icon, setIcon] = useState("◈");
  const COLS = ["#1d6aff","#7c5cfc","#0fb981","#f0a500","#e84040","#0ecbca","#e07020"];
  const ICONS = ["◈","◆","◉","✦","◐","●","▲"];
  return (
    <Modal title="Novo Projeto" onClose={onClose} C={C}>
      <div style={{ display:"flex", flexDirection:"column" }}>
        <Inp C={C} label="Nome *" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Imersão de Liderança" />
        <Txa C={C} label="Descrição" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Objetivo do projeto..." style={{ minHeight:60 }} />
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Cor</label>
          <div style={{ display:"flex", gap:7 }}>{COLS.map(c=><button key={c} onClick={()=>setColor(c)} style={{ width:28,height:28,borderRadius:7,background:c,border:c===color?"3px solid "+C.text:"3px solid transparent",cursor:"pointer" }}/>)}</div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:11, color:C.textSub, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.07em", fontWeight:600 }}>Ícone</label>
          <div style={{ display:"flex", gap:7 }}>{ICONS.map(ic=><button key={ic} onClick={()=>setIcon(ic)} style={{ width:36,height:36,borderRadius:7,background:ic===icon?`${color}20`:C.muted,border:`1.5px solid ${ic===icon?color:C.border}`,color:ic===icon?color:C.textMid,fontSize:18,cursor:"pointer" }}>{ic}</button>)}</div>
        </div>
        <div style={{ background:C.muted, border:`1px solid ${C.border}`, borderRadius:10, padding:14, display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:36,height:36,borderRadius:10,background:`${color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color, border:`1px solid ${color}30` }}>{icon}</div>
          <div><div style={{ fontSize:14,fontWeight:800,color:C.text }}>{name||"Nome do projeto"}</div><div style={{ fontSize:11,color:C.textSub }}>0 leads · funil padrão</div></div>
        </div>
        <Btn C={C} onClick={()=>{ if(!name)return; onCreate({id:name.toLowerCase().replace(/\s+/g,"-")+"-"+Date.now(),name,color,icon,desc:desc||`Projeto ${name}`,leads:[],funnel:["novo","contato","qualificado","proposta","fechado"],forms:[],newsletters:[],pages:[]}); onClose(); }} sx={{ width:"100%", justifyContent:"center" }}>Criar Projeto</Btn>
      </div>
    </Modal>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════════════════════


// Carregar leads de um projeto do Supabase
async function loadLeads(projectId: string, allProjects: any[], setProjects: any) {
  try {
    const res = await fetch(`/api/leads?project_id=${projectId}`);
    if (res.ok) {
      const { leads } = await res.json();
      if (leads && leads.length > 0) {
        const mapped = leads.map((l: any) => ({
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone || "",
          company: l.company || "",
          tags: l.tags || [],
          score: l.score || 40,
          stage: l.stage || "novo",
          source: l.source || "Manual",
          date: l.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          nl: l.newsletter_subscribed || false,
        }));
        setProjects((prev: any[]) => prev.map(p => 
          p.id === projectId ? { ...p, leads: mapped } : p
        ));
      }
    }
  } catch (e) {
    console.log("Erro ao carregar leads:", e);
  }
}

interface CRMAppProps {
  userEmail: string;
  userName: string;
  userId: string;
}

export default function CRMApp({ userEmail, userName, userId }: CRMAppProps) {
  const [theme, setTheme] = useState("light");
  const C = THEMES[theme];

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);

  // ── Carregar TODOS os dados do Supabase ao logar ──────────────────────────
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Falha ao carregar projetos");
        const { projects: dbProjects } = await res.json();

        if (!dbProjects || dbProjects.length === 0) {
          setProjects([]);
          setLoading(false);
          setSynced(true);
          return;
        }

        // Mapear projetos com leads e forms já incluídos
        const mapped = await Promise.all(dbProjects.map(async (p: any) => {
          // Carregar leads
          let leads: any[] = [];
          try {
            const lr = await fetch(`/api/leads?project_id=${p.id}`);
            if (lr.ok) {
              const { leads: dbLeads } = await lr.json();
              leads = (dbLeads || []).map((l: any) => ({
                id: l.id, dbId: l.id,
                name: l.name, email: l.email,
                phone: l.phone || "", company: l.company || "",
                tags: l.tags || [], score: l.score || 40,
                stage: l.stage || "novo", source: l.source || "Manual",
                date: l.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
                nl: l.newsletter_subscribed || false, notes: l.notes || "",
              }));
            }
          } catch {}

          // Carregar formulários
          let forms: any[] = [];
          try {
            const fr = await fetch(`/api/forms?project_id=${p.id}`);
            if (fr.ok) {
              const { forms: dbForms } = await fr.json();
              forms = (dbForms || []).map((f: any) => ({
                id: f.id, dbId: f.id,
                name: f.name, fields: f.fields || [],
                tag: f.tag || "", subs: f.submissions || 0,
              }));
            }
          } catch {}

          // Carregar landing pages
          let pages: any[] = [];
          try {
            const pgr = await fetch(`/api/pages?project_id=${p.id}`);
            if (pgr.ok) {
              const { pages: dbPages } = await pgr.json();
              pages = (dbPages || []).map((pg: any) => ({
                id: pg.id, dbId: pg.id,
                title: pg.title, slug: pg.slug,
                blocks: pg.blocks || [], published: pg.published || false,
                date: pg.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
              }));
            }
          } catch {}

          return {
            id: p.id, dbId: p.id,
            name: p.name,
            color: p.color || "#1d6aff",
            icon: p.icon || "◈",
            desc: p.description || "",
            funnel: p.funnel_stages || ["novo","contato","qualificado","proposta","fechado"],
            scoringRules: p.scoring_rules || undefined,
            leads, forms, pages, newsletters: [],
          };
        }));

        setProjects(mapped);
        setActiveId(mapped[0].id);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
        setProjects([]);
      } finally {
        setLoading(false);
        setSynced(true);
      }
    };
    loadAll();
  }, [userId]);

  // ── Persistir projeto (criar ou atualizar) ────────────────────────────────
  const saveProject = async (proj: any) => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: proj.dbId || proj.id || undefined,
          name: proj.name,
          description: proj.desc,
          color: proj.color,
          icon: proj.icon,
          funnel_stages: proj.funnel,
        }),
      });
      if (res.ok) {
        const { project } = await res.json();
        return project.id;
      }
    } catch (e) { console.error("Erro ao salvar projeto:", e); }
    return null;
  };

  // ── Persistir lead (criar ou atualizar) ───────────────────────────────────
  const saveLead = async (lead: any, projectId: string) => {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: lead.dbId || undefined,
          project_id: projectId,
          name: lead.name, email: lead.email,
          phone: lead.phone || null, company: lead.company || null,
          tags: lead.tags || [], score: lead.score || 40,
          stage: lead.stage || "novo", source: lead.source || "Manual",
          newsletter_subscribed: lead.nl || false, notes: lead.notes || null,
        }),
      });
      if (res.ok) {
        const { lead: saved } = await res.json();
        return saved.id;
      }
    } catch (e) { console.error("Erro ao salvar lead:", e); }
    return null;
  };

  // ── Persistir formulário ──────────────────────────────────────────────────
  const saveForm = async (form: any, projectId: string) => {
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.dbId || undefined,
          project_id: projectId,
          name: form.name, fields: form.fields || [], tag: form.tag || "",
        }),
      });
      if (res.ok) {
        const { form: saved } = await res.json();
        return saved.id;
      }
    } catch (e) { console.error("Erro ao salvar formulário:", e); }
    return null;
  };
  const [activeId, setActiveId] = useState("clube");
  const [page, setPage] = useState("crm");
  const [collapsed, setCollapsed] = useState(false);
  const [showNewProj, setShowNewProj] = useState(false);
  const [showEditProj, setShowEditProj] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const active = projects.find(p => p.id===activeId) || projects[0] || null;
  const setActive = fn => setProjects(prev => prev.map(p => p.id===activeId ? (typeof fn==="function"?fn(p):fn) : p));

  // Aguardar dados carregarem antes de renderizar a sidebar
  if (!active && !loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#f0f4f8", fontFamily:"sans-serif" }}>
      <div style={{ textAlign:"center", maxWidth:400 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>◈</div>
        <h2 style={{ fontSize:22, fontWeight:900, color:"#0d1b2e", marginBottom:8 }}>Bem-vindo ao ClubeCRM!</h2>
        <p style={{ fontSize:14, color:"#6b7f99", marginBottom:24 }}>Crie seu primeiro projeto para começar.</p>
        <button onClick={()=>setShowNewProj(true)}
          style={{ background:"#1d6aff", color:"#fff", border:"none", borderRadius:10, padding:"12px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
          + Criar primeiro projeto
        </button>
        {showNewProj && <NewProject C={C} onClose={()=>setShowNewProj(false)} onCreate={async p=>{
          setProjects([p]);
          setActiveId(p.id);
          const dbId = await saveProject(p);
          if(dbId) setProjects(prev=>prev.map(x=>x.id===p.id?{...x,dbId,id:dbId}:x));
          setShowNewProj(false);
        }}/>}
      </div>
    </div>
  );

  if (!active) return null;

  const NAV_ACCOUNT = [
    { id:"team", label:"Equipe", icon:"user" },
  ];
  const NAV_PROJ = [
    { id:"crm", label:"Funil de Vendas", icon:"crm" },
    { id:"leads", label:"Leads & Captura", icon:"leads" },
    { id:"email", label:"E-mail", icon:"mail" },
    { id:"scoring", label:"Lead Scoring", icon:"score" },
    { id:"pages", label:"Landing Pages", icon:"page" },
  ];

  const renderPage = () => {
    if (page==="team") return <TeamPage C={C} userEmail={userEmail}/>;
    if (page==="crm") return <CRM proj={active} setProj={setActive} C={C}/>;
    if (page==="leads") return <LeadsPage proj={active} setProj={setActive} C={C}/>;
    if (page==="email") return <EmailPage proj={active} setProj={setActive} C={C}/>;
    if (page==="scoring") return <ScoringPage proj={active} setProj={setActive} C={C}/>;
    if (page==="pages") return <LandingPages proj={active} setProj={setActive} C={C}/>;
  };

  const sidebarBg = theme==="light" ? "#ffffff" : "#070e19";

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif", overflow:"hidden", color:C.text, minHeight:0 }}>

      {/* SIDEBAR */}
      <aside style={{ width:collapsed?52:224, background:sidebarBg, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width 0.22s ease", flexShrink:0, zIndex:10, overflow:"hidden", minHeight:0, boxShadow:theme==="light"?"1px 0 0 "+C.border:"none" }}>
        {/* Logo + theme toggle */}
        <div style={{ padding:collapsed?"14px 0":"14px 14px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:9, justifyContent:collapsed?"center":"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9 }}>
            <div style={{ width:30,height:30,background:`linear-gradient(135deg,${C.accent},#5b21b6)`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#fff",flexShrink:0 }}>C</div>
            {!collapsed && <span style={{ fontSize:14,fontWeight:900,color:C.text,letterSpacing:"-0.02em" }}>ClubeCRM</span>}
          </div>
          {!collapsed && <ThemeToggle theme={theme} setTheme={setTheme} C={C} />}
        </div>

        {/* Project selector */}
        {!collapsed && (
          <div style={{ padding:"10px 9px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
            <div style={{ fontSize:9,color:C.textSub,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:7,paddingLeft:3,fontWeight:700 }}>Projeto ativo</div>
            <ProjectSelector projects={projects} activeId={activeId} C={C}
              onChange={id => { setActiveId(id); if(page==="team") setPage("crm"); }}
              onNew={() => setShowNewProj(true)} />
            <button onClick={()=>setShowEditProj(true)} style={{ width:"100%", marginTop:5, background:"transparent", border:`1px solid ${C.border}`, borderRadius:8, color:C.textSub, padding:"6px 10px", fontSize:11, cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>⚙ Editar projeto</button>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:"8px 6px", display:"flex", flexDirection:"column", gap:1, overflowY:"auto", minHeight:0 }}>
          {!collapsed && <div style={{ fontSize:9,color:C.textSub,letterSpacing:"0.1em",textTransform:"uppercase",padding:"6px 6px 3px",fontWeight:700 }}>Geral</div>}
          {NAV_ACCOUNT.map(item => {
            const isActive=page===item.id;
            return <button key={item.id} onClick={()=>setPage(item.id)} title={collapsed?item.label:undefined}
              style={{ display:"flex",alignItems:"center",gap:9,padding:collapsed?"8px 0":"8px 10px",borderRadius:8,border:"none",background:isActive?C.accentSoft:"transparent",color:isActive?C.accent:C.textSub,cursor:"pointer",width:"100%",justifyContent:collapsed?"center":"flex-start",position:"relative",fontFamily:"inherit" }}>
              <Icon n={item.icon} size={15}/>
              {!collapsed && <span style={{ fontSize:13,fontWeight:isActive?700:500 }}>{item.label}</span>}
              {isActive&&!collapsed && <div style={{ position:"absolute",left:0,top:"18%",bottom:"18%",width:3,borderRadius:99,background:C.accent }}/>}
            </button>;
          })}
          {!collapsed && <div style={{ fontSize:9,color:C.textSub,letterSpacing:"0.1em",textTransform:"uppercase",padding:"10px 6px 3px",fontWeight:700 }}>Projeto</div>}
          {NAV_PROJ.map(item => {
            const isActive=page===item.id;
            return <button key={item.id} onClick={()=>setPage(item.id)} title={collapsed?item.label:undefined}
              style={{ display:"flex",alignItems:"center",gap:9,padding:collapsed?"8px 0":"8px 10px",borderRadius:8,border:"none",background:isActive?`${active.color}14`:"transparent",color:isActive?active.color:C.textSub,cursor:"pointer",width:"100%",justifyContent:collapsed?"center":"flex-start",position:"relative",fontFamily:"inherit" }}>
              <Icon n={item.icon} size={15}/>
              {!collapsed && <span style={{ fontSize:13,fontWeight:isActive?700:500 }}>{item.label}</span>}
              {isActive&&!collapsed && <div style={{ position:"absolute",left:0,top:"18%",bottom:"18%",width:3,borderRadius:99,background:active.color }}/>}
            </button>;
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:"8px 6px", borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column", gap:3, flexShrink:0 }}>
          {collapsed && <button onClick={()=>setTheme(t=>t==="light"?"dark":"light")} title="Alternar tema" style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"7px 0",borderRadius:7,border:"none",background:"transparent",color:C.textSub,cursor:"pointer",width:"100%" }}><Icon n={theme==="light"?"moon":"sun"} size={15}/></button>}
          <button onClick={()=>setCollapsed(c=>!c)}
            style={{ display:"flex",alignItems:"center",gap:9,padding:collapsed?"7px 0":"7px 10px",borderRadius:7,border:"none",background:"transparent",color:C.textSub,cursor:"pointer",justifyContent:collapsed?"center":"flex-start",width:"100%",fontSize:12,fontFamily:"inherit" }}>
            <Icon n="menu" size={14}/>{!collapsed && "Recolher"}
          </button>
          <div style={{ display:"flex",gap:9,alignItems:"center",padding:collapsed?"7px 0":"7px 10px",justifyContent:collapsed?"center":"flex-start" }}>
            <div style={{ width:26,height:26,borderRadius:8,background:`linear-gradient(135deg,${C.accent},#5b21b6)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff",flexShrink:0 }}>V</div>
            {!collapsed && <div><div style={{ fontSize:12,fontWeight:700,color:C.textMid }}>{userName || userEmail?.split("@")[0] || "Você"}</div><div style={{ fontSize:10,color:C.textSub }}>Admin · <a href="/api/auth/signout" onClick={async(e)=>{e.preventDefault();await fetch("/api/auth/signout",{method:"POST"});window.location.href="/auth/login";}} style={{color:C.accent,textDecoration:"none",fontSize:10}}>Sair</a></div></div>}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"26px 30px", opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(8px)", transition:"opacity 0.35s, transform 0.35s", minHeight:0, minWidth:0 }}>
        <div style={{ maxWidth:1080, margin:"0 auto", paddingBottom:48 }}>
          {renderPage()}
        </div>
      </main>

      {showNewProj && <NewProject C={C} onClose={()=>setShowNewProj(false)} onCreate={async p=>{
        setProjects(prev=>[...prev,p]);
        setActiveId(p.id);
        setPage("crm");
        const dbId = await saveProject(p);
        if(dbId) setProjects(prev=>prev.map(x=>x.id===p.id?{...x,dbId,id:dbId}:x));
      }}/>}
      {showEditProj && active && <EditProject proj={active} C={C} onClose={()=>setShowEditProj(false)}
        onSave={async updated=>{
          setProjects(prev=>prev.map(p=>p.id===updated.id?updated:p));
          setShowEditProj(false);
          await saveProject({...updated, dbId: updated.dbId||updated.id});
        }}
        onDelete={async id=>{
          const proj = projects.find(p=>p.id===id);
          const remaining=projects.filter(p=>p.id!==id);
          setProjects(remaining);
          if(remaining.length) setActiveId(remaining[0].id);
          setShowEditProj(false);
          if(proj?.dbId||proj?.id) {
            try { await fetch(`/api/projects?id=${proj.dbId||proj.id}`,{method:"DELETE"}); } catch {}
          }
        }}
      />}
    </div>
  );
}
