import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Stories — Interactive Narratives",
  description:
    "Immersive, scroll-driven data stories covering AI, energy transition, urbanization, smart cities, DOOH, and the future of our world.",
  openGraph: {
    title: "EXD Data Stories",
    description:
      "Immersive, scroll-driven data stories that make complex topics tangible.",
    type: "website",
  },
};

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
