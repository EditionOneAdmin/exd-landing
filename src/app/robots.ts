import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/embed/"],
      },
    ],
    sitemap: "https://editiononeadmin.github.io/exd-landing/sitemap.xml",
  };
}
