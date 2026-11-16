import { db } from "@/db";
import { buildVotes } from "@/db/schema";
import { builds } from "@/data/catalog";
import { sql } from "drizzle-orm";

export async function buildsByVotes() {
  const rows = await db.select({ slug: buildVotes.buildSlug, votes: sql<number>`count(*)::int` }).from(buildVotes).groupBy(buildVotes.buildSlug);
  const counts = Object.fromEntries(rows.map((row) => [row.slug, row.votes]));
  return [...builds].sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0) || builds.indexOf(a) - builds.indexOf(b));
}
