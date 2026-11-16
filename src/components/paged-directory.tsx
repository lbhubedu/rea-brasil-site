import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Build } from "@/data/catalog";
import { BuildCard } from "./build-card";

export function PagedDirectory({ items, page, basePath, title, description }: { items: Build[]; page: number; basePath: string; title: string; description: string }) {
  const perPage = 8;
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const visible = items.slice((page - 1) * perPage, page * perPage);
  const href = (number: number) => number === 1 ? basePath : `${basePath}/page/${number}`;
  return <main>
    <section className="container-poster border-x-2 border-b-2 border-ink"><div className="grid lg:grid-cols-12"><div className="p-7 py-10 md:p-10 lg:col-span-8 lg:border-r-2 lg:border-ink"><p className="mono text-cobalt">DIRETÓRIO • PÁGINA {String(page).padStart(2, "0")}</p><h1 className="display mt-5 text-6xl md:text-8xl">{title}</h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/65">{description}</p></div><div className="flex items-end justify-between bg-cobalt-dim p-7 lg:col-span-4"><div><p className="display text-7xl">{items.length}</p><p className="mono text-cobalt">projetos no catálogo</p></div><p className="mono text-ink/45">{visible.length} nesta página</p></div></div></section>
    <section className="container-poster border-x-2 border-b-2 border-ink"><div className="grid md:grid-cols-2">{visible.map((build, index) => <div key={build.slug} className="border-b border-ink p-4 md:p-5 md:[&:nth-child(odd)]:border-r"><BuildCard build={build} priority={index < 2} /></div>)}</div>
      <nav className="flex flex-col gap-5 border-t-2 border-ink p-5 md:flex-row md:items-center md:justify-between" aria-label="Paginação de projetos">
        <div>{page > 1 && <Link href={href(page - 1)} className="poster-button bg-white hover-fill"><ArrowLeft size={16} aria-hidden="true" />Anterior</Link>}</div>
        <ol className="flex flex-wrap items-center justify-center gap-1">{Array.from({ length: pages }, (_, index) => index + 1).map((number) => <li key={number}><Link href={href(number)} aria-current={number === page ? "page" : undefined} aria-label={`Página ${number}`} className={`mono grid size-10 place-items-center border ${number === page ? "border-ink bg-ink text-white" : "border-ink/25 hover:border-cobalt hover:text-cobalt"}`}>{number}</Link></li>)}</ol>
        <div>{page < pages && <Link href={href(page + 1)} className="poster-button bg-white hover-fill">Próxima<ArrowRight size={16} aria-hidden="true" /></Link>}</div>
      </nav>
    </section>
  </main>;
}
