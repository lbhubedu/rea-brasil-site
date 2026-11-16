import { askAi, type AiProvider } from "@/lib/ai-providers";

export type Provider = "auto" | "kilo" | "pollinations" | "local";
export type ActualProvider = Exclude<Provider, "auto">;

export type GeneratorInput = {
  appName: string;
  appType: string;
  feature: string;
  objective: string;
  audience: string;
  deliverable: string;
  details: string;
};

const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export function parseGeneratorInput(body: unknown): GeneratorInput | null {
  if (!body || typeof body !== "object") return null;
  const data = body as Record<string, unknown>;
  const input: GeneratorInput = {
    appName: clean(data.appName, 120),
    appType: clean(data.appType, 60),
    feature: clean(data.feature, 240),
    objective: clean(data.objective, 80),
    audience: clean(data.audience, 60),
    deliverable: clean(data.deliverable, 80),
    details: clean(data.details, 1800),
  };
  if (input.appName.length < 2 || input.feature.length < 3) return null;
  return input;
}

const objectiveText: Record<string, string> = {
  entender: "Entender como o recurso funciona e explicar cada etapa em linguagem simples.",
  reconstruir: "Criar uma especificação de sala limpa e reconstruir o comportamento sem copiar código, identidade visual ou recursos protegidos.",
  comparar: "Comparar duas versões ou uma implementação própria com o comportamento observado, listando diferenças e testes.",
  seguranca: "Fazer uma revisão defensiva autorizada, sem explorar, contornar licenças ou atacar sistemas.",
  automatizar: "Documentar a integração necessária e criar a menor automação possível para um ambiente próprio.",
};

const deliverableText: Record<string, string> = {
  explicacao: "Uma explicação para iniciantes, com glossário dos termos que aparecerem.",
  especificacao: "Um arquivo ESPECIFICACAO.md com requisitos, evidências, dúvidas e critérios de aceite.",
  plano: "Um plano de investigação dividido em etapas pequenas, ordenadas por redução de incerteza.",
  teste: "Um exemplo mínimo executável e testes que comparem entradas, saídas, erros e limites.",
  relatorio: "Um relatório com fatos confirmados, inferências, pontos desconhecidos e evidências.",
};

export function buildLocalPrompt(input: GeneratorInput) {
  const objective = objectiveText[input.objective] ?? objectiveText.entender;
  const deliverable = deliverableText[input.deliverable] ?? deliverableText.explicacao;
  return `Use o REA para investigar "${input.feature}" em ${input.appName} (${input.appType || "aplicativo"}).

CONTEXTO E AUTORIZAÇÃO
Este pedido se limita a um programa, site ou dispositivo que eu possua, que é aberto ou que tenho autorização explícita para analisar. Não contorne licenças, pagamentos, controles de acesso ou proteções de terceiros.

OBJETIVO
${objective}

COMO INVESTIGAR
1. Verifique quais ferramentas do REA estão realmente disponíveis e informe suas limitações.
2. Comece pela análise estática. Não execute, altere ou envie dados ao alvo sem pedir minha aprovação.
3. Encontre o ponto de entrada de "${input.feature}" e acompanhe o fluxo até o resultado observável.
4. Explique cada etapa para uma pessoa ${input.audience || "iniciante"}. Ao usar um termo técnico, traduza-o em uma frase curta.
5. Para cada conclusão, cite arquivo, função, endereço, requisição ou observação que permita conferi-la.
6. Separe o relatório em FATOS CONFIRMADOS, INFERÊNCIAS e PONTOS DESCONHECIDOS.
${input.details ? `\nDETALHES FORNECIDOS POR MIM\n${input.details}\n` : ""}
ENTREGA FINAL
${deliverable}
Inclua também os próximos três passos e o menor teste capaz de confirmar se a explicação está correta. Não declare equivalência ou vulnerabilidade sem validação suficiente.`;
}

function userMessage(input: GeneratorInput) {
  return `Crie um prompt pronto para copiar e colar em um agente com REA.\n\nDados fornecidos:\n${JSON.stringify(input, null, 2)}\n\nO prompt gerado deve ser específico para esse app/site e esse recurso. Não responda à investigação: escreva apenas o prompt que outra pessoa usará.`;
}

const systemMessage = `Você é o redator de prompts da Rea Brasil LB. Escreva em português do Brasil, para pessoas leigas, com instruções claras e bem organizadas. O resultado deve ser somente um prompt completo e diretamente utilizável, sem introdução sobre sua tarefa e sem blocos markdown externos. O prompt deve pedir uso do REA, uma investigação de apenas um recurso, análise estática primeiro, evidências para cada conclusão e separação entre fatos, inferências e desconhecidos. Adapte os passos ao tipo de alvo e à entrega pedida. Exija escopo autorizado e nunca proponha pirataria, bypass de licença, fraude, ataque, evasão de anti-cheat ou acesso não autorizado. Não invente caminhos, funções, vulnerabilidades ou resultados: isso é um pedido de investigação futura.`;

export async function generatePrompt(input: GeneratorInput, provider: Provider): Promise<{ content: string; provider: ActualProvider; model: string; notice?: string }> {
  if (provider === "local") return { content: buildLocalPrompt(input), provider: "local", model: "roteiro-estruturado-v1" };
  const order: AiProvider[] = provider === "auto" ? ["kilo", "pollinations"] : [provider];
  try {
    const result = await askAi({ system: systemMessage, user: userMessage(input), order, timeoutMs: 45000 });
    return { content: result.content, provider: result.provider, model: result.model };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "falha desconhecida";
    return {
      content: buildLocalPrompt(input),
      provider: "local",
      model: "roteiro-estruturado-v1",
      notice: `Os serviços de IA gratuitos não responderam agora. Criamos um roteiro estruturado localmente — ele não é uma resposta de IA. Detalhes: ${detail}`,
    };
  }
}
