// Limitador fixo em memória, por instância. É uma proteção de melhor esforço:
// em serverless cada instância tem seu próprio contador. A Vercel também
// oferece regra de rate limit no WAF, configurada por projeto (ver README).
type Bucket = { count: number; resetAt: number };

const globalForLimiter = globalThis as typeof globalThis & { __reaBrasilRateBuckets?: Map<string, Bucket> };
const buckets = globalForLimiter.__reaBrasilRateBuckets ?? new Map<string, Bucket>();
globalForLimiter.__reaBrasilRateBuckets = buckets;

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";
  return forwarded.split(",")[0]?.trim() || "desconhecido";
}

export function rateLimit(request: Request, scope: string, limit: number, windowMs: number): { ok: boolean; retryAfterSeconds: number } {
  const key = `${scope}:${clientKey(request)}`;
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 5000) {
      for (const [staleKey, staleBucket] of buckets) if (staleBucket.resetAt <= now) buckets.delete(staleKey);
    }
    return { ok: true, retryAfterSeconds: 0 };
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  bucket.count += 1;
  return { ok: true, retryAfterSeconds: 0 };
}
