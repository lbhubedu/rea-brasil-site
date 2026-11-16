import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { builds, getBuild, getCategory } from "@/data/catalog";
import { promptsForCategory } from "@/data/prompts";
import { BuildCard } from "@/components/build-card";
import { PromptCard } from "@/components/prompt-card";
import { VoteButton } from "@/components/vote-button";

export function generateStaticParams() { return builds.map((build) => ({ slug: build.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const build = getBuild((await params).slug);
  return { title: build?.title ?? "Projeto", description: build?.summary };
}
export default async function BuildPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const build = getBuild(slug);
  if (!build) notFound();
  const category = getCategory(build.category);
  const related = builds.filter((item) => item.category === build.category && item.slug !== build.slug).slice(0, 3);
  const prompt = promptsForCategory(build.category)[0];
  return <main>
    <section className="container-poster border-x-2 border-b-2 border-ink"><div className="border-b border-ink px-5 py-3 mono text-[10px]"><Link href="/" className="text-cobalt">Projetos</Link><span className="mx-2">/</span><Link href={`/categories/${build.category}`} className="text-cobalt">{category?.shortName}</Link><span className="mx-2">/</span><span className="text-ink/45">Detalhes</span></div>
      <div className="grid lg:grid-cols-12"><div className="p-6 py-9 md:p-10 lg:col-span-8 lg:border-r-2 lg:border-ink"><p className="mono text-cobalt">{build.sourceType} • POR {build.author}</p><h1 className="display-medium mt-6 text-[clamp(2.8rem,6vw,6rem)]">{build.title}</h1><p className="pretty-text mt-7 max-w-3xl text-lg leading-relaxed text-ink/70">{build.summary}</p><div className="mt-8 flex flex-wrap gap-3"><a href={build.source} target="_blank" rel="noopener noreferrer" className="poster-button bg-cobalt text-white hover:bg-ink">Abrir fonte original <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (nova aba)</span></a><VoteButton slug={build.slug} /></div></div><aside className="bg-cobalt-dim p-7 lg:col-span-4"><p className="mono text-cobalt">FICHA DO PROJETO</p><dl className="mt-6 space-y-5"><div><dt className="mono text-[9px] text-ink/45">CASO DE USO</dt><dd className="mt-1 text-sm font-semibold">{category?.name}</dd></div><div><dt className="mono text-[9px] text-ink/45">FERRAMENTA</dt><dd className="mt-1 text-sm">{build.tool || "REA e outras ferramentas"}</dd></div><div><dt className="mono text-[9px] text-ink/45">AUTOR OU AUTORA</dt><dd className="mt-1 text-sm">{build.author}</dd></div><div><dt className="mono text-[9px] text-ink/45">TIPO DE FONTE</dt><dd className="mt-1 text-sm">{build.sourceType}</dd></div></dl></aside></div>
      <figure className="border-t-2 border-ink"><img src={build.image} alt={`Imagem de apresentação do projeto ${build.title}`} className="max-h-[650px] w-full object-cover" /><figcaption className="border-t border-ink px-5 py-3 text-xs text-ink/55">Imagem servida pela fonte original do projeto. Os direitos permanecem com seus respectivos autores.</figcaption></figure>
    </section>
    <section className="container-poster border-x-2 border-b-2 border-ink"><div className="grid lg:grid-cols-12"><div className="p-6 md:p-9 lg:col-span-7 lg:border-r-2 lg:border-ink"><p className="mono text-cobalt">O QUE ESTE EXEMPLO ENSINA</p><h2 className="display-medium mt-4 text-4xl">Como ler este projeto</h2><div className="mt-6 space-y-5 text-sm leading-relaxed text-ink/70"><p>Este não é um tutorial automático nem uma promessa de que toda reconstrução será igual. É um registro público do que alguém investigou, construiu ou documentou com ajuda de agentes.</p><p>Abra a fonte original para consultar o relatório, os testes, as limitações e as instruções do autor. A descrição acima traduz o contexto para facilitar a descoberta; a fonte é sempre a referência para os detalhes técnicos.</p></div></div><div className="p-6 md:p-9 lg:col-span-5"><p className="mono text-cobalt">DETALHES DESTACADOS</p><ul className="mt-6 space-y-4">{(build.facts?.length ? build.facts : ["Investigação assistida por agente", "Fonte pública vinculada", "Descrição revisada em português"]).map((fact) => <li key={fact} className="flex gap-3 border-b border-ink/15 pb-4 text-sm"><CheckCircle2 size={19} className="shrink-0 text-cobalt" aria-hidden="true" />{fact}</li>)}</ul></div></div></section>
    {prompt && <section className="container-poster border-x-2 border-b-2 border-ink"><div className="border-b-2 border-ink p-6 md:p-8"><p className="mono text-cobalt">EXPERIMENTE VOCÊ MESMO</p><h2 className="display-medium mt-3 text-4xl">Um prompt relacionado</h2><p className="mt-3 text-sm text-ink/60">Adapte o modelo ao seu próprio alvo autorizado. Não execute o projeto de outra pessoa sem revisar o código.</p></div><div className="p-5 md:p-7"><PromptCard prompt={prompt} /></div></section>}
    {related.length > 0 && <section className="container-poster border-x-2 border-b-2 border-ink"><div className="flex items-end justify-between border-b-2 border-ink p-6 md:p-8"><div><p className="mono text-cobalt">CONTINUE EXPLORANDO</p><h2 className="display-medium mt-3 text-4xl">Projetos relacionados</h2></div><Link href={`/categories/${build.category}`} className="mono hidden items-center gap-2 text-cobalt sm:inline-flex">Ver categoria <ArrowRight size={15} aria-hidden="true" /></Link></div><div className="grid md:grid-cols-2 lg:grid-cols-3">{related.map((item) => <div key={item.slug} className="border-b border-ink p-4 md:border-r lg:border-b-0"><BuildCard build={item} /></div>)}</div></section>}
  </main>;
}
