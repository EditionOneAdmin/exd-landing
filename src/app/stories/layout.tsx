import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Stories — Interactive Narratives",
  description:
    "Immersive, scroll-driven data stories covering AI, energy transition, urbanization, smart cities, DOOH, and the future of our world.",
  alternates: {
    canonical: "https://editiononeadmin.github.io/exd-landing/stories/",
  },
  openGraph: {
    title: "EXD Data Stories",
    description:
      "Immersive, scroll-driven data stories that make complex topics tangible.",
    url: "https://editiononeadmin.github.io/exd-landing/stories/",
    type: "website",
    images: [{ url: "https://editiononeadmin.github.io/exd-landing/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXD Data Stories",
    description: "Immersive, scroll-driven data stories that make complex topics tangible.",
    images: ["https://editiononeadmin.github.io/exd-landing/og-image.png"],
  },
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
