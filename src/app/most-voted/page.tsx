import type { Metadata } from "next";
import { PagedDirectory } from "@/components/paged-directory";
import { buildsByVotes } from "@/lib/votes";
import { builds } from "@/data/catalog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projetos mais votados" };
export default async function MostVotedPage() {
  let items = builds;
  let degraded = false;
  try {
    items = await buildsByVotes();
  } catch {
    // Sem banco (ou indisponível), mostra a ordem padrão em vez de quebrar a página.
    degraded = true;
  }
  return <PagedDirectory items={items} page={1} basePath="/most-voted" title="Mais votados" description={degraded ? "A contagem de votos está temporariamente indisponível; a ordem abaixo é a padrão do diretório. Os votos continuam sendo registrados quando o banco responde." : "A comunidade da versão brasileira escolhe os projetos mais úteis. Os votos são registrados no banco e você pode retirar o seu voto quando quiser."} />;
}
