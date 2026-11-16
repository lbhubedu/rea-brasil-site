import { db } from "@/db";
import { buildVotes } from "@/db/schema";
import { getBuild } from "@/data/catalog";
import { and, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select({ slug: buildVotes.buildSlug, votes: sql<number>`count(*)::int` }).from(buildVotes).groupBy(buildVotes.buildSlug);
  return Response.json({ votes: Object.fromEntries(rows.map((row) => [row.slug, row.votes])) });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { slug?: string; voterKey?: string };
    const slug = typeof body.slug === "string" ? body.slug.slice(0, 180) : "";
    const voterKey = typeof body.voterKey === "string" ? body.voterKey.slice(0, 100) : "";
    if (!getBuild(slug) || voterKey.length < 12) {
      return Response.json({ error: "Projeto ou identificação de visitante inválida." }, { status: 400 });
    }
    const existing = await db.select({ id: buildVotes.id }).from(buildVotes).where(and(eq(buildVotes.buildSlug, slug), eq(buildVotes.voterKey, voterKey))).limit(1);
    let voted: boolean;
    if (existing[0]) {
      await db.delete(buildVotes).where(eq(buildVotes.id, existing[0].id));
      voted = false;
    } else {
      await db.insert(buildVotes).values({ buildSlug: slug, voterKey }).onConflictDoNothing();
      voted = true;
    }
    const [result] = await db.select({ votes: sql<number>`count(*)::int` }).from(buildVotes).where(eq(buildVotes.buildSlug, slug));
    return Response.json({ slug, voted, votes: result?.votes ?? 0 });
  } catch (error) {
    console.error("vote", error);
    return Response.json({ error: "Não foi possível registrar o voto." }, { status: 500 });
  }
}
