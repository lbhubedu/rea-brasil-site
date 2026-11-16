"use client";

import { ArrowRight, Check } from "lucide-react";
import { FormEvent, useState } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), website: data.get("website") }) });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível inscrever.");
      setStatus("success"); setMessage(result.message || "Inscrição confirmada."); form.reset();
    } catch (error) {
      setStatus("error"); setMessage(error instanceof Error ? error.message : "Tente novamente.");
    }
  }
  return <form onSubmit={subscribe} className="w-full">
    <div className={`flex flex-col gap-2 sm:flex-row ${status === "success" ? "hidden" : ""}`}>
      <label className="sr-only" htmlFor={dark ? "email-footer-dark" : "email-footer"}>Seu e-mail</label>
      <input id={dark ? "email-footer-dark" : "email-footer"} name="email" type="email" autoComplete="email" required placeholder="seu@email.com.br" className={`poster-input ${dark ? "border-white/50 bg-transparent text-white placeholder:text-white/60" : ""}`} />
      <div className="absolute -left-[10000px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button disabled={status === "loading"} type="submit" className={`poster-button shrink-0 ${dark ? "border-white bg-white text-ink hover:bg-cobalt hover:text-white" : "bg-ink text-white hover:bg-cobalt"}`}>{status === "loading" ? "Enviando…" : <>Assinar <ArrowRight size={16} aria-hidden="true" /></>}</button>
    </div>
    {(status === "success" || status === "error") && <p role="status" className={`mt-3 flex items-center gap-2 text-sm ${status === "error" ? "text-red-700" : dark ? "text-white" : "text-cobalt"}`}>{status === "success" && <Check size={17} aria-hidden="true" />}{message}</p>}
  </form>;
}
