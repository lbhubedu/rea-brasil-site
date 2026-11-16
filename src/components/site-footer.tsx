import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  return <footer className="border-t-2 border-ink bg-paper">
    <section className="container-poster grid border-x-2 border-ink lg:grid-cols-12">
      <div className="border-b-2 border-ink p-6 py-10 lg:col-span-5 lg:border-b-0 lg:border-r-2 lg:p-10">
        <p className="mono text-cobalt">REA BRASIL LB • AVISOS FUTUROS</p>
        <h2 className="display-medium mt-5 max-w-lg text-4xl">Deixe seu e-mail para avisos futuros.</h2>
        <p className="mt-4 max-w-md text-sm text-ink/65">Ainda não enviamos e-mails automáticos: sua inscrição fica guardada apenas para quando os avisos começarem. O que já é atualizado hoje está na página de <a href="/novidades" className="text-cobalt underline">novidades</a>.</p>
      </div>
      <div className="flex items-center p-6 lg:col-span-7 lg:p-10"><NewsletterForm /></div>
    </section>
    <div className="container-poster grid border-2 border-t-0 border-ink md:grid-cols-2 lg:grid-cols-4">
      <div className="border-b border-ink/20 p-6 md:col-span-2 lg:col-span-1 lg:border-b-0 lg:border-r">
        <Link href="/" className="display text-2xl uppercase">Rea Brasil LB</Link>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/65">Diretório independente em português sobre investigação e reconstrução de software com agentes de IA.</p>
        <p className="mono mt-6 text-[10px] text-ink/50">VERSÃO BR • EDUCAÇÃO E PESQUISA</p>
      </div>
      <FooterColumn title="Explorar" links={[["Todos os projetos", "/"], ["Mais recentes", "/newest"], ["Mais votados", "/most-voted"], ["Novidades", "/novidades"], ["Enviar projeto", "/submit"]]} />
      <FooterColumn title="Aprender" links={[["Biblioteca de prompts", "/prompts"], ["Gerador personalizado", "/gerador"], ["Guias para iniciantes", "/guides"], ["Comparar ferramentas", "/tools"], ["Dúvidas com IA", "/duvidas"], ["Sobre a comunidade", "/about"], ["Apoio e transparência", "/support"], ["Política de patrocínio", "/sponsor"]]} />
      <div className="p-6 lg:border-l">
        <p className="mono mb-4">Fontes oficiais</p>
        <External href="https://rea.tools">rea.tools</External>
        <External href="https://github.com/morluto/rea">REA no GitHub</External>
        <External href="https://github.com/lbhubedu/REA-Prompts">REA-Prompts LB</External>
        <External href="https://madewithrea.com">Made with REA</External>
      </div>
    </div>
    <div className="container-poster flex flex-col gap-3 border-x-2 border-b-2 border-ink px-6 py-5 text-xs text-ink/60 md:flex-row md:items-center md:justify-between">
      <p>Conteúdo educacional. Analise somente o que você possui ou tem autorização para examinar.</p>
      <p className="mono text-[10px]">REA É OPEN SOURCE • LICENÇA MIT</p>
    </div>
  </footer>;
}

function FooterColumn({ title, links }: { title: string; links: string[][] }) {
  return <div className="border-b border-ink/20 p-6 md:border-b-0 lg:border-l"><p className="mono mb-4">{title}</p><ul className="space-y-2.5 text-sm">{links.map(([label, href]) => <li key={href}><Link className="transition-colors hover:text-cobalt hover:underline" href={href}>{label}</Link></li>)}</ul></div>;
}

function External({ href, children }: { href: string; children: string }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="mb-2.5 flex items-center justify-between gap-2 text-sm transition-colors hover:text-cobalt">{children}<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>;
}
