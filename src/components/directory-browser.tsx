"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { builds, categories, type Build } from "@/data/catalog";
import { BuildCard } from "./build-card";

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function DirectoryBrowser({ items = builds, initialCategory, showCategories = true, title = "Todos os projetos" }: { items?: Build[]; initialCategory?: string; showCategories?: boolean; title?: string }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("todos");
  const [sort, setSort] = useState("recentes");
  const [visible, setVisible] = useState(8);
  const [votes, setVotes] = useState<Record<string, number>>({});
  useEffect(() => { fetch("/api/votes").then((r) => r.json()).then((data: { votes?: Record<string, number> }) => setVotes(data.votes ?? {})).catch(() => undefined); }, []);
  // Reinicia a paginação quando um filtro muda, ajustando o estado durante o
  // render (padrão recomendado em vez de setState síncrono em effect).
  const [resetKey, setResetKey] = useState(`${query}|${source}|${sort}|${initialCategory}`);
  if (resetKey !== `${query}|${source}|${sort}|${initialCategory}`) {
    setResetKey(`${query}|${source}|${sort}|${initialCategory}`);
    setVisible(8);
  }
  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    const result = items.filter((build) => {
      const matchesText = !term || normalize(`${build.title} ${build.summary} ${build.author} ${build.facts?.join(" ") ?? ""}`).includes(term);
      return matchesText && (source === "todos" || build.sourceType === source);
    });
    if (sort === "titulo") return [...result].sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    if (sort === "votados") return [...result].sort((a, b) => (votes[b.slug] ?? 0) - (votes[a.slug] ?? 0));
    return result;
  }, [items, query, source, sort, votes]);
  const sources = [...new Set(items.map((item) => item.sourceType))];

  return <section id="projetos" aria-labelledby="directory-title" className="container-poster border-x-2 border-b-2 border-ink">
    <div className="grid lg:grid-cols-12">
      {showCategories && <aside className="border-b-2 border-ink lg:col-span-3 lg:border-b-0 lg:border-r-2">
        <div className="sticky top-16 max-h-[calc(100vh-64px)] overflow-y-auto p-5 no-scrollbar">
          <div className="flex items-center justify-between"><h2 className="display-medium text-2xl">Casos de uso</h2><span className="mono text-cobalt">15</span></div>
          <p className="mt-3 text-xs leading-relaxed text-ink/60">Escolha o tipo de coisa que você quer entender.</p>
          <nav className="mt-5" aria-label="Filtrar por caso de uso"><ul className="space-y-0">
            <li><Link href="/" className={`flex justify-between border-t border-ink/15 py-2.5 text-sm hover:translate-x-1 hover:text-cobalt ${!initialCategory ? "font-semibold text-cobalt" : ""}`}><span>Todos</span><span className="mono text-[10px]">75</span></Link></li>
            {categories.map((category) => <li key={category.slug}><Link href={`/categories/${category.slug}`} className={`flex justify-between gap-3 border-t border-ink/15 py-2.5 text-[13px] leading-snug transition-transform hover:translate-x-1 hover:text-cobalt ${initialCategory === category.slug ? "font-semibold text-cobalt" : ""}`} aria-current={initialCategory === category.slug ? "page" : undefined}><span>{category.shortName}</span><span className="mono shrink-0 text-[10px]">{category.count}</span></Link></li>)}
          </ul></nav>
        </div>
      </aside>}
      <div className={showCategories ? "lg:col-span-9" : "lg:col-span-12"}>
        <div className="border-b-2 border-ink p-5 md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><p className="mono text-cobalt">DIRETÓRIO • FONTES VERIFICÁVEIS</p><h2 id="directory-title" className="display-medium mt-2 text-4xl">{title}</h2></div>
            <p className="mono text-[10px] text-ink/55">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-12">
            <div className="relative md:col-span-6"><label htmlFor="search-builds" className="sr-only">Buscar projetos</label><Search className="absolute left-3 top-3.5 text-ink/50" size={18} aria-hidden="true" /><input id="search-builds" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por app, recurso, autor…" className="poster-input pl-10" /></div>
            <div className="md:col-span-3"><label htmlFor="source-filter" className="sr-only">Tipo de fonte</label><select id="source-filter" value={source} onChange={(event) => setSource(event.target.value)} className="poster-input h-full"><option value="todos">Todas as fontes</option>{sources.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
            <div className="md:col-span-3"><label htmlFor="sort-builds" className="sr-only">Ordenar projetos</label><select id="sort-builds" value={sort} onChange={(event) => setSort(event.target.value)} className="poster-input h-full"><option value="recentes">Mais recentes</option><option value="votados">Mais votados</option><option value="titulo">Ordem alfabética</option></select></div>
          </div>
        </div>
        {filtered.length ? <div className="grid md:grid-cols-2">{filtered.slice(0, visible).map((build, index) => <div key={build.slug} className="border-b border-ink p-4 md:p-5 [&:nth-child(odd)]:md:border-r"><BuildCard build={build} votes={votes[build.slug] ?? 0} priority={index < 2} /></div>)}</div> : <div className="p-10 text-center md:p-20"><p className="display-medium text-3xl">Nada encontrado por aqui.</p><p className="mt-3 text-sm text-ink/60">Tente uma palavra mais curta ou remova os filtros.</p><button className="poster-button mt-6" type="button" onClick={() => { setQuery(""); setSource("todos"); }}><X size={16} aria-hidden="true" /> Limpar filtros</button></div>}
        {visible < filtered.length && <div className="border-t border-ink p-6 text-center"><button type="button" onClick={() => setVisible((value) => value + 8)} className="poster-button bg-white hover-fill">Mostrar mais 8 <span className="text-cobalt">({filtered.length - visible} restantes)</span></button></div>}
      </div>
    </div>
  </section>;
}
