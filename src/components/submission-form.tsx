"use client";

import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { categories } from "@/data/catalog";

export function SubmissionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setStatus("loading"); setMessage("");
    try {
      const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = await response.json() as { id?: string; message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar.");
      setReceipt(data.id || ""); setMessage(data.message || "Projeto recebido."); setStatus("success"); form.reset();
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Tente novamente."); }
  }
  if (status === "success") return <div className="border-2 border-ink bg-cobalt-dim p-7" role="status"><CheckCircle2 size={38} className="text-cobalt" aria-hidden="true" /><h2 className="display-medium mt-5 text-4xl">Link recebido.</h2><p className="mt-4 text-sm leading-relaxed">{message}</p>{receipt && <p className="mono mt-5 break-all border-t border-cobalt/20 pt-4 text-[9px] text-cobalt">PROTOCOLO: {receipt}</p>}<p className="mt-4 text-xs text-ink/60">Status atual: pendente de revisão. O envio não garante inclusão no diretório.</p><button type="button" onClick={() => setStatus("idle")} className="poster-button mt-6 bg-white hover-fill">Enviar outro projeto</button></div>;
  return <form onSubmit={submit} className="space-y-5">
    <div><label htmlFor="url" className="mono mb-2 block">Link do projeto *</label><input id="url" name="url" type="url" required className="poster-input" placeholder="https://github.com/voce/seu-projeto" /><p className="mt-2 text-xs text-ink/55">Pode ser repositório, artigo, vídeo, publicação ou demonstração pública.</p></div>
    <div><label htmlFor="title" className="mono mb-2 block">Nome do projeto *</label><input id="title" name="title" required minLength={3} maxLength={180} className="poster-input" placeholder="Como devemos chamar esse trabalho?" /></div>
    <div><label htmlFor="category" className="mono mb-2 block">Caso de uso *</label><select id="category" name="category" required className="poster-input" defaultValue=""><option value="" disabled>Escolha a categoria mais próxima</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></div>
    <div><label htmlFor="description" className="mono mb-2 block">O que foi investigado ou construído? *</label><textarea id="description" name="description" required minLength={40} maxLength={1800} className="poster-input min-h-36 resize-y" placeholder="Conte qual foi o alvo, como um agente de IA participou, o que você descobriu e onde estão as evidências. Mínimo de 40 caracteres." /></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="author" className="mono mb-2 block">Seu nome ou usuário</label><input id="author" name="author" maxLength={120} className="poster-input" placeholder="Como creditar você" /></div><div><label htmlFor="email" className="mono mb-2 block">E-mail (opcional)</label><input id="email" name="email" type="email" className="poster-input" placeholder="Para dúvidas da curadoria" /></div></div>
    <label className="flex items-start gap-3 text-xs leading-relaxed text-ink/65"><input type="checkbox" required className="mt-1 size-4 shrink-0 accent-cobalt" /><span>Confirmo que o conteúdo mostra engenharia reversa com participação de um agente de IA, não viola direitos de terceiros e pode ser lido publicamente pela curadoria.</span></label>
    {status === "error" && <p role="alert" className="border-l-4 border-red-600 bg-red-50 p-3 text-sm text-red-800">{message}</p>}
    <button type="submit" disabled={status === "loading"} className="poster-button min-h-14 w-full bg-cobalt text-white hover:bg-ink">{status === "loading" ? <><LoaderCircle className="animate-spin" size={18} aria-hidden="true" />Registrando envio…</> : <>Enviar para revisão <ArrowRight size={18} aria-hidden="true" /></>}</button>
  </form>;
}
