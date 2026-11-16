import type { Metadata } from "next";
import { PromptLibrary } from "@/components/prompt-library";

export const metadata: Metadata = {
  title: "55 prompts REA em português",
  description: "Biblioteca completa de prompts de engenharia reversa explicados para iniciantes, com campos editáveis e cópia.",
};

export default function PromptsPage() {
  return <main><PromptLibrary /></main>;
}
