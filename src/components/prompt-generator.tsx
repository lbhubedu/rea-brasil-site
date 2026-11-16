"use client";

import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, FileText, Globe2, Lightbulb, LoaderCircle, RotateCcw, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Provider } from "@/lib/prompt-generator";
import { CopyButton, DownloadButton } from "./copy-button";

const appTypes = ["Site ou aplicação web", "Aplicativo Android / APK", "Programa Windows", "Aplicativo macOS", "Aplicativo Electron", "Jogo offline", "Dispositivo ou firmware", "Biblioteca ou executável", "Outro"];
const objectives = [
  { id: "entender", title: "Entender como funciona", text: "Quero uma explicação clara do caminho percorrido pelo recurso." },
  { id: "reconstruir", title: "Recriar no meu projeto", text: "Quero uma especificação e uma implementação independente." },
  { id: "comparar", title: "Comparar versões ou resultados", text: "Quero encontrar diferenças e criar testes de equivalência." },
  { id: "automatizar", title: "Integrar ou automatizar", text: "Quero entender o protocolo e criar uma automação própria." },
  { id: "seguranca", title: "Fazer revisão defensiva", text: "Tenho autorização e quero revisar riscos sem atacar nada." },
];
const deliverables = [
  { id: "explicacao", title: "Explicação simples", text: "Ideal para aprender" },
  { id: "especificacao", title: "Especificação .md", text: "Ideal para reconstruir" },
  { id: "plano", title: "Plano de investigação", text: "Ideal para se organizar" },
  { id: "teste", title: "Exemplo e testes", text: "Ideal para validar" },
  { id: "relatorio", title: "Relatório de evidências", text: "Ideal para documentar" },
];
const providerOptions: { id: Provider; name: string; text: string }[] = [
  { id: "auto", name: "Automático", text: "Tenta Kilo e depois Pollinations" },
  { id: "kilo", name: "Kilo Gateway", text: "Modelo kilo-auto/free, sem chave" },
  { id: "pollinations", name: "Pollinations", text: "Modelo openai-fast, sem chave" },
  { id: "local", name: "Roteiro local", text: "Sem IA; monta a estrutura no servidor" },
];

type FormState = { appName: string; appType: string; feature: string; objective: string; audience: string; deliverable: string; details: string };
type Result = { id?: string; content: string; provider: string; model: string; notice?: string; appName?: string; feature?: string; createdAt?: string };
type HistoryItem = { id: string; appName: string; feature: string; provider: string; content: string; createdAt: string };
const initialForm: FormState = { appName: "", appType: appTypes[0], feature: "", objective: "entender", audience: "iniciante", deliverable: "explicacao", details: "" };

export function PromptGenerator() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [provider, setProvider] = useState<Provider>("auto");
  const [authorized, setAuthorized] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [tab, setTab] = useState<"prompt" | "como-usar">("prompt");
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    // Leitura pós-hidratação: evita setState síncrono no effect e divergência de SSR.
    queueMicrotask(() => {
      try {
        const draft = localStorage.getItem("rea-br-generator-draft");
        if (draft) setForm({ ...initialForm, ...JSON.parse(draft) as Partial<FormState> });
        const savedHistory = localStorage.getItem("rea-br-generator-history");
        if (savedHistory) setHistory(JSON.parse(savedHistory) as HistoryItem[]);
        const requestedFeature = new URLSearchParams(window.location.search).get("recurso");
        if (requestedFeature) {
          setForm((current) => ({ ...current, feature: requestedFeature, details: current.details || `Quero adaptar o prompt da biblioteca "${requestedFeature}" ao meu alvo. Use meus dados acima e mantenha o foco em um único recurso.` }));
          setStep(1);
        }
      } catch { /* rascunho e histórico locais são opcionais */ }
      setDraftReady(true);
    });
  }, []);
  useEffect(() => { if (draftReady) localStorage.setItem("rea-br-generator-draft", JSON.stringify(form)); }, [form, draftReady]);

  function saveHistory(item: HistoryItem) {
    setHistory((current) => {
      const next = [item, ...current].slice(0, 6);
      try { localStorage.setItem("rea-br-generator-history", JSON.stringify(next)); } catch { /* histórico local é opcional */ }
      return next;
    });
  }
  function update<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }
  const chosenObjective = useMemo(() => objectives.find((item) => item.id === form.objective), [form.objective]);
  const chosenDeliverable = useMemo(() => deliverables.find((item) => item.id === form.deliverable), [form.deliverable]);

  function next() {
    setError("");
    if (step === 1 && form.appName.trim().length < 2) { setError("Digite o nome do app, site ou dispositivo para continuar."); return; }
    if (step === 2 && form.feature.trim().length < 3) { setError("Conte qual recurso você quer investigar. Exemplo: exportação de notas em CSV."); return; }
    setStep((value) => Math.min(3, value + 1));
    document.getElementById("generator-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function generate(event?: FormEvent) {
    event?.preventDefault();
    if (!authorized) { setError("Confirme a autorização no final do formulário para gerar o prompt."); return; }
    setStatus("loading"); setError(""); setResult(null);
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, provider, authorized }) });
      const data = await response.json() as Result & { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível gerar o prompt.");
      setResult(data); setStatus("idle"); setTab("prompt");
      saveHistory({ id: data.id ?? `${Date.now()}`, appName: form.appName, feature: form.feature, provider: data.provider, content: data.content, createdAt: data.createdAt ?? new Date().toISOString() });
      window.setTimeout(() => document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (reason) { setStatus("error"); setError(reason instanceof Error ? reason.message : "Não foi possível gerar o prompt."); }
  }
  function fillExample() {
    setForm({ appName: "Meu aplicativo de notas", appType: "Aplicativo Electron", feature: "o botão Exportar notas e a criação do arquivo CSV", objective: "entender", audience: "iniciante", deliverable: "explicacao", details: "O aplicativo está em uma pasta local. Quero entender quais colunas entram no arquivo e onde cada uma é definida. Não execute o aplicativo sem me avisar." });
    setAuthorized(true); setStep(1); setError(""); setResult(null);
  }
  function reset() { setForm(initialForm); setProvider("auto"); setAuthorized(false); setResult(null); setStep(1); setError(""); localStorage.removeItem("rea-br-generator-draft"); }

  return <div>
    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12">
        <div className="border-b-2 border-ink p-6 py-10 md:p-10 lg:col-span-8 lg:border-b-0 lg:border-r-2">
          <p className="mono text-cobalt">GERADOR PERSONALIZADO • SEM CHAVE DE API</p>
          <h1 className="display mt-6 text-[clamp(3.5rem,7.5vw,7.5rem)]">Seu app.<br />Sua dúvida.<br /><span className="text-cobalt">Seu prompt.</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink/65">Responda três etapas curtas. O Rea Brasil LB transforma suas respostas em um pedido de investigação específico, com segurança, evidências e uma entrega bem definida.</p>
        </div>
        <div className="flex flex-col justify-between bg-cobalt-dim p-7 lg:col-span-4">
          <Lightbulb size={32} className="text-cobalt" aria-hidden="true" />
          <div className="mt-10"><p className="mono text-cobalt">NÃO SABE COMO PREENCHER?</p><p className="mt-3 text-sm leading-relaxed text-ink/70">Use nosso exemplo de um app de notas. Todos os campos continuarão editáveis.</p><button type="button" onClick={fillExample} className="poster-button mt-5 bg-white hover-fill">Preencher um exemplo <Wand2 size={16} aria-hidden="true" /></button></div>
        </div>
      </div>
    </section>

    <section id="generator-form" className="container-poster border-x-2 border-b-2 border-ink">
      <ol className="grid grid-cols-3 border-b-2 border-ink" aria-label="Etapas do gerador">
        {[["1", "O alvo"], ["2", "A dúvida"], ["3", "A entrega"]].map(([number, label], index) => <li key={number} className={`flex items-center gap-3 border-r border-ink p-4 last:border-r-0 md:p-5 ${step === index + 1 ? "bg-ink text-white" : step > index + 1 ? "bg-cobalt-dim text-cobalt" : "text-ink/45"}`} aria-current={step === index + 1 ? "step" : undefined}><span className={`mono grid size-7 shrink-0 place-items-center border ${step === index + 1 ? "border-white" : "border-current"}`}>{step > index + 1 ? <Check size={15} aria-hidden="true" /> : number}</span><span className="mono text-[10px] md:text-xs">{label}</span></li>)}
      </ol>
      <form onSubmit={generate} className="grid lg:grid-cols-12">
        <div className="p-6 md:p-9 lg:col-span-8 lg:border-r-2 lg:border-ink">
          {step === 1 && <div>
            <StepHeading number="ETAPA 01 • O ALVO" title="O que você quer investigar?" text="Pode ser um app instalado, um site, um APK, um jogo offline ou um dispositivo próprio." />
            <div className="mt-8 space-y-6">
              <div><label htmlFor="appName" className="mono mb-2 block">Nome do app, site ou dispositivo *</label><input id="appName" className="poster-input" value={form.appName} onChange={(e) => update("appName", e.target.value)} placeholder="Ex.: Meu app de notas ou https://meusite.com.br" maxLength={120} autoComplete="off" required /><p className="mt-2 text-xs text-ink/55">Não precisa informar código, senha ou dados privados.</p></div>
              <div><label htmlFor="appType" className="mono mb-2 block">Que tipo de alvo é?</label><select id="appType" className="poster-input" value={form.appType} onChange={(e) => update("appType", e.target.value)}>{appTypes.map((type) => <option key={type}>{type}</option>)}</select></div>
              <InfoBox title="O que significa “alvo”?" text="É apenas aquilo que será analisado. Escolha uma coisa por vez. Se você tiver o caminho do arquivo ou o endereço do site, poderá incluí-lo nos detalhes da próxima etapa." />
            </div>
          </div>}
          {step === 2 && <div>
            <StepHeading number="ETAPA 02 • A DÚVIDA" title="Qual único recurso despertou sua curiosidade?" text="Quanto menor e mais concreta a pergunta, melhor a investigação." />
            <div className="mt-8 space-y-7">
              <div><label htmlFor="feature" className="mono mb-2 block">Recurso ou comportamento *</label><textarea id="feature" className="poster-input min-h-28 resize-y" value={form.feature} onChange={(e) => update("feature", e.target.value)} placeholder="Ex.: o que acontece quando clico em Exportar e como o CSV é montado" maxLength={240} required /><p className="mt-2 text-right text-xs text-ink/45">{form.feature.length}/240</p></div>
              <fieldset><legend className="mono mb-3">O que você quer fazer com essa descoberta?</legend><div className="grid gap-2 sm:grid-cols-2">{objectives.map((item) => <label key={item.id} className={`cursor-pointer border p-4 transition-colors ${form.objective === item.id ? "border-cobalt bg-cobalt-dim" : "border-ink/25 hover:border-ink"}`}><input type="radio" name="objective" value={item.id} checked={form.objective === item.id} onChange={() => update("objective", item.id)} className="sr-only" /><span className="flex items-start justify-between gap-3"><span><span className="block font-display font-semibold">{item.title}</span><span className="mt-1 block text-xs leading-relaxed text-ink/60">{item.text}</span></span><span className={`mt-1 size-3 shrink-0 rounded-full border ${form.objective === item.id ? "border-4 border-cobalt" : "border-ink/35"}`} /></span></label>)}</div></fieldset>
              <div><label htmlFor="details" className="mono mb-2 block">Detalhes úteis (opcional)</label><textarea id="details" className="poster-input min-h-32 resize-y" value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Caminho da pasta, sistema operacional, comportamento esperado ou algo que você já tentou." maxLength={1800} /><p className="mt-2 text-xs text-ink/55">Não inclua senhas, tokens, dados pessoais ou informações confidenciais.</p></div>
            </div>
          </div>}
          {step === 3 && <div>
            <StepHeading number="ETAPA 03 • A ENTREGA" title="Como você quer receber o resultado?" text="Essas escolhas mudam as instruções do prompt, não apenas a aparência da resposta." />
            <div className="mt-8 space-y-7">
              <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="audience" className="mono mb-2 block">Nível da explicação</label><select id="audience" className="poster-input" value={form.audience} onChange={(e) => update("audience", e.target.value)}><option value="iniciante, sem conhecimento técnico">Totalmente iniciante</option><option value="iniciante que já usa terminal">Sei usar um pouco o terminal</option><option value="desenvolvedor, mas novo em engenharia reversa">Sei programar, sou novo em RE</option><option value="pesquisador técnico">Explicação técnica</option></select></div><div><label htmlFor="provider" className="mono mb-2 block">Serviço de geração</label><select id="provider" className="poster-input" value={provider} onChange={(e) => setProvider(e.target.value as Provider)}>{providerOptions.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><p className="mt-2 text-xs text-ink/55">{providerOptions.find((item) => item.id === provider)?.text}</p></div></div>
              <fieldset><legend className="mono mb-3">Formato da entrega final</legend><div className="grid gap-2 sm:grid-cols-2">{deliverables.map((item) => <label key={item.id} className={`flex cursor-pointer items-center justify-between gap-3 border p-4 ${form.deliverable === item.id ? "border-cobalt bg-cobalt-dim" : "border-ink/25 hover:border-ink"}`}><span><span className="block font-display font-semibold">{item.title}</span><span className="text-xs text-ink/55">{item.text}</span></span><input type="radio" name="deliverable" checked={form.deliverable === item.id} onChange={() => update("deliverable", item.id)} className="accent-cobalt" /></label>)}</div></fieldset>
              <label className="flex cursor-pointer items-start gap-3 border-2 border-ink bg-white p-4"><input type="checkbox" checked={authorized} onChange={(e) => setAuthorized(e.target.checked)} className="mt-1 size-5 shrink-0 accent-cobalt" /><span><span className="flex items-center gap-2 font-display font-semibold"><ShieldCheck size={19} className="text-cobalt" aria-hidden="true" />Confirmo o escopo autorizado</span><span className="mt-1 block text-xs leading-relaxed text-ink/60">O alvo é meu, é aberto ou tenho autorização explícita para analisá-lo. Não vou usar o prompt para pirataria, invasão ou violação de privacidade.</span></span></label>
            </div>
          </div>}
          {error && <p role="alert" className="mt-6 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
          <div className="mt-9 flex flex-col-reverse gap-3 border-t border-ink/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={() => { setError(""); step === 1 ? reset() : setStep((value) => value - 1); }} className="poster-button border-ink/30">{step === 1 ? <RotateCcw size={16} aria-hidden="true" /> : <ArrowLeft size={16} aria-hidden="true" />}{step === 1 ? "Limpar" : "Voltar"}</button>
            {step < 3 ? <button key="next" type="button" onClick={next} className="poster-button bg-ink text-white hover:bg-cobalt">Continuar <ArrowRight size={16} aria-hidden="true" /></button> : <button key="generate" type="submit" disabled={status === "loading"} className="poster-button min-h-14 bg-cobalt text-white hover:bg-ink">{status === "loading" ? <><LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> Gerando com IA…</> : <>Gerar meu prompt <Sparkles size={18} aria-hidden="true" /></>}</button>}
          </div>
          {status === "loading" && <div role="status" className="mt-5"><div className="loading-bar h-1 bg-cobalt-dim" /><p className="mt-3 text-xs text-ink/55">O serviço gratuito está escrevendo seu prompt. Isso pode levar alguns segundos; não feche a página.</p></div>}
        </div>
        <aside className="bg-[#F9F9F9] p-6 md:p-8 lg:col-span-4">
          <div className="sticky top-24"><p className="mono text-ink/50">RESUMO AO VIVO</p><h2 className="display-medium mt-3 text-3xl">Seu pedido até agora</h2><dl className="mt-7 space-y-5">
            <SummaryRow label="ALVO" value={form.appName || "Ainda não informado"} />
            <SummaryRow label="TIPO" value={form.appType} />
            <SummaryRow label="RECURSO" value={form.feature || "Ainda não informado"} />
            <SummaryRow label="OBJETIVO" value={chosenObjective?.title ?? ""} />
            <SummaryRow label="ENTREGA" value={chosenDeliverable?.title ?? ""} />
            <SummaryRow label="GERAÇÃO" value={providerOptions.find((item) => item.id === provider)?.name ?? ""} />
          </dl><div className="mt-8 border-t border-ink/20 pt-5"><p className="text-xs leading-relaxed text-ink/55"><strong className="text-ink">Privacidade:</strong> ao clicar em gerar, os dados preenchidos são enviados a um serviço de IA de terceiros (Kilo Gateway ou Pollinations), que responde com o texto do prompt. Não salvamos seus prompts em banco nem os publicamos; o rascunho e o histórico ficam apenas neste navegador. Evite informações sensíveis.</p></div></div>
        </aside>
      </form>
    </section>

    {result && <section id="resultado" aria-labelledby="result-title" className="container-poster border-x-2 border-b-2 border-ink bg-white">
      <div className="flex flex-col gap-5 border-b-2 border-ink p-6 md:flex-row md:items-end md:justify-between md:p-8"><div><p className="mono text-cobalt">PRONTO PARA COPIAR E USAR</p><h2 id="result-title" className="display mt-3 text-5xl">Seu prompt personalizado</h2></div><ProviderBadge provider={result.provider} model={result.model} /></div>
      {result.notice && <p role="status" className="border-b border-ink bg-[#FFF7D6] p-4 text-sm leading-relaxed">{result.notice}</p>}
      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-9 lg:border-r-2 lg:border-ink">
          <div className="flex border-b border-ink" role="tablist" aria-label="Visualização do resultado"><button type="button" role="tab" aria-selected={tab === "prompt"} onClick={() => setTab("prompt")} className={`mono px-5 py-3 ${tab === "prompt" ? "bg-ink text-white" : "hover:bg-cobalt-dim"}`}>Prompt</button><button type="button" role="tab" aria-selected={tab === "como-usar"} onClick={() => setTab("como-usar")} className={`mono px-5 py-3 ${tab === "como-usar" ? "bg-ink text-white" : "hover:bg-cobalt-dim"}`}>Como usar</button></div>
          {tab === "prompt" ? <div role="tabpanel" tabIndex={0} className="pre-prompt min-h-96 p-6 md:p-8">{result.content}</div> : <div role="tabpanel" className="p-6 md:p-8"><ol className="space-y-5">{["Abra Claude Code, Codex, Cursor ou outro agente compatível com REA.", "Confirme que o REA está instalado e que o programa ou arquivo de destino está acessível no seu computador.", "Cole o prompt completo. Se houver algum caminho genérico, substitua pelo caminho real.", "Leia o plano antes de aprovar execução ou alterações.", "Revise as evidências e os itens marcados como desconhecidos antes de usar a conclusão."].map((item, index) => <li key={item} className="grid grid-cols-[34px_1fr] gap-3"><span className="mono grid size-8 place-items-center bg-cobalt-dim text-cobalt">{index + 1}</span><p className="text-sm leading-relaxed">{item}</p></li>)}</ol></div>}
        </div>
        <div className="flex flex-col gap-3 p-6 lg:col-span-3"><p className="mono mb-2 text-ink/50">AÇÕES</p><CopyButton text={result.content} className="poster-button bg-cobalt text-white hover:bg-ink" /><DownloadButton text={result.content} filename={`prompt-rea-${(result.appName || form.appName).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}.md`} /><button type="button" onClick={() => { setResult(null); setStep(3); }} className="poster-button bg-white hover-fill">Editar e gerar outro</button><button type="button" onClick={() => generate()} disabled={status === "loading"} className="poster-button bg-white hover-fill">Repetir geração</button></div>
      </div>
    </section>}

    <section className="container-poster border-x-2 border-b-2 border-ink">
      <div className="grid lg:grid-cols-12"><div className="border-b-2 border-ink p-6 md:p-8 lg:col-span-4 lg:border-b-0 lg:border-r-2"><p className="mono text-cobalt">COMO FUNCIONA POR TRÁS</p><h2 className="display-medium mt-4 text-4xl">Duas APIs gratuitas.<br />Nenhuma chave.</h2><p className="mt-5 text-sm leading-relaxed text-ink/60">A chamada acontece no servidor. Kilo e Pollinations são serviços externos, com limites e disponibilidade próprios.</p></div><div className="grid sm:grid-cols-3 lg:col-span-8">{providerOptions.slice(0, 3).map((item, index) => <div key={item.id} className="border-b border-ink p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><span className="mono text-cobalt">0{index + 1}</span><h3 className="mt-5 font-display text-xl font-semibold">{item.name}</h3><p className="mt-2 text-xs leading-relaxed text-ink/60">{item.text}.</p></div>)}</div></div>
    </section>

    {history.length > 0 && <section className="container-poster border-x-2 border-b-2 border-ink"><div className="border-b border-ink p-6"><p className="mono flex items-center gap-2 text-cobalt"><Clock3 size={15} aria-hidden="true" />HISTÓRICO RECENTE</p><h2 className="display-medium mt-2 text-3xl">Prompts gerados neste navegador</h2><p className="mt-2 text-xs text-ink/55">Guardados apenas no seu navegador. Limpar os dados do site apaga este histórico.</p></div><div className="grid md:grid-cols-2 lg:grid-cols-3">{history.map((item) => <button type="button" key={item.id} onClick={() => { setResult({ ...item, model: "histórico salvo" }); setTab("prompt"); document.getElementById("resultado")?.scrollIntoView({ behavior: "smooth" }); }} className="interactive-block border-b border-ink p-5 text-left md:border-r"><span className="mono text-[9px] text-ink/45">{new Date(item.createdAt).toLocaleDateString("pt-BR")} • {item.provider}</span><span className="mt-3 block font-display font-semibold">{item.appName}</span><span className="mt-1 line-clamp-2 block text-xs text-ink/60">{item.feature}</span><span className="mono mt-4 inline-flex items-center gap-1 text-cobalt">Abrir prompt <ChevronRight size={13} aria-hidden="true" /></span></button>)}</div></section>}
  </div>;
}

function StepHeading({ number, title, text }: { number: string; title: string; text: string }) {
  return <div><p className="mono text-cobalt">{number}</p><h2 className="display-medium mt-4 max-w-2xl text-4xl md:text-5xl">{title}</h2><p className="mt-4 text-sm text-ink/60">{text}</p></div>;
}
function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div><dt className="mono text-[9px] text-ink/40">{label}</dt><dd className="mt-1 break-words text-sm font-medium leading-snug">{value}</dd></div>;
}
function InfoBox({ title, text }: { title: string; text: string }) {
  return <div className="border-l-4 border-cobalt bg-cobalt-wash p-4"><p className="font-display font-semibold text-cobalt">{title}</p><p className="mt-1 text-xs leading-relaxed text-ink/65">{text}</p></div>;
}
function ProviderBadge({ provider, model }: { provider: string; model: string }) {
  const name = provider === "kilo" ? "Gerado com Kilo Gateway" : provider === "pollinations" ? "Gerado com Pollinations" : "Roteiro estruturado localmente";
  return <div className="border border-ink px-4 py-3"><p className="mono flex items-center gap-2 text-cobalt">{provider === "local" ? <FileText size={15} aria-hidden="true" /> : <Globe2 size={15} aria-hidden="true" />}{name}</p><p className="mt-1 break-all font-mono text-[10px] text-ink/45">{model}</p></div>;
}
