export const dynamic = "force-static";

import type { MetadataRoute } from "next";

const BASE = "https://editiononeadmin.github.io/exd-landing";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const pages: { url: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    // Core
    { url: "/", priority: 1.0, changeFrequency: "weekly" },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" },
    { url: "/pricing", priority: 0.8, changeFrequency: "monthly" },
    { url: "/dashboard", priority: 0.9, changeFrequency: "weekly" },
    { url: "/visualizations", priority: 0.9, changeFrequency: "weekly" },
    { url: "/explore", priority: 0.8, changeFrequency: "weekly" },
    { url: "/copilot", priority: 0.8, changeFrequency: "monthly" },
    { url: "/compare", priority: 0.7, changeFrequency: "weekly" },
    { url: "/embed", priority: 0.5, changeFrequency: "monthly" },
    { url: "/api-docs", priority: 0.6, changeFrequency: "monthly" },
    { url: "/changelog", priority: 0.6, changeFrequency: "weekly" },
    { url: "/quiz", priority: 0.5, changeFrequency: "monthly" },
    // Blog
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { url: "/blog/why-experience-data", priority: 0.6, changeFrequency: "monthly" },
    { url: "/blog/dooh-eating-advertising", priority: 0.6, changeFrequency: "monthly" },
    { url: "/blog/smart-cities-experience-layer", priority: 0.6, changeFrequency: "monthly" },
    // Stories
    { url: "/stories", priority: 0.8, changeFrequency: "weekly" },
    { url: "/stories/ai-revolution", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/dooh-revolution", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/energy-transition", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/global-finance", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/global-health", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/global-urbanization", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/real-estate", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/rise-of-ai", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/smart-cities", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/world-in-50-years", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/berlin-numbers", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/berlin-pulse", priority: 0.7, changeFrequency: "monthly" },
    { url: "/stories/venture-capital", priority: 0.7, changeFrequency: "monthly" },
    // Use Cases
    { url: "/use-cases/dooh", priority: 0.7, changeFrequency: "monthly" },
    { url: "/use-cases/media-advertising", priority: 0.7, changeFrequency: "monthly" },
    { url: "/use-cases/real-estate", priority: 0.7, changeFrequency: "monthly" },
    { url: "/use-cases/smart-city", priority: 0.7, changeFrequency: "monthly" },
    { url: "/use-cases/hygh", priority: 0.7, changeFrequency: "monthly" },
    { url: "/use-cases/retail", priority: 0.7, changeFrequency: "monthly" },
    // Interactive
    { url: "/explore/interactive", priority: 0.6, changeFrequency: "weekly" },
  ];

  return pages.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
