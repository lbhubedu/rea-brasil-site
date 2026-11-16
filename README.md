# Rea Brasil LB — site

Site público em português do diretório **Rea Brasil LB**: projetos, guias, prompts e ferramentas de engenharia reversa com agentes de IA, além de gerador de prompts personalizado, novidades automáticas e assistente de dúvidas.

## Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS 4
- [Drizzle ORM](https://orm.drizzle.team) + PostgreSQL (Neon em produção)
- Serviços de IA **sem chave de API**: [Kilo Gateway](https://kilo.ai/docs/gateway) (modelos gratuitos, anônimo, 200 req/h por IP) e [Pollinations](https://pollinations.ai) (API clássica de texto, anônima com espaçamento mínimo entre chamadas). Ambos são best-effort: quando não respondem, o site avisa e nunca inventa conteúdo.

## Funcionalidades

- **Catálogo** estático de projetos, guias, ferramentas e prompts (`src/data/`).
- **Gerador de prompts** (`/gerador`): envia o pedido a Kilo → Pollinations; se ambos falharem, monta um roteiro estruturado localmente e diz que não é IA. Prompts **não são salvos** no servidor; histórico fica só no navegador.
- **Novidades** (`/novidades`): releases oficiais reais do REA, Ghidra e Frida lidas das APIs públicas do GitHub, com revalidação diária (`revalidate = 86400`). Resumo opcional por IA, claramente identificado; sem IA, os dados originais seguem.
- **Dúvidas** (`/duvidas`): perguntas respondidas por IA com contexto do site; nada é persistido.
- **Votos, envios e newsletter**: gravados no Postgres (Neon).

## Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | String de conexão Postgres (produção: Neon, pooled). O build funciona sem ela; rotas que precisam do banco avisam em runtime. |
| `NEXT_PUBLIC_SITE_URL` | URL pública (ex.: `https://rea-brasil-site.vercel.app`) para `robots.txt` e `sitemap.xml`. |

Copie `.env.example` para `.env.local` em desenvolvimento. Nunca commite `.env`.

## Desenvolvimento

```bash
npm install          # dependências
npm run dev          # servidor local
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run build        # build de produção
npm run db:push      # aplica o schema (drizzle-kit push) no DATABASE_URL atual
```

## Banco de dados

- Schema em `src/db/schema.ts` (Drizzle). Sem migrações versionadas; `npm run db:push` cria as tabelas em um banco vazio.
- Produção usa um banco Neon próprio; o acesso se dá por `DATABASE_URL` configurada na Vercel (segredo, nunca no Git).

## Limites e abuso

As rotas públicas de escrita têm um limitador de requisições leve, em memória, por instância (melhor esforço em serverless). Para limite global, configure uma regra de rate limit no **Vercel WAF** do projeto (Hobby permite 1 regra) mirando `/api/*`.

## Privacidade

- O gerador não salva nem publica prompts; o histórico é `localStorage`.
- Dúvidas e resumos de IA não são salvos; perguntas e contexto são enviados aos provedores de IA de terceiros (Kilo/Pollinations) — os avisos das páginas explicam isso.
- Newsletter armazena apenas o e-mail informado, com honeypot anti-spam; não há envio automático ainda.

## Conteúdo

Conteúdo educacional. Analise somente o que você possui, é aberto ou tem autorização para examinar. Fontes oficiais: [rea.tools](https://rea.tools), [github.com/morluto/rea](https://github.com/morluto/rea), [madewithrea.com](https://madewithrea.com).
