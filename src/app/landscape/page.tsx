import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools-explorer";
export const metadata: Metadata = { title: "Panorama de ferramentas REA" };
export default function LandscapePage() { return <main><ToolsExplorer /></main>; }
