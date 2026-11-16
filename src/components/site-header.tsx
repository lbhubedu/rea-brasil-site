"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/", label: "Explorar" },
  { href: "/prompts", label: "Prompts" },
  { href: "/novidades", label: "Novidades" },
  { href: "/duvidas", label: "Dúvidas" },
  { href: "/guides", label: "Aprenda" },
  { href: "/tools", label: "Ferramentas" },
  { href: "/about", label: "Sobre" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b-2 border-ink bg-paper">
      <div className="container-poster flex h-full items-center justify-between gap-5">
        <Link href="/" className="display flex shrink-0 items-center text-[19px] uppercase tracking-[-0.04em]" aria-label="Rea Brasil LB — página inicial">
          <span className="bg-ink px-2.5 py-1 text-white">REA</span><span className="border-2 border-l-0 border-ink px-2.5 py-1">BRASIL LB</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navegação principal">
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} className={`mono border-b-2 py-1 transition-colors hover:text-cobalt ${active ? "border-cobalt text-cobalt" : "border-transparent"}`} aria-current={active ? "page" : undefined}>{link.label}</Link>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/gerador" onClick={closeMenu} className="mono hidden h-10 items-center gap-2 border border-ink px-4 hover-fill sm:inline-flex">Criar meu prompt <ArrowUpRight size={15} aria-hidden="true" /></Link>
          <button type="button" className="grid size-10 place-items-center border border-ink lg:hidden" aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && <nav id="menu-mobile" className="absolute inset-x-0 top-16 border-b-2 border-ink bg-paper lg:hidden" aria-label="Navegação móvel">
        {links.map((link, index) => <Link key={link.href} href={link.href} onClick={closeMenu} className="flex items-center justify-between border-b border-ink/20 px-5 py-4 mono hover:bg-cobalt-dim"><span>{link.label}</span><span>0{index + 1}</span></Link>)}
        <Link href="/gerador" onClick={closeMenu} className="flex items-center justify-between bg-cobalt px-5 py-4 text-white mono">Criar meu prompt <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </nav>}
    </header>
  );
}
