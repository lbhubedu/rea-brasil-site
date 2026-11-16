import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Build } from "@/data/catalog";
import { getCategory } from "@/data/catalog";
import { VoteButton } from "./vote-button";

export function BuildCard({ build, priority = false, votes = 0 }: { build: Build; priority?: boolean; votes?: number }) {
  const category = getCategory(build.category);
  return <article className="interactive-block group flex h-full flex-col border border-ink bg-paper">
    <Link href={`/builds/${build.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
      {/* As imagens são as mesmas servidas nas fontes originais do diretório. */}
      <img src={build.image} alt="" loading={priority ? "eager" : "lazy"} className="build-image transition-transform duration-500 group-hover:scale-[1.015]" />
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <div className="mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-ink/60">
        {build.featured && <span className="bg-cobalt px-2 py-0.5 text-white">Destaque</span>}
        <Link href={`/categories/${build.category}`} className="text-cobalt hover:underline">● {category?.shortName ?? build.category}</Link>
        <span>{build.sourceType}</span>
      </div>
      <h3 className="display-medium shift-title mt-4 text-[26px] leading-[1.02]"><Link href={`/builds/${build.slug}`} className="hover:text-cobalt">{build.title}</Link></h3>
      <p className="pretty-text mt-4 flex-1 text-sm leading-relaxed text-ink/70">{build.summary}</p>
      {build.facts && build.facts.length > 0 && <dl className="mt-5 grid grid-cols-1 gap-1 border-t border-ink/15 pt-3 text-[11px] text-ink/60 sm:grid-cols-2">
        {build.facts.slice(0, 2).map((fact) => <div key={fact} className="flex gap-2"><dt className="sr-only">Detalhe</dt><dd>— {fact}</dd></div>)}
      </dl>}
      <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/20 pt-4">
        <div className="min-w-0"><p className="truncate text-xs font-semibold">{build.author}</p><a href={build.source} target="_blank" rel="noopener noreferrer" className="mono mt-1 inline-flex items-center gap-1 text-[9px] text-ink/50 hover:text-cobalt">Abrir fonte <ArrowUpRight size={11} aria-hidden="true" /><span className="sr-only"> de {build.title} em nova aba</span></a></div>
        <VoteButton slug={build.slug} initialVotes={votes} compact />
      </div>
    </div>
  </article>;
}
