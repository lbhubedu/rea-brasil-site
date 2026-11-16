"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

function voterKey() {
  const key = "rea-br-voter";
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID(); localStorage.setItem(key, value); }
  return value;
}

export function VoteButton({ slug, initialVotes = 0, compact = false }: { slug: string; initialVotes?: number; compact?: boolean }) {
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    // Leitura pós-hidratação: evita setState síncrono no effect e divergência de SSR.
    queueMicrotask(() => {
      if (cancelled) return;
      try { setVoted((JSON.parse(localStorage.getItem("rea-br-voted") || "[]") as string[]).includes(slug)); } catch { /* armazenamento pode estar bloqueado */ }
    });
    fetch("/api/votes").then((response) => response.json()).then((data: { votes?: Record<string, number> }) => { if (!cancelled) setVotes(data.votes?.[slug] ?? 0); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [slug]);
  async function vote() {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/votes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, voterKey: voterKey() }) });
      const data = await response.json() as { voted?: boolean; votes?: number; error?: string };
      if (!response.ok) throw new Error(data.error || "Erro ao votar");
      setVotes(data.votes ?? 0); setVoted(Boolean(data.voted));
      const saved = JSON.parse(localStorage.getItem("rea-br-voted") || "[]") as string[];
      localStorage.setItem("rea-br-voted", JSON.stringify(data.voted ? [...new Set([...saved, slug])] : saved.filter((item) => item !== slug)));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Erro ao votar"); }
    finally { setBusy(false); }
  }
  return <span className="inline-flex flex-col items-start gap-1">
    <button type="button" onClick={vote} disabled={busy} aria-pressed={voted} aria-label={`${voted ? "Retirar voto de" : "Votar em"} ${slug}. ${votes} votos`} className={`mono inline-flex items-center gap-1.5 border px-2.5 py-1.5 transition-colors ${voted ? "border-cobalt bg-cobalt text-white" : "border-ink/30 hover:border-cobalt hover:text-cobalt"} ${compact ? "text-[10px]" : ""}`}><ArrowUp size={14} strokeWidth={2.5} aria-hidden="true" />{votes}</button>
    {error && <span role="alert" className="text-[10px] text-red-700">{error}</span>}
  </span>;
}
