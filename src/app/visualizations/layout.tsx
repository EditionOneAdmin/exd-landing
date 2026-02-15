import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Visualizations — Data Gallery",
  description:
    "Explore a curated gallery of interactive data visualizations: GDP racing charts, CO₂ world maps, population pyramids, and more. Built with EXD.",
  alternates: {
    canonical: "https://editiononeadmin.github.io/exd-landing/visualizations/",
  },
  openGraph: {
    title: "EXD Visualization Gallery",
    description:
      "Explore interactive data visualizations: GDP racing charts, CO₂ maps, population pyramids, and more.",
    url: "https://editiononeadmin.github.io/exd-landing/visualizations/",
    type: "website",
    images: [{ url: "https://editiononeadmin.github.io/exd-landing/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXD Visualization Gallery",
    description: "Explore interactive data visualizations: GDP racing charts, CO₂ maps, population pyramids, and more.",
    images: ["https://editiononeadmin.github.io/exd-landing/og-image.png"],
  },
};

export default function VisualizationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
