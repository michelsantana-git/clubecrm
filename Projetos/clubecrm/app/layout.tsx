import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClubeCRM — CRM para Clubes e Comunidades",
  description: "Gerencie leads, funil de vendas, newsletters e landing pages em um só lugar.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  openGraph: {
    title: "ClubeCRM",
    description: "CRM completo para captação e gestão de leads",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;1,9..40,400&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
