import type { MetadataRoute } from "next";
import { builds, categories } from "@/data/catalog";
import { guides } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticRoutes = ["", "/newest", "/most-voted", "/prompts", "/gerador", "/guides", "/tools", "/landscape", "/submit", "/about", "/support", "/sponsor", "/novidades", "/duvidas"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "" ? "daily" as const : "weekly" as const, priority: route === "" ? 1 : 0.7 })),
    ...categories.map((category) => ({ url: `${base}/categories/${category.slug}`, changeFrequency: "weekly" as const })),
    ...builds.map((build) => ({ url: `${base}/builds/${build.slug}`, changeFrequency: "monthly" as const })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, changeFrequency: "monthly" as const })),
  ];
}
