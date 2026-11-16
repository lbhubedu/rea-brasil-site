import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string; website?: string };
    if (body.website) return Response.json({ ok: true });
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Digite um e-mail válido." }, { status: 400 });
    }
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
    return Response.json({ ok: true, message: "Inscrição confirmada. Você receberá o próximo resumo." });
  } catch (error) {
    console.error("newsletter", error);
    return Response.json({ error: "Não foi possível concluir a inscrição agora." }, { status: 500 });
  }
}
