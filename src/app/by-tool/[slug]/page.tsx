import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { builds } from "@/data/catalog";
import { DirectoryBrowser } from "@/components/directory-browser";

const toolNames: Record<string, { name: string; terms: string[] }> = {
  rea: { name: "REA", terms: ["rea"] }, leanrea: { name: "leanrea", terms: ["leanrea"] }, "ghidra-mcp": { name: "Ghidra MCP", terms: ["ghidra"] }, "ida-mcp": { name: "IDA MCP", terms: ["ida"] }, "binary-ninja-mcp": { name: "Binary Ninja MCP", terms: ["binary ninja"] }, "radare2-mcp": { name: "radare2 MCP", terms: ["radare2"] }, "jadx-mcp": { name: "JADX MCP", terms: ["jadx"] }, "x64dbg-mcp": { name: "x64dbg MCP", terms: ["x64dbg"] }, other: { name: "Outras ferramentas de IA", terms: ["claude", "codex", "gemini", "agente"] },
};
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: `Projetos com ${toolNames[slug]?.name ?? "ferramenta"}` }; }
export default async function ByToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolNames[slug];
  if (!tool) notFound();
  const items = builds.filter((build) => tool.terms.some((term) => `${build.tool ?? ""} ${build.summary}`.toLowerCase().includes(term)));
  return <main><section className="container-poster border-x-2 border-b-2 border-ink"><div className="p-7 py-10 md:p-10"><p className="mono text-cobalt">EXPLORAR POR FERRAMENTA</p><h1 className="display mt-5 text-6xl md:text-8xl">{tool.name}</h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/65">Projetos cuja descrição ou ficha menciona esta ferramenta. Consulte a fonte original para a configuração exata usada pelo autor.</p></div></section><DirectoryBrowser items={items} showCategories={false} title={`Projetos com ${tool.name}`} /></main>;
}
