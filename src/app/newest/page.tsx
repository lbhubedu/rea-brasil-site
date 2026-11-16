import type { Metadata } from "next";
import { builds } from "@/data/catalog";
import { PagedDirectory } from "@/components/paged-directory";

export const metadata: Metadata = { title: "Projetos mais recentes" };
export default function NewestPage() {
  return <PagedDirectory items={builds} page={1} basePath="/newest" title="Mais recentes" description="As últimas investigações, ferramentas e reconstruções adicionadas ao diretório. Cada item tem sua fonte original e uma explicação em português." />;
}
