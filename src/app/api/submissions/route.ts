import { db } from "@/db";
import { submissions } from "@/db/schema";
import { categories } from "@/data/catalog";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const text = (key: string, max: number) => typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";
    const url = text("url", 1000);
    const title = text("title", 180);
    const description = text("description", 1800);
    const category = text("category", 80);
    const author = text("author", 120);
    const email = text("email", 254);
    let parsed: URL;
    try { parsed = new URL(url); } catch { return Response.json({ error: "Cole um link completo, começando com https://" }, { status: 400 }); }
    if (!["http:", "https:"].includes(parsed.protocol)) return Response.json({ error: "O link precisa usar HTTP ou HTTPS." }, { status: 400 });
    if (title.length < 3 || description.length < 40) return Response.json({ error: "Informe um título e uma descrição com pelo menos 40 caracteres." }, { status: 400 });
    if (!categories.some((item) => item.slug === category)) return Response.json({ error: "Escolha uma categoria válida." }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Revise o e-mail informado." }, { status: 400 });
    const [saved] = await db.insert(submissions).values({ url, title, description, category, author, email }).returning({ id: submissions.id, status: submissions.status });
    return Response.json({ ok: true, id: saved?.id, status: saved?.status, message: "Projeto recebido. Ele agora está na fila de leitura e revisão." }, { status: 201 });
  } catch (error) {
    console.error("submission", error);
    return Response.json({ error: "Não foi possível enviar agora. Tente novamente." }, { status: 500 });
  }
}
