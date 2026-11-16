import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { builds } from "@/data/catalog";
import { PagedDirectory } from "@/components/paged-directory";

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page } = await params; return { title: `Mais recentes — página ${page}` }; }
export default async function NewestPagedPage({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 2 || page > Math.ceil(builds.length / 8)) notFound();
  return <PagedDirectory items={builds} page={page} basePath="/newest" title="Mais recentes" description="Navegue pelas investigações, ferramentas e reconstruções reais em ordem de chegada ao diretório." />;
}
