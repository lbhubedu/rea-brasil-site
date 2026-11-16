import type { Metadata } from "next";
import { PromptGenerator } from "@/components/prompt-generator";

export const metadata: Metadata = {
  title: "Gerador de prompts personalizado",
  description: "Crie um prompt REA para um app ou site específico com Kilo Gateway ou Pollinations, sem chave de API.",
};

export default function GeneratorPage() {
  return <main><PromptGenerator /></main>;
}
