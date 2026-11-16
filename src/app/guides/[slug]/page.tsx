import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { guides, type GuideBlock } from "@/data/content";
import { CopyButton } from "@/components/copy-button";

export function generateStaticParams() { return guides.map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((item) => item.slug === slug);
  return { title: guide?.title ?? "Guia", description: guide?.intro };
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const index = guides.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const guide = guides[index];
  const next = guides[index + 1];
  return <main><article className="container-poster border-x-2 border-b-2 border-ink"><header className="grid lg:grid-cols-12"><div className="p-7 py-10 md:p-10 lg:col-span-9 lg:border-r-2 lg:border-ink"><Link href="/guides" className="mono inline-flex items-center gap-2 text-cobalt"><ArrowLeft size={14} aria-hidden="true" />Todos os guias</Link><p className="mono mt-10 text-cobalt">{guide.eyebrow}</p><h1 className="display-medium mt-5 max-w-5xl text-[clamp(3rem,6vw,6rem)]">{guide.title}</h1></div><div className="flex items-end bg-cobalt-dim p-7 lg:col-span-3"><p className="mono inline-flex items-center gap-2 text-cobalt"><Clock3 size={15} aria-hidden="true" />{guide.readingTime}</p></div></header><div className="border-t-2 border-ink p-6 md:p-10"><p className="pretty-text max-w-4xl font-display text-2xl font-medium leading-relaxed">{guide.intro}</p></div><div className="grid border-t-2 border-ink lg:grid-cols-12"><aside className="hidden border-r-2 border-ink p-6 lg:col-span-3 lg:block"><div className="sticky top-24"><p className="mono text-ink/45">NESTE GUIA</p><ol className="mt-5 space-y-3">{guide.blocks.filter((block) => block.heading).map((block, blockIndex) => <li key={block.heading}><a href={`#bloco-${blockIndex}`} className="text-sm text-ink/65 hover:text-cobalt">{block.heading}</a></li>)}</ol></div></aside><div className="lg:col-span-9">{guide.blocks.map((block, blockIndex) => <GuideSection key={blockIndex} block={block} id={`bloco-${blockIndex}`} />)}</div></div></article>
    <nav className="container-poster grid border-x-2 border-b-2 border-ink sm:grid-cols-2" aria-label="Outros guias"><Link href="/guides" className="border-b border-ink p-6 hover:bg-cobalt-dim sm:border-b-0 sm:border-r"><span className="mono text-cobalt">VOLTAR</span><span className="mt-2 block font-display text-xl font-semibold">Índice de guias</span></Link>{next ? <Link href={`/guides/${next.slug}`} className="p-6 hover:bg-cobalt-dim"><span className="mono inline-flex items-center gap-2 text-cobalt">PRÓXIMO GUIA <ArrowRight size={14} aria-hidden="true" /></span><span className="mt-2 block font-display text-xl font-semibold">{next.title}</span></Link> : <Link href="/prompts" className="p-6 hover:bg-cobalt-dim"><span className="mono text-cobalt">PRÓXIMO PASSO</span><span className="mt-2 block font-display text-xl font-semibold">Escolha um prompt pronto</span></Link>}</nav></main>;
}
function GuideSection({ block, id }: { block: GuideBlock; id: string }) {
  return <section id={id} className="scroll-mt-24 border-b border-ink p-6 last:border-b-0 md:p-9">{block.heading && <h2 className="display-medium text-4xl">{block.heading}</h2>}{block.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-5 max-w-3xl text-base leading-relaxed text-ink/70">{paragraph}</p>)}{block.steps && <ol className="mt-6 space-y-5">{block.steps.map((step, index) => <li key={step} className="grid max-w-3xl grid-cols-[36px_1fr] gap-4"><span className="mono grid size-8 place-items-center bg-cobalt text-white">{index + 1}</span><p className="text-sm leading-relaxed">{step}</p></li>)}</ol>}{block.bullets && <ul className="mt-6 max-w-3xl space-y-3">{block.bullets.map((bullet) => <li key={bullet} className="border-l-2 border-cobalt pl-4 text-sm leading-relaxed text-ink/70">{bullet}</li>)}</ul>}{block.code && <div className="mt-7 max-w-3xl border-2 border-ink bg-ink p-5"><pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-white">{block.code}</pre><CopyButton text={block.code} label="Copiar" className="mt-4 border-white/40 bg-transparent text-white hover:bg-white hover:text-ink" /></div>}{block.quote && <blockquote className="mt-7 max-w-3xl border-l-4 border-cobalt bg-cobalt-wash p-5 font-display text-xl font-medium italic leading-relaxed text-cobalt">{block.quote}</blockquote>}</section>;
}
