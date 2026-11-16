import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { fetchOfficialReleases } from "@/lib/releases";
import { AiReleaseSummary } from "@/components/ai-release-summary";

export const revalidate = 86400;
export const metadata: Metadata = {
  title: "Novidades",
  description: "Lançamentos oficiais recentes do REA, Ghidra e Frida, lidos automaticamente das APIs públicas do GitHub.",
};

export default async function NovidadesPage() {
  const { releases, fetchedAt, failed } = await fetchOfficialReleases();
  const fetchedLabel = new Date(fetchedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", dateStyle: "short", timeStyle: "short" });
  return <div>
    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12">
        <div className="border-b-2 border-ink p-6 py-10 md:p-10 lg:col-span-8 lg:border-b-0 lg:border-r-2">
          <p className="mono text-cobalt">ATUALIZAÇÃO AUTOMÁTICA • FONTE OFICIAL</p>
          <h1 className="display mt-6 text-[clamp(3rem,6.5vw,6rem)]">O que saiu<br />de novo.</h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink/65">Últimos lançamentos oficiais do REA, Ghidra e Frida, lidos direto das APIs públicas do GitHub. Esta página se atualiza sozinha a cada dia — cada item guarda o link original para você conferir a fonte.</p>
        </div>
        <div className="flex flex-col justify-between bg-cobalt-dim p-7 lg:col-span-4">
          <p className="mono text-cobalt">SEM INVENÇÃO</p>
          <div className="mt-10">
            <p className="text-sm leading-relaxed text-ink/70">Título, versão, data e link vêm do repositório oficial de cada projeto. Se uma fonte falhar, avisamos aqui em vez de preencher o espaço.</p>
            <p className="mono mt-5 text-[10px] text-ink/50">CONSULTADO EM {fetchedLabel}</p>
          </div>
        </div>
      </div>
    </section>

    {failed.length > 0 && <section className="container-poster border-x-2 border-b-2 border-ink"><p role="status" className="border-b border-ink bg-[#FFF7D6] p-4 text-sm leading-relaxed">Não foi possível ler agora as releases de: {failed.join(", ")}. Os itens abaixo mostram apenas as fontes que responderam.</p></section>}

    <AiReleaseSummary />

    <section className="container-poster border-x-2 border-b-2 border-ink">
      {releases.length === 0
        ? <div className="p-6 md:p-10"><p className="text-sm text-ink/65">Nenhuma release foi lida agora. As APIs públicas do GitHub podem estar temporariamente indisponíveis ou limitadas por excesso de consultas. Volte mais tarde.</p></div>
        : <ol className="divide-y divide-ink/20" aria-label="Lançamentos recentes">
          {releases.map((release) => <li key={release.url} className="grid md:grid-cols-12">
            <div className="md:col-span-3 md:border-r border-ink/20 p-5 md:p-6">
              <p className="mono text-cobalt">{release.label}</p>
              <p className="mono mt-2 text-[10px] text-ink/50">{new Date(release.publishedAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
            </div>
            <div className="md:col-span-9 p-5 md:p-6">
              <h2 className="font-display text-xl font-semibold leading-snug">{release.title}</h2>
              {release.summary && <p className="mt-2 text-sm leading-relaxed text-ink/60">{release.summary}</p>}
              <a href={release.url} target="_blank" rel="noopener noreferrer" className="mono mt-3 inline-flex items-center gap-1.5 text-cobalt hover:underline">Release original <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (abre em nova aba)</span></a>
            </div>
          </li>)}
        </ol>}
    </section>

    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="border-b border-ink p-6 md:p-8"><p className="mono text-cobalt">COMO ESTA PÁGINA FUNCIONA</p><h2 className="display-medium mt-3 max-w-2xl text-3xl">Dados reais, sem redação automática</h2></div>
      <div className="grid md:grid-cols-3">
        <div className="border-b border-ink/20 p-6 md:border-b-0 md:border-r"><p className="font-display font-semibold">Fonte</p><p className="mt-2 text-sm leading-relaxed text-ink/60">Cada item vem da API pública de releases do repositório oficial: morluto/rea, NationalSecurityAgency/ghidra e frida/frida.</p></div>
        <div className="border-b border-ink/20 p-6 md:border-b-0 md:border-r"><p className="font-display font-semibold">Atualização</p><p className="mt-2 text-sm leading-relaxed text-ink/60">A leitura é refeita uma vez por dia em cache. A data e a hora da última consulta bem-sucedida aparecem no topo.</p></div>
        <div className="p-6"><p className="font-display font-semibold">Resumo com IA</p><p className="mt-2 text-sm leading-relaxed text-ink/60">O quadro de resumo, quando aparece, é o único trecho escrito por IA — e só resume o texto das releases recebidas. Pode conter erros.</p></div>
      </div>
    </section>
  </div>;
}
