import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Data",
  description: "Side-by-side data comparison tool. Compare countries, metrics, and trends with interactive visualizations.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/compare/" },
  openGraph: { title: "Compare Data — EXD", description: "Side-by-side data comparison with interactive visualizations.", type: "website" },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
