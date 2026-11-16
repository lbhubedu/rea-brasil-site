"use client";

import { ArrowUpRight, LoaderCircle, MessageCircleQuestion, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";

type Suggestion = { label: string; href: string };
type Answer = { answer: string; provider: string; model: string };
type ApiError = { error: string; suggestions?: Suggestion[] };

const examples = [
  "Como instalo o REA no meu agente de programação?",
  "Qual ferramenta gratuita começa a análise de um APK Android?",
  "O que é análise estática e em que difere da dinâmica?",
];

export function DuvidasForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  async function ask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading"); setError(""); setSuggestions([]); setAnswer(null);
    try {
      const response = await fetch("/api/duvidas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const data = await response.json() as Answer & ApiError;
      if (!response.ok) {
        setError(data.error || "Não foi possível responder agora.");
        if (data.suggestions) setSuggestions(data.suggestions);
        return;
      }
      setAnswer({ answer: data.answer, provider: data.provider, model: data.model });
    } catch {
      setError("Não foi possível enviar a pergunta. Verifique sua conexão e tente novamente.");
    } finally {
      setStatus("idle");
    }
  }

  return <section className="container-poster border-x-2 border-b-2 border-ink" aria-labelledby="duvidas-form-title">
    <form onSubmit={ask} className="border-b-2 border-ink p-6 md:p-8">
      <p className="mono flex items-center gap-2 text-cobalt"><MessageCircleQuestion size={16} aria-hidden="true" />SUA PERGUNTA</p>
      <h2 id="duvidas-form-title" className="display-medium mt-3 text-4xl">Pergunte em uma frase</h2>
      <label className="sr-only" htmlFor="duvidas-question">Sua dúvida</label>
      <textarea
        id="duvidas-question"
        className="poster-input mt-6 min-h-28 resize-y"
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ex.: como faço para o REA analisar um app que eu mesmo desenvolvi?"
        maxLength={500}
        required
      />
      <p className="mt-2 text-right text-xs text-ink/45">{question.length}/500</p>
      <div className="mt-3 flex flex-wrap gap-2">{examples.map((example) => <button key={example} type="button" onClick={() => setQuestion(example)} className="border border-ink/30 px-3 py-1.5 text-xs text-ink/60 transition-colors hover:border-cobalt hover:text-cobalt">{example}</button>)}</div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink/55"><ShieldCheck size={14} className="mr-1 inline text-cobalt" aria-hidden="true" />Enviamos a pergunta ao serviço de IA, sem salvar. Resposta em até ~40 segundos.</p>
        <button type="submit" disabled={status === "loading" || question.trim().length < 8} className="poster-button min-h-12 shrink-0 bg-cobalt text-white hover:bg-ink">
          {status === "loading" ? <><LoaderCircle className="animate-spin" size={16} aria-hidden="true" /> Perguntando…</> : <>Enviar pergunta <ArrowUpRight size={16} aria-hidden="true" /></>}
        </button>
      </div>
      {status === "loading" && <div role="status" className="mt-5"><div className="loading-bar h-1 bg-cobalt-dim" /><p className="mt-3 text-xs text-ink/55">Consultando os serviços gratuitos de IA. Se ambos estiverem ocupados, avisaremos — nada é inventado.</p></div>}
    </form>

    {answer && <div className="border-b-2 border-ink bg-white p-6 md:p-8">
      <p className="mono text-cobalt">RESPOSTA</p>
      <p className="mt-4 max-w-3xl whitespace-pre-wrap text-base leading-relaxed pretty-text">{answer.answer}</p>
      <p className="mono mt-5 text-[10px] text-ink/50">GERADO POR {answer.provider.toUpperCase()} ({answer.model}) • TEXTO DE IA, PODE CONTER ERROS • NADA FOI SALVO</p>
    </div>}

    {error && <div role="alert" className="p-6 md:p-8">
      <p className="border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-800">{error}</p>
      {suggestions.length > 0 ? <div className="mt-4 flex flex-wrap gap-2">{suggestions.map((item) => <a key={item.href} href={item.href} className="border border-ink px-4 py-2 text-xs transition-colors hover:bg-cobalt-dim hover:text-cobalt">{item.label}</a>)}</div> : null}
    </div>}
  </section>;
}
