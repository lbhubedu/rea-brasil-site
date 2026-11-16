"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { promptSections, reaPrompts } from "@/data/prompts";
import { PromptCard } from "./prompt-card";

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function PromptLibrary() {
  const [section, setSection] = useState("todos");
  const [level, setLevel] = useState("todos");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(10);
  const filtered = useMemo(() => reaPrompts.filter((prompt) => {
    const term = normalize(query);
    return (section === "todos" || prompt.section === section) && (level === "todos" || prompt.level === level) && (!term || normalize(`${prompt.title} ${prompt.summary} ${prompt.template}`).includes(term));
  }), [section, level, query]);
  const currentSection = promptSections.find((item) => item.id === section);
  function changeSection(value: string) { setSection(value); setVisible(10); }
  return <div>
    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12">
        <div className="p-6 py-10 md:p-10 lg:col-span-8 lg:border-r-2 lg:border-ink"><p className="mono text-cobalt">BIBLIOTECA REAP • CONTEÚDO COMPLETO</p><h1 className="display mt-6 text-[clamp(3.8rem,8vw,8rem)]">Prompts que<br /><span className="text-cobalt">explicam o porquê.</span></h1><p className="mt-7 max-w-2xl text-base leading-relaxed text-ink/65">Escolha uma situação, preencha os espaços destacados e copie. Cada modelo pede uma investigação pequena, evidências e uma entrega que você pode verificar.</p></div>
        <div className="flex flex-col justify-between bg-ink p-7 text-white lg:col-span-4"><p className="mono text-[#8CA8FF]">ANTES DE TUDO</p><div className="mt-12"><h2 className="display-medium text-3xl">Instale uma vez.</h2><code className="mt-5 block overflow-x-auto border border-white/30 p-3 font-mono text-xs">npx rea-agents@latest setup</code><p className="mt-4 text-xs leading-relaxed text-white/55">Gratuito e open source. Depois escolha Claude Code, Codex, Cursor ou outro agente compatível.</p></div></div>
      </div>
      <div className="grid border-t-2 border-ink sm:grid-cols-3"><div className="border-b border-ink p-5 sm:border-b-0 sm:border-r"><span className="display text-4xl">55</span><span className="mono ml-3 text-ink/50">prompts abertos</span></div><div className="border-b border-ink p-5 sm:border-b-0 sm:border-r"><span className="display text-4xl">17</span><span className="mono ml-3 text-ink/50">trilhas temáticas</span></div><div className="p-5"><span className="display text-4xl">0</span><span className="mono ml-3 text-ink/50">prompts bloqueados</span></div></div>
    </section>

    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12">
        <aside className="border-b-2 border-ink lg:col-span-3 lg:border-b-0 lg:border-r-2"><div className="sticky top-16 max-h-[calc(100vh-64px)] overflow-y-auto p-5 no-scrollbar"><h2 className="display-medium text-2xl">Trilhas</h2><p className="mt-2 text-xs text-ink/55">Do primeiro comando a temas avançados.</p><nav className="mt-5" aria-label="Trilhas de prompts"><button type="button" onClick={() => changeSection("todos")} className={`flex w-full justify-between border-t border-ink/15 py-2.5 text-left text-sm ${section === "todos" ? "text-cobalt font-semibold" : ""}`}>Todos os prompts <span className="mono text-[9px]">55</span></button>{promptSections.map((item) => <button type="button" key={item.id} onClick={() => changeSection(item.id)} className={`flex w-full items-start justify-between gap-2 border-t border-ink/15 py-2.5 text-left text-[13px] leading-snug hover:text-cobalt ${section === item.id ? "text-cobalt font-semibold" : ""}`}><span><span className="mono mr-2 text-[9px] text-ink/35">{item.number}</span>{item.title}</span><span className="mono text-[9px]">{reaPrompts.filter((prompt) => prompt.section === item.id).length}</span></button>)}</nav></div></aside>
        <div className="lg:col-span-9">
          <div className="border-b-2 border-ink p-5 md:p-7"><div className="grid gap-3 md:grid-cols-12"><div className="relative md:col-span-8"><label htmlFor="search-prompts" className="sr-only">Buscar prompts</label><Search className="absolute left-3 top-3.5 text-ink/45" size={18} aria-hidden="true" /><input id="search-prompts" type="search" value={query} onChange={(event) => { setQuery(event.target.value); setVisible(10); }} className="poster-input pl-10" placeholder="Busque por botão, APK, jogo, evidência…" /></div><div className="md:col-span-4"><label htmlFor="level-filter" className="sr-only">Filtrar por nível</label><select id="level-filter" value={level} onChange={(event) => { setLevel(event.target.value); setVisible(10); }} className="poster-input h-full"><option value="todos">Todos os níveis</option><option>Comece por aqui</option><option>Intermediário</option><option>Avançado</option></select></div></div><div className="mt-5 flex items-center justify-between gap-4"><p className="text-sm text-ink/60" role="status">{filtered.length} prompt{filtered.length === 1 ? "" : "s"} encontrado{filtered.length === 1 ? "" : "s"}</p>{(query || section !== "todos" || level !== "todos") && <button type="button" onClick={() => { setQuery(""); setSection("todos"); setLevel("todos"); }} className="mono inline-flex items-center gap-1 text-cobalt"><X size={14} aria-hidden="true" />Limpar filtros</button>}</div>{currentSection && <div className="mt-5 border-l-4 border-cobalt bg-cobalt-wash p-4"><h2 className="font-display font-semibold text-cobalt">{currentSection.title}</h2><p className="mt-1 text-sm text-ink/65">{currentSection.description}</p>{currentSection.warning && <p className="mt-2 text-xs font-semibold text-red-800">{currentSection.warning}</p>}</div>}</div>
          {filtered.length ? <div className="grid items-start md:grid-cols-2">{filtered.slice(0, visible).map((prompt, index) => <div key={prompt.id} className={`border-b border-ink p-4 md:p-5 ${index % 2 === 0 ? "md:border-r" : ""}`}><PromptCard prompt={prompt} /></div>)}</div> : <div className="p-16 text-center"><p className="display-medium text-3xl">Nenhum prompt encontrado.</p><button type="button" className="poster-button mt-5" onClick={() => { setQuery(""); setSection("todos"); setLevel("todos"); }}>Limpar busca</button></div>}
          {visible < filtered.length && <div className="p-6 text-center"><button type="button" className="poster-button bg-white hover-fill" onClick={() => setVisible((value) => value + 10)}>Mostrar mais 10 <span className="text-cobalt">({filtered.length - visible})</span></button></div>}
        </div>
      </div>
    </section>

    <section className="container-poster border-x-2 border-b-2 border-ink bg-ink text-white"><div className="grid lg:grid-cols-12"><div className="p-7 md:p-9 lg:col-span-4 lg:border-r lg:border-white/25"><p className="mono text-[#8CA8FF]">POR QUE ESSES PROMPTS FUNCIONAM</p><h2 className="display-medium mt-4 text-4xl">Seis regras simples.</h2></div><ol className="grid sm:grid-cols-2 lg:col-span-8">{["Um recurso por prompt", "Evidência para cada conclusão", "Fato, inferência e desconhecido separados", "Análise estática antes da execução", "Uma entrega concreta ao final", "Escopo e autorização declarados"].map((item, index) => <li key={item} className="flex gap-4 border-b border-white/20 p-5 last:border-b-0 sm:odd:border-r"><span className="mono text-[#8CA8FF]">0{index + 1}</span><span className="text-sm text-white/75">{item}</span></li>)}</ol></div></section>
  </div>;
}
