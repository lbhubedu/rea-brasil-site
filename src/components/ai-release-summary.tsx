"use client";

import { useEffect, useState } from "react";

type SummaryState = { status: "loading" | "ok" | "hidden"; summary?: string; provider?: string; model?: string };

// Resumo opcional, claramente identificado como texto de IA. Se o serviço
// falhar, o quadro simplesmente não aparece: os dados originais seguem visíveis.
export function AiReleaseSummary() {
  const [state, setState] = useState<SummaryState>({ status: "loading" });
  useEffect(() => {
    fetch("/api/novidades-resumo")
      .then(async (response) => {
        if (!response.ok) throw new Error("indisponível");
        const data = await response.json() as { summary?: string; provider?: string; model?: string };
        if (!data.summary) throw new Error("vazio");
        setState({ status: "ok", summary: data.summary, provider: data.provider, model: data.model });
      })
      .catch(() => setState({ status: "hidden" }));
  }, []);
  if (state.status !== "ok") return null;
  return <section className="container-poster border-x-2 border-b-2 border-ink">
    <div className="bg-cobalt-wash p-6 md:p-8">
      <p className="mono text-cobalt">RESUMO GERADO POR IA • PODE CONTER ERROS</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed pretty-text">{state.summary}</p>
      <p className="mono mt-4 text-[10px] text-ink/50">GERADO POR {state.provider?.toUpperCase()} ({state.model}) • RESUMIU APENAS AS RELEASES EXIBIDAS ABAIXO</p>
    </div>
  </section>;
}
