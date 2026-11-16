import { askAi } from "@/lib/ai-providers";
import { rateLimit } from "@/lib/rate-limit";
import { guides, tools } from "@/data/content";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const siteContext = {
  paginas: [
    { caminho: "/prompts", descricao: "Biblioteca com 55 prompts prontos, por categoria e ferramenta" },
    { caminho: "/gerador", descricao: "Gerador de prompt personalizado em três etapas" },
    { caminho: "/guides", descricao: "Guias para iniciantes em português" },
    { caminho: "/tools", descricao: "Comparação de ferramentas de engenharia reversa" },
    { caminho: "/newest", descricao: "Projetos mais recentes do diretório" },
    { caminho: "/most-voted", descricao: "Projetos mais votados pela comunidade" },
    { caminho: "/submit", descricao: "Enviar um projeto para o diretório" },
    { caminho: "/about", descricao: "Sobre o diretório e perguntas institucionais" },
    { caminho: "/novidades", descricao: "Lançamentos oficiais recentes, lidos do GitHub" },
  ],
  guias: guides.map((guide) => ({ titulo: guide.title, caminho: `/guides/${guide.slug}` })),
  ferramentas: tools.map((tool) => ({ nome: tool.name, caminho: `/tools/${tool.slug}`, alvos: tool.targets })),
};

const systemMessage = `Você é o assistente de dúvidas do site Rea Brasil LB, um diretório em português sobre engenharia reversa com agentes de IA e sobre a ferramenta REA (Reverse Engineer Anything, github.com/morluto/rea). Escreva em português do Brasil, para pessoas leigas, com respostas curtas (no máximo 180 palavras), sem markdown pesado e sem listas longas.

REGRAS ABSOLUTAS
- Baseie a resposta apenas no contexto do site fornecido e em conhecimento geral seguro sobre as ferramentas citadas nele.
- Quando não souber ou o site não cobrir a pergunta, diga claramente que não sabe e aponte a página ou guia mais próximo. Nunca invente links, comandos, nomes de função, versões ou resultados.
- Não dê instruções para piratear, quebrar licenças, contornar proteções de pagamento, atacar sistemas ou analisar software sem autorização. Se a pergunta pedir isso, recuse com uma frase e explique o escopo autorizado (software próprio, aberto ou com autorização explícita).
- Não declare vulnerabilidades, equivalências ou conclusões técnicas que exijam investigação real com evidências.
- Se perguntarem sobre privacidade ou dados, informe que o REA analisa localmente, mas o que você digitar nesta página é enviado a serviços de IA de terceiros e não é salvo por nós.`;

export async function POST(request: Request) {
  const limit = rateLimit(request, "duvidas", 4, 300000);
  if (!limit.ok) {
    return Response.json({ error: `Muitas perguntas seguidas deste endereço. Tente novamente em ${limit.retryAfterSeconds} segundos.` }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } });
  }
  try {
    const body = await request.json() as { question?: string };
    const question = typeof body.question === "string" ? body.question.trim().slice(0, 500) : "";
    if (question.length < 8) {
      return Response.json({ error: "Escreva sua dúvida com pelo menos 8 letras." }, { status: 400 });
    }
    const result = await askAi({ system: systemMessage, user: `Contexto do site:\n${JSON.stringify(siteContext)}\n\nPergunta do visitante: ${question}`, timeoutMs: 40000 });
    return Response.json({ answer: result.content, provider: result.provider, model: result.model });
  } catch (error) {
    console.error("duvidas", error);
    return Response.json({
      error: "O serviço de IA gratuito não respondeu agora. Nada foi salvo. Consulte os guias ou tente novamente em alguns minutos.",
      suggestions: [
        { label: "Guias para iniciantes", href: "/guides" },
        { label: "O que é REA", href: "/guides/what-is-rea" },
        { label: "Como usar o REA", href: "/guides/how-to-use-rea" },
        { label: "Comparar ferramentas", href: "/tools" },
      ],
    }, { status: 503 });
  }
}
