import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Rea Brasil LB — Engenharia reversa explicada", template: "%s · Rea Brasil LB" },
  description: "Projetos, guias e prompts de engenharia reversa com IA em português do Brasil. Aprenda, investigue com evidências e crie seu prompt personalizado sem chave de API.",
  keywords: ["REA", "engenharia reversa", "prompts", "Brasil", "inteligência artificial", "Reverse Engineer Anything"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="pt-BR">
    <body className="bg-paper text-ink antialiased">
      <a href="#conteudo" className="skip-link mono">Pular para o conteúdo</a>
      <SiteHeader />
      <div className="pt-16" id="conteudo">{children}</div>
      <SiteFooter />
    </body>
  </html>;
}
