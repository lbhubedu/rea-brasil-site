import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { categories, getBuildsByCategory, getCategory } from "@/data/catalog";
import { promptsForCategory } from "@/data/prompts";
import { DirectoryBrowser } from "@/components/directory-browser";
import { PromptCard } from "@/components/prompt-card";

export function generateStaticParams() { return categories.map((category) => ({ slug: category.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = getCategory((await params).slug);
  return { title: category ? `${category.name}: projetos e prompts` : "Categoria" , description: category?.description };
}
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const category = getCategory(slug);
  if (!category) notFound();
  const items = getBuildsByCategory(slug);
  const prompts = promptsForCategory(slug);
  return <main>
    <nav className="container-poster flex items-center gap-2 border-x-2 border-b border-ink px-5 py-3 mono text-[10px]" aria-label="Navegação estrutural"><Link href="/" className="text-cobalt hover:underline">Todos os projetos</Link><span>/</span><span>{category.shortName}</span></nav>
    <section className="container-poster border-x-2 border-b-2 border-ink"><div className="grid lg:grid-cols-12"><div className="p-7 py-10 md:p-10 lg:col-span-8 lg:border-r-2 lg:border-ink"><p className="mono text-cobalt">CASO DE USO • {category.slug.toUpperCase()}</p><h1 className="display mt-5 text-[clamp(3.2rem,7vw,7rem)]">{category.name}</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/65">{category.description}</p></div><div className="flex flex-col justify-between bg-cobalt-dim p-7 lg:col-span-4"><div><p className="display text-7xl">{category.count}</p><p className="mono text-cobalt">projetos na referência</p></div><div className="mt-10 border-t border-cobalt/20 pt-5"><p className="mono text-[10px] text-cobalt">EM PALAVRAS SIMPLES</p><p className="mt-2 text-sm leading-relaxed">{category.beginner}</p></div></div></div></section>
    <DirectoryBrowser items={items} initialCategory={slug} title={category.shortName} />
    <section className="container-poster border-x-2 border-b-2 border-ink"><div className="flex flex-col gap-4 border-b-2 border-ink p-6 md:flex-row md:items-end md:justify-between md:p-8"><div><p className="mono text-cobalt">DÊ O PRÓXIMO PASSO</p><h2 className="display-medium mt-3 text-4xl">Prompts para começar</h2><p className="mt-3 max-w-xl text-sm text-ink/60">Modelos relacionados a esta categoria. Preencha os campos e cole no seu agente.</p></div><Link href="/prompts" className="mono inline-flex items-center gap-2 text-cobalt">Ver todos os 55 prompts <ArrowRight size={15} aria-hidden="true" /></Link></div><div className="grid items-start md:grid-cols-2">{prompts.slice(0, 4).map((prompt, index) => <div key={prompt.id} className={`border-b border-ink p-4 md:p-5 ${index % 2 === 0 ? "md:border-r" : ""}`}><PromptCard prompt={prompt} /></div>)}</div></section>
  </main>;
}
