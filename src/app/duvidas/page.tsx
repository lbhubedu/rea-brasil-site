import type { Metadata } from "next";
import Link from "next/link";
import { DuvidasForm } from "@/components/duvidas-form";

export const metadata: Metadata = {
  title: "Dúvidas",
  description: "Pergunte sobre REA, engenharia reversa com IA e as ferramentas do diretório. Resposta por serviços de IA gratuitos, sem cadastro.",
};

export default function DuvidasPage() {
  return <div>
    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12">
        <div className="border-b-2 border-ink p-6 py-10 md:p-10 lg:col-span-8 lg:border-b-0 lg:border-r-2">
          <p className="mono text-cobalt">PERGUNTE • SEM CADASTRO • SEM CHAVE</p>
          <h1 className="display mt-6 text-[clamp(3rem,6.5vw,6rem)]">Ficou<br />com dúvida?</h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink/65">Escreva sua pergunta sobre REA, engenharia reversa com IA ou as ferramentas do diretório. A resposta é gerada na hora por serviços de IA gratuitos, com o contexto dos guias deste site.</p>
        </div>
        <div className="flex flex-col justify-between bg-cobalt-dim p-7 lg:col-span-4">
          <p className="mono text-cobalt">ANTES DE PERGUNTAR</p>
          <ul className="mt-10 space-y-4 text-sm leading-relaxed text-ink/70">
            <li>Não digite senhas, tokens, dados pessoais ou informações confidenciais.</li>
            <li>Sua pergunta é enviada a serviços de IA de terceiros e <strong className="text-ink">não é salva por nós</strong>.</li>
            <li>Respostas de IA podem estar erradas. Confira sempre nos <Link href="/guides" className="text-cobalt underline">guias</Link> e na <a href="https://github.com/morluto/rea" target="_blank" rel="noopener noreferrer" className="text-cobalt underline">documentação oficial<span className="sr-only"> (abre em nova aba)</span></a>.</li>
          </ul>
        </div>
      </div>
    </section>

    <DuvidasForm />

    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="border-b border-ink p-6 md:p-8"><p className="mono text-cobalt">ATALHOS ÚTEIS</p><h2 className="display-medium mt-3 max-w-2xl text-3xl">Muitas respostas já estão escritas</h2><p className="mt-3 text-sm text-ink/60">Comece por estes caminhos — eles não dependem de IA e são revisados com mais cuidado.</p></div>
      <div className="grid md:grid-cols-3">
        {[
          { title: "O que é REA, sem palavras difíceis", text: "Conceitos básicos e como é uma sessão de investigação.", href: "/guides/what-is-rea" },
          { title: "Como usar o REA no seu agente", text: "Passos para instalar e fazer a primeira pergunta.", href: "/guides/how-to-use-rea" },
          { title: "Escrever bons prompts de investigação", text: "Como pedir um único recurso com evidências.", href: "/guides/writing-investigation-prompts" },
        ].map((item) => <Link key={item.href} href={item.href} className="interactive-block border-b border-ink/20 p-6 last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0">
          <p className="font-display font-semibold">{item.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.text}</p>
        </Link>)}
      </div>
    </section>
  </div>;
}
