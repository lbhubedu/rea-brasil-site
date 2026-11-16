import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PagedDirectory } from "@/components/paged-directory";
import { buildsByVotes } from "@/lib/votes";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> { const { page } = await params; return { title: `Mais votados — página ${page}` }; }
export default async function MostVotedPagedPage({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  const items = await buildsByVotes();
  if (!Number.isInteger(page) || page < 2 || page > Math.ceil(items.length / 8)) notFound();
  return <PagedDirectory items={items} page={page} basePath="/most-voted" title="Mais votados" description="Projetos ordenados pelos votos reais registrados pela comunidade da Rea Brasil LB." />;
}
