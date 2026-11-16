"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ReaPrompt } from "@/data/prompts";
import { getPromptSection } from "@/data/prompts";
import { CopyButton, DownloadButton } from "./copy-button";

export function PromptCard({ prompt, defaultOpen = false }: { prompt: ReaPrompt; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [values, setValues] = useState<Record<string, string>>({});
  const fields = useMemo(() => [...new Set(Array.from(prompt.template.matchAll(/<([^>]+)>/g), (match) => match[1]))], [prompt.template]);
  const completed = fields.filter((field) => values[field]?.trim()).length;
  const filled = prompt.template.replace(/<([^>]+)>/g, (_, field: string) => values[field]?.trim() || `<${field}>`);
  const section = getPromptSection(prompt.section);
  return <article id={prompt.id} className={`flex scroll-mt-24 flex-col border border-ink bg-paper ${open ? "md:col-span-2" : ""}`}>
    <div className="flex-1 p-5 md:p-6">
      <div className="mono flex flex-wrap items-center justify-between gap-2 text-[9px]"><span className="text-cobalt">{section?.number} • {section?.title}</span><span className="text-ink/45">{prompt.level}</span></div>
      <h3 className="display-medium mt-4 text-[27px] leading-tight">{prompt.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{prompt.summary}</p>
      {!open && <p className="pre-prompt mt-5 line-clamp-5 border-t border-ink/15 pt-4 text-[11px] text-ink/55">{prompt.template}</p>}
      {open && <div className="mt-6">
        {fields.length > 0 && <fieldset className="border border-ink bg-white p-4"><legend className="mono bg-paper px-2 text-[10px]">PREENCHA OS CAMPOS</legend><div className="grid gap-4 md:grid-cols-2">{fields.map((field, index) => <div key={field} className={field.length > 40 ? "md:col-span-2" : ""}><label htmlFor={`${prompt.id}-${index}`} className="mono mb-1.5 block break-words text-[9px] normal-case tracking-normal">{field}</label>{field.length > 45 ? <textarea id={`${prompt.id}-${index}`} value={values[field] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="poster-input min-h-24 text-sm" placeholder={`Digite: ${field.toLowerCase()}`} /> : <input id={`${prompt.id}-${index}`} value={values[field] ?? ""} onChange={(event) => setValues((current) => ({ ...current, [field]: event.target.value }))} className="poster-input text-sm" placeholder={`Digite: ${field.toLowerCase()}`} />}</div>)}</div></fieldset>}
        <div className="mt-4 border border-ink bg-ink p-5 text-white"><p className="mono mb-3 text-[9px] text-white/50">PRÉVIA ATUALIZADA</p><div className="pre-prompt text-white/90">{filled}</div></div>
      </div>}
    </div>
    <div className="border-t border-ink/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="mono inline-flex items-center gap-2 text-cobalt hover:underline">{open ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}{open ? "Recolher" : fields.length ? "Personalizar" : "Ver prompt"}</button>
        <span className="mono text-[9px] text-ink/45">{fields.length ? `${completed} de ${fields.length} preenchidos` : "Pronto para usar"}</span>
      </div>
      {open && <div className="mt-4 flex flex-wrap gap-2"><CopyButton text={filled} /><DownloadButton text={filled} filename={`${prompt.id}.md`} /><Link href={`/gerador?recurso=${encodeURIComponent(prompt.title)}`} className="mono inline-flex items-center gap-2 border border-cobalt bg-cobalt-dim px-4 py-2 text-cobalt hover:bg-cobalt hover:text-white"><Sparkles size={14} aria-hidden="true" />Adaptar com IA</Link>{fields.length > 0 && <button type="button" onClick={() => setValues({})} className="mono inline-flex items-center gap-2 px-3 py-2 text-ink/55 hover:text-cobalt"><RotateCcw size={14} aria-hidden="true" />Limpar campos</button>}</div>}
    </div>
  </article>;
}
