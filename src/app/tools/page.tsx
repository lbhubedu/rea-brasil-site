import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools-explorer";
export const metadata: Metadata = { title: "Ferramentas de engenharia reversa com IA", description: "Compare REA, Ghidra, IDA, radare2, JADX, x64dbg e outras ferramentas." };
export default function ToolsPage() { return <main><ToolsExplorer /></main>; }
