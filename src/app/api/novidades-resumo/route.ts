import { askAi } from "@/lib/ai-providers";
import { fetchOfficialReleases } from "@/lib/releases";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

type CachedSummary = { summary: string; provider: string; model: string; expiresAt: number };

const globalForSummary = globalThis as typeof globalThis & { __reaNovidadesResumo?: CachedSummary };
const TTL_MS = 6 * 60 * 60 * 1000;

const systemMessage = `Você é o redator de resumos do site Rea Brasil LB. Escreva em português do Brasil, para pessoas leigas. Você receberá uma lista de lançamentos oficiais recentes de ferramentas de engenharia reversa (REA, Ghidra, Frida), extraída das APIs públicas do GitHub. Escreva de duas a três frases curtas destacando os lançamentos mais recentes. Regras absolutas: use somente os dados da lista; não invente versões, datas, recursos ou nomes; não acrescente contexto que não esteja na lista; se a lista estiver incompleta, resuma apenas o que está nela; não use markdown.`;

export async function GET(request: Request) {
  const limit = rateLimit(request, "novidades-resumo", 10, 60000);
  if (!limit.ok) {
    return Response.json({ error: "Aguarde antes de pedir outro resumo." }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }
  const cached = globalForSummary.__reaNovidadesResumo;
  if (cached && cached.expiresAt > Date.now()) {
    return Response.json({ summary: cached.summary, provider: cached.provider, model: cached.model, cached: true });
  }
  try {
    const { releases } = await fetchOfficialReleases();
    if (releases.length === 0) {
      return Response.json({ error: "Nenhuma release disponível agora." }, { status: 503 });
    }
    const compact = releases.slice(0, 8).map((release) => ({ ferramenta: release.label, titulo: release.title, versao: release.tagName, data: release.publishedAt, trecho: release.summary.slice(0, 200) }));
    const result = await askAi({ system: systemMessage, user: `Lista de lançamentos:\n${JSON.stringify(compact, null, 2)}`, timeoutMs: 45000 });
    const summary = result.content.slice(0, 1200);
    globalForSummary.__reaNovidadesResumo = { summary, provider: result.provider, model: result.model, expiresAt: Date.now() + TTL_MS };
    return Response.json({ summary, provider: result.provider, model: result.model });
  } catch (error) {
    console.error("novidades-resumo", error);
    return Response.json({ error: "O serviço de IA não respondeu agora. Os dados originais seguem na página." }, { status: 503 });
  }
}
