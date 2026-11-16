export type AiProvider = "kilo" | "pollinations";

export type AiResult = {
  content: string;
  provider: AiProvider;
  model: string;
};

export type AiFailure = {
  provider: AiProvider;
  message: string;
};

type ChatResponse = {
  choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  error?: { message?: string } | string;
  model?: string;
};

function extractContent(data: ChatResponse) {
  const content = data.choices?.[0]?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) return content.map((part) => part.text ?? "").join("").trim();
  return "";
}

async function chat(url: string, model: string, system: string, user: string, timeoutMs: number) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      temperature: 0.35,
      max_tokens: 1600,
      stream: false,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await response.text();
  let data: ChatResponse = {};
  try { data = JSON.parse(text) as ChatResponse; } catch { /* o provedor pode devolver erro em texto puro */ }
  if (!response.ok) {
    const providerError = typeof data.error === "string" ? data.error : data.error?.message;
    const retryAfter = response.headers.get("retry-after");
    throw new Error(`${providerError || text.slice(0, 200) || `serviço respondeu ${response.status}`}${retryAfter ? ` (tente novamente em ${retryAfter}s)` : ""}`);
  }
  const content = extractContent(data) || (!data.choices && text.length > 30 ? text.trim() : "");
  if (!content) throw new Error("serviço respondeu sem conteúdo");
  return { content, model: data.model || model };
}

// Endpoints oficiais documentados: Kilo permite acesso anônimo apenas a modelos
// gratuitos (200 req/h por IP); a API clássica da Pollinations permite texto
// anônimo espaçado (mínimo ~30s entre chamadas, por IP). Nenhum dos dois é
// garantido; a chamadora precisa tratar falha e nunca inventar conteúdo.
const KILO_ENDPOINT = "https://ai-gateway.kilo.ai/api/v1/chat/completions";
const KILO_MODEL = "kilo-auto/free";
const POLLINATIONS_ENDPOINT = "https://text.pollinations.ai/openai";
const POLLINATIONS_MODEL = "openai-fast";

export async function askAi(options: { system: string; user: string; order?: AiProvider[]; timeoutMs?: number }): Promise<AiResult> {
  const order = options.order ?? ["kilo", "pollinations"];
  const timeoutMs = options.timeoutMs ?? 45000;
  const failures: AiFailure[] = [];
  for (const provider of order) {
    try {
      if (provider === "kilo") {
        const result = await chat(KILO_ENDPOINT, KILO_MODEL, options.system, options.user, timeoutMs);
        return { content: result.content, provider: "kilo", model: result.model };
      }
      const result = await chat(POLLINATIONS_ENDPOINT, POLLINATIONS_MODEL, options.system, options.user, timeoutMs);
      return { content: result.content, provider: "pollinations", model: result.model };
    } catch (error) {
      failures.push({ provider, message: error instanceof Error ? error.message : "falha desconhecida" });
    }
  }
  throw new Error(failures.map((failure) => `${failure.provider}: ${failure.message}`).join(" | "));
}
