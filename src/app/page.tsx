import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, FileSearch, Minus, Plus, Search, Wrench } from "lucide-react";
import { builds, featuredBuilds } from "@/data/catalog";
import { BuildCard } from "@/components/build-card";
import { DirectoryBrowser } from "@/components/directory-browser";
import { CopyButton } from "@/components/copy-button";

export default function HomePage() {
  return <main>
    <section aria-labelledby="hero-heading" className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12">
        <div className="relative flex flex-col justify-between border-b-2 border-ink px-5 py-10 md:px-9 md:py-14 lg:col-span-8 lg:border-b-0 lg:border-r-2 lg:py-16">
          <p className="mono flex items-center gap-3 text-cobalt"><span className="inline-block size-2 bg-cobalt" />DIRETÓRIO COMUNITÁRIO • ENGENHARIA REVERSA COM IA</p>
          <h1 id="hero-heading" className="display mt-12 text-[clamp(4rem,9vw,9.5rem)] uppercase">Descubra.<br />Entenda.<br /><span className="text-cobalt">Recrie.</span></h1>
          <div className="mt-12 grid gap-6 md:grid-cols-12 md:items-end">
            <p className="pretty-text max-w-xl text-base leading-relaxed text-ink/70 md:col-span-8">Veja o que pessoas estão desmontando e reconstruindo com <a href="https://rea.tools" target="_blank" rel="noopener noreferrer" className="font-semibold text-cobalt underline underline-offset-4">REA<span className="sr-only"> (abre rea.tools em nova aba)</span></a> e outras ferramentas. Tudo traduzido, explicado e com link para a fonte.</p>
            <Link href="/gerador" className="poster-button bg-cobalt text-white hover:bg-ink md:col-span-4">Começar agora <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="flex flex-col justify-between bg-ink p-6 text-white md:p-9 lg:col-span-4">
          <div><p className="mono text-white/60">PARA QUEM NUNCA FEZ ISSO</p><h2 className="display-medium mt-6 text-4xl text-balance">Você faz a pergunta.<br /><span className="text-[#6E92FF]">A IA procura as provas.</span></h2><p className="mt-6 text-sm leading-relaxed text-white/65">Não precisa decorar comandos nem conhecer o código de um aplicativo. Comece com uma dúvida pequena e concreta.</p></div>
          <ol className="mt-10 space-y-0">
            {[["01", "Escolha um app ou site", "Use algo próprio, aberto ou autorizado."], ["02", "Diga o que quer entender", "Por exemplo: o que acontece ao clicar em Exportar?"], ["03", "Confira as evidências", "Fatos, deduções e dúvidas ficam separados."]].map(([number, title, text]) => <li key={number} className="grid grid-cols-[36px_1fr] gap-3 border-t border-white/25 py-4"><span className="mono text-[#6E92FF]">{number}</span><div><h3 className="font-display font-semibold">{title}</h3><p className="mt-1 text-xs leading-relaxed text-white/55">{text}</p></div></li>)}
          </ol>
          <Link href="/guides/what-is-rea" className="mono mt-8 inline-flex items-center gap-2 text-[#8CA8FF] hover:text-white">Entenda o REA em 4 minutos <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <section aria-label="Resumo do diretório" className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        <Stat number="01 • PROJETOS" value="75" text="investigações, ferramentas e reconstruções reais" />
        <Stat number="02 • CASOS DE USO" value="15" text="de Android e jogos a sites e dispositivos" />
        <div className="border-b border-ink/20 p-6 md:p-7 lg:border-b-0 lg:border-r"><p className="mono text-ink/55">03 • INSTALAÇÃO</p><code className="mt-5 block overflow-x-auto whitespace-nowrap bg-white p-3 font-mono text-xs">npx rea-agents@latest setup</code><CopyButton text="npx rea-agents@latest setup" label="Copiar comando" className="mt-3 border-0 bg-transparent p-0 text-cobalt hover:underline" /></div>
        <div className="flex min-h-48 items-center justify-center bg-cobalt p-7 text-center text-white"><blockquote className="display-medium text-[28px] leading-tight">“Você não precisa saber tudo. Precisa fazer uma boa pergunta.”</blockquote></div>
      </div>
    </section>

    <section aria-labelledby="picks-heading" className="container-poster border-x-2 border-b-2 border-ink">
      <div className="flex flex-col gap-4 border-b-2 border-ink p-6 md:flex-row md:items-end md:justify-between md:p-8"><div><p className="mono text-cobalt">SELEÇÃO DA CURADORIA • 04</p><h2 id="picks-heading" className="display mt-3 text-5xl md:text-7xl">Destaques</h2></div><p className="max-w-md text-sm text-ink/60">Quatro projetos para entender o que é possível: da conferência de respostas da IA à reconstrução de interfaces.</p></div>
      <div className="grid md:grid-cols-2">{featuredBuilds.slice(0, 4).map((build, index) => <div key={build.slug} className="border-b border-ink p-4 last:border-b-0 md:p-5 md:[&:nth-child(odd)]:border-r md:[&:nth-last-child(-n+2)]:border-b-0"><BuildCard build={build} priority={index < 2} /></div>)}</div>
    </section>

    <DirectoryBrowser />

    <section aria-labelledby="core-title" className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-72 overflow-hidden bg-ink text-white lg:min-h-full">
          <div className="sticky top-16 flex h-[calc(100vh-64px)] min-h-72 flex-col justify-between p-7 md:p-10">
            <p className="mono text-[#8CA8FF]">O CAMINHO COMPLETO • SEM PULAR ETAPAS</p>
            <h2 id="core-title" className="display vertical-title my-8 text-[clamp(4rem,8vw,8rem)] uppercase text-white lg:my-0">Comece aqui</h2>
            <p className="max-w-sm text-sm text-white/55">Do primeiro comando ao resultado testado. Role os quatro passos ao lado.</p>
          </div>
        </div>
        <div>
          <CoreStep number="01" icon={<Wrench size={25} aria-hidden="true" />} title="Prepare uma vez" text="Instale o REA no agente que você já usa. O instalador apresenta um plano antes de alterar qualquer configuração." leftLabel="VOCÊ FAZ" left="Abre o terminal, cola o comando e lê o plano." rightLabel="O REA FAZ" right="Conecta ferramentas de investigação ao seu agente." link="/guides/how-to-use-rea" linkLabel="Ver instalação explicada" />
          <CoreStep number="02" icon={<Search size={25} aria-hidden="true" />} title="Escolha uma dúvida pequena" text="Não peça para entender o aplicativo inteiro. Um botão, uma fórmula ou uma exportação já rende uma ótima investigação." leftLabel="EM VEZ DISSO" left="“Copie esse aplicativo inteiro para mim.”" rightLabel="PREFIRA ASSIM" right="“Como o botão Exportar monta o arquivo CSV?”" link="/prompts" linkLabel="Escolher um prompt pronto" />
          <CoreStep number="03" icon={<FileSearch size={25} aria-hidden="true" />} title="Peça provas, não certezas" text="Uma resposta convincente pode estar errada. A investigação precisa mostrar de onde cada conclusão veio e o que ficou faltando." leftLabel="FATOS" left="Código, função, requisição ou comportamento observado." rightLabel="A SEPARAR" right="Inferências prováveis e pontos ainda desconhecidos." link="/guides/writing-investigation-prompts" linkLabel="Aprender a pedir evidências" />
          <CoreStep number="04" icon={<Check size={25} aria-hidden="true" />} title="Teste a descoberta" text="Transforme a regra encontrada em um exemplo mínimo. Mude as entradas e veja se sua versão acompanha o comportamento original." leftLabel="ENTREGA" left="Uma explicação, especificação ou protótipo pequeno." rightLabel="VALIDAÇÃO" right="Casos de sucesso, erros, limites e diferenças restantes." link="/gerador" linkLabel="Gerar meu prompt personalizado" />
        </div>
      </div>
    </section>

    <section aria-labelledby="matrix-heading" className="container-poster border-x-2 border-b-2 border-ink">
      <div className="border-b-2 border-ink p-6 md:p-9"><p className="mono text-cobalt">MATRIZ • O QUE MUDA NA PRÁTICA</p><h2 id="matrix-heading" className="display mt-3 text-5xl md:text-7xl">Adivinhar não é investigar.</h2></div>
      <div className="hidden grid-cols-12 border-b border-ink bg-ink text-white md:grid"><div className="col-span-4 p-4 mono">Situação</div><div className="col-span-4 border-l border-white/25 p-4 mono">Só pedir uma resposta à IA</div><div className="col-span-4 border-l border-white/25 p-4 mono text-[#8CA8FF]">Investigar com REA</div></div>
      {[
        ["Ponto de partida", "Uma descrição genérica do que você imagina que o app faz.", "Um programa, arquivo ou site concreto e um único recurso para examinar."],
        ["Origem da resposta", "Conhecimento geral do modelo, que pode estar desatualizado ou não servir ao seu caso.", "Código recuperado, referências, requisições e observações relacionadas ao alvo."],
        ["Quando algo é incerto", "A dúvida pode virar uma frase segura e parecer um fato.", "A incerteza entra em uma lista separada e recebe um próximo teste."],
        ["Reconstrução", "Uma implementação aproximada, sem critério claro para saber o que falta.", "Uma especificação de comportamento e testes de entradas, saídas, erros e limites."],
        ["Responsabilidade", "O pedido pode esquecer propriedade, privacidade e autorização.", "O escopo é declarado desde o início: próprio, aberto, CTF ou explicitamente autorizado."],
      ].map(([name, before, after], index) => <div key={name} className={`grid md:grid-cols-12 ${index % 2 ? "bg-[#F9F9F9]" : ""} border-b border-ink/25 last:border-b-0`}><h3 className="p-5 font-display text-xl font-semibold md:col-span-4 md:p-6">{name}</h3><p className="border-t border-ink/15 p-5 text-sm leading-relaxed text-ink/65 md:col-span-4 md:border-l md:border-t-0 md:p-6">{before}</p><p className="border-t border-ink/15 p-5 text-sm leading-relaxed md:col-span-4 md:border-l md:border-t-0 md:bg-cobalt-wash md:p-6">{after}</p></div>)}
    </section>

    <section aria-labelledby="workflow-heading" className="container-poster border-x-2 border-b-2 border-ink">
      <div className="p-6 md:p-9"><p className="mono text-cobalt">FLUXO • ANTES E DEPOIS</p><h2 id="workflow-heading" className="display-medium mt-3 max-w-4xl text-5xl">A mesma pergunta, duas experiências muito diferentes.</h2></div>
      <div className="grid border-t-2 border-ink lg:grid-cols-2">
        <Narrative label="SEM UM MÉTODO" cobalt={false} title="Tentativa e erro" quote="“Parece que funciona assim, mas não sei como conferir.”" items={["Pedido amplo e resposta genérica", "Nenhuma separação entre fato e palpite", "Código produzido sem critério de comparação"]} />
        <Narrative label="COM REA BRASIL LB" cobalt title="Investigação verificável" quote="“Sei o que foi comprovado, o que é hipótese e qual é o próximo teste.”" items={["Um recurso bem delimitado", "Evidências e incertezas lado a lado", "Entrega pequena que você consegue testar"]} />
      </div>
    </section>

    <section aria-labelledby="truth-heading" className="container-poster border-x-2 border-b-2 border-ink bg-ink text-white">
      <div className="grid lg:grid-cols-12">
        <div className="border-b border-white/25 p-7 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r"><p className="mono text-[#8CA8FF]">AVALIAÇÃO HONESTA</p><h2 id="truth-heading" className="display mt-5 text-5xl md:text-7xl">O que esperar</h2><p className="mt-6 text-sm leading-relaxed text-white/55">REA melhora o acesso às ferramentas e às evidências. Não transforma toda resposta em verdade automática.</p></div>
        <TruthList positive title="O que você ganha" items={["Perguntas prontas para não começar com uma tela em branco.", "Explicações em português e termos técnicos traduzidos.", "Exemplos reais com links para os autores e suas fontes.", "Critérios para testar uma reconstrução em vez de confiar cegamente."]} />
        <TruthList title="O que ainda exige cuidado" items={["Descompilação é aproximação, não o código-fonte original.", "Algumas análises exigem ferramentas ou licenças adicionais.", "Execução dinâmica precisa de ambiente preparado e autorização.", "IA pode errar; evidência também precisa ser lida e revisada."]} />
      </div>
    </section>

    <section className="bg-cobalt text-white">
      <div className="container-poster flex flex-col items-center border-x-2 border-ink px-5 py-20 text-center md:py-24">
        <p className="mono text-white/70">SUA PRIMEIRA INVESTIGAÇÃO COMEÇA AQUI</p>
        <h2 className="display mt-6 max-w-6xl text-[clamp(3.7rem,9vw,8.5rem)] uppercase text-balance">Qual recurso você quer entender?</h2>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/75">Conte qual é o app ou site e o que despertou sua curiosidade. Nós montamos um prompt claro, específico e pronto para usar.</p>
        <div className="mt-10 flex w-full max-w-2xl flex-col justify-center gap-4 sm:flex-row"><Link href="/gerador" className="poster-button min-h-16 border-white bg-white px-8 text-ink hover:bg-ink hover:text-white">Começar agora <ArrowRight size={20} aria-hidden="true" /></Link><Link href="/prompts" className="poster-button min-h-16 border-white px-8 text-white hover:bg-white hover:text-cobalt">Ver prompts prontos <Copy size={18} aria-hidden="true" /></Link></div>
        <a href="#conteudo" className="mono mt-12 inline-flex items-center gap-2 text-white/60 hover:text-white">Voltar ao início <ArrowDown className="rotate-180" size={14} aria-hidden="true" /></a>
      </div>
    </section>
  </main>;
}

function Stat({ number, value, text }: { number: string; value: string; text: string }) {
  return <div className="border-b border-ink/20 p-6 md:odd:border-r md:p-7 lg:border-b-0 lg:border-r"><p className="mono text-ink/55">{number}</p><p className="display mt-5 text-6xl">{value}</p><p className="mt-2 max-w-56 text-xs leading-relaxed text-ink/60">{text}</p></div>;
}

function CoreStep({ number, icon, title, text, leftLabel, left, rightLabel, right, link, linkLabel }: { number: string; icon: React.ReactNode; title: string; text: string; leftLabel: string; left: string; rightLabel: string; right: string; link: string; linkLabel: string }) {
  return <article className="border-b border-ink p-6 last:border-b-0 md:p-9"><div className="flex items-center justify-between"><span className="mono text-cobalt">ETAPA {number}</span><span className="text-cobalt">{icon}</span></div><h3 className="display-medium mt-6 text-4xl">{title}</h3><p className="mt-4 text-sm leading-relaxed text-ink/65">{text}</p><div className="mt-7 grid border border-ink sm:grid-cols-2"><div className="p-4"><p className="mono text-[10px] text-ink/45">{leftLabel}</p><p className="mt-2 text-sm">{left}</p></div><div className="border-t border-ink bg-cobalt-wash p-4 sm:border-l sm:border-t-0"><p className="mono text-[10px] text-cobalt">{rightLabel}</p><p className="mt-2 text-sm">{right}</p></div></div><Link href={link} className="mono mt-6 inline-flex items-center gap-2 text-cobalt hover:translate-x-1">{linkLabel}<ArrowRight size={15} aria-hidden="true" /></Link></article>;
}

function Narrative({ label, title, quote, items, cobalt }: { label: string; title: string; quote: string; items: string[]; cobalt: boolean }) {
  return <article className={`relative border-2 border-ink p-7 pt-12 md:p-10 md:pt-14 ${cobalt ? "bg-cobalt-wash lg:-ml-0.5" : "bg-white"}`}><span className={`mono absolute left-0 top-0 px-4 py-1.5 text-white ${cobalt ? "bg-cobalt" : "bg-ink"}`}>{label}</span><h3 className={`display-medium text-4xl ${cobalt ? "text-cobalt" : ""}`}>{title}</h3><blockquote className={`mt-7 border-l-4 py-2 pl-5 font-display text-2xl font-medium italic leading-snug ${cobalt ? "border-cobalt" : "border-ink"}`}>{quote}</blockquote><ul className="mt-8 space-y-4">{items.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed">{cobalt ? <Plus className="mt-0.5 shrink-0 text-cobalt" size={18} aria-hidden="true" /> : <Minus className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}{item}</li>)}</ul></article>;
}

function TruthList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return <div className="border-b border-white/25 p-7 last:border-b-0 md:p-10 lg:col-span-4 lg:border-b-0 lg:border-r lg:last:border-r-0"><h3 className="mono text-sm">{title}</h3><ul className="mt-7 space-y-5">{items.map((item) => <li key={item} className="flex gap-3 text-[17px] leading-relaxed text-[#D1D5DB]"><span className={`font-mono text-xl font-bold ${positive ? "text-green-400" : "text-red-500"}`} aria-hidden="true">{positive ? "+" : "−"}</span>{item}</li>)}</ul></div>;
}
