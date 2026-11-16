import { generatePrompt, parseGeneratorInput, type Provider } from "@/lib/prompt-generator";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function POST(request: Request) {
  const limit = rateLimit(request, "generate", 5, 300000);
  if (!limit.ok) {
    return Response.json({ error: `Muitas gerações seguidas deste endereço. Tente novamente em ${limit.retryAfterSeconds} segundos.` }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.authorized !== true) {
      return Response.json({ error: "Confirme que você tem autorização para analisar o alvo." }, { status: 400 });
    }
    const input = parseGeneratorInput(body);
    if (!input) {
      return Response.json({ error: "Informe o nome do app ou site (mínimo 2 letras) e o recurso (mínimo 3 letras)." }, { status: 400 });
    }
    const allowed: Provider[] = ["auto", "kilo", "pollinations", "local"];
    const provider = allowed.includes(body.provider as Provider) ? body.provider as Provider : "auto";
    const result = await generatePrompt(input, provider);
    // Privacidade: o prompt não é salvo em banco nem exposto em histórico
    // público. O pedido vai ao provedor de IA escolhido; o rascunho fica só no
    // navegador do visitante.
    return Response.json({ content: result.content, provider: result.provider, model: result.model, notice: result.notice });
  } catch (error) {
    console.error("generate prompt", error);
    return Response.json({ error: "Não foi possível gerar o prompt agora. Tente novamente." }, { status: 500 });
  }
}
