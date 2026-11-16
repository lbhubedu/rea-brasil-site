// Fontes oficiais e públicas: releases do repositório GitHub de cada projeto.
// Nenhuma notícia é inventada: título, versão, data e link vêm da própria API.
export type Release = {
  repo: string;
  label: string;
  title: string;
  tagName: string;
  url: string;
  publishedAt: string;
  summary: string;
};

type GitHubRelease = {
  name?: string | null;
  tag_name?: string | null;
  html_url?: string | null;
  published_at?: string | null;
  draft?: boolean;
  prerelease?: boolean;
  body?: string | null;
};

const SOURCES = [
  { repo: "morluto/rea", label: "REA" },
  { repo: "NationalSecurityAgency/ghidra", label: "Ghidra" },
  { repo: "frida/frida", label: "Frida" },
];

function firstParagraph(body: string | null | undefined, max = 240) {
  if (!body) return "";
  const line = body.split("\n").map((item) => item.trim()).find((item) => item.length > 20 && !item.startsWith("#") && !item.startsWith(">"));
  return line ? line.slice(0, max) : "";
}

async function fetchRepoReleases(repo: string, label: string, perPage = 3): Promise<Release[]> {
  const response = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=${perPage}`, {
    headers: { Accept: "application/vnd.github+json" },
    // Revalidação diária: a página fica em cache e o GitHub é consultado uma
    // vez por dia, respeitando os limites da API anônima.
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`${repo}: HTTP ${response.status}`);
  const data = await response.json() as GitHubRelease[];
  if (!Array.isArray(data)) throw new Error(`${repo}: resposta inesperada`);
  return data
    .filter((item) => item.draft !== true && item.published_at && item.tag_name && item.html_url)
    .map((item) => ({
      repo,
      label,
      title: item.name?.trim() || `${label} ${item.tag_name}`,
      tagName: item.tag_name as string,
      url: item.html_url as string,
      publishedAt: item.published_at as string,
      summary: firstParagraph(item.body),
    }));
}

export type ReleasesResult = { releases: Release[]; fetchedAt: string; failed: string[] };

export async function fetchOfficialReleases(): Promise<ReleasesResult> {
  const fetchedAt = new Date().toISOString();
  const results = await Promise.allSettled(SOURCES.map((source) => fetchRepoReleases(source.repo, source.label)));
  const releases: Release[] = [];
  const failed: string[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") releases.push(...result.value);
    else failed.push(SOURCES[index].repo);
  });
  releases.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return { releases, fetchedAt, failed };
}
