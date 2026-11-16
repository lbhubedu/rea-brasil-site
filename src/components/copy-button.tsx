"use client";

import { Check, Copy, Download } from "lucide-react";
import { useState } from "react";

export function CopyButton({ text, label = "Copiar prompt", className = "border border-ink bg-white px-4 py-2 hover-fill" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true); setError(false);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError(true);
    }
  }
  return <button type="button" onClick={copy} className={`mono inline-flex items-center gap-2 ${className}`} aria-live="polite">{copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{copied ? "Copiado" : error ? "Selecione e copie" : label}</button>;
}

export function DownloadButton({ text, filename, label = "Baixar .md" }: { text: string; filename: string; label?: string }) {
  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.click();
    URL.revokeObjectURL(url);
  }
  return <button type="button" onClick={download} className="mono inline-flex items-center gap-2 border border-ink bg-white px-4 py-2 hover-fill"><Download size={15} aria-hidden="true" />{label}</button>;
}
