import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Copilot — Explore Data with Natural Language",
  description:
    "Ask questions in plain English and get instant, beautiful data visualizations. The EXD AI Copilot turns curiosity into insight.",
  alternates: {
    canonical: "https://editiononeadmin.github.io/exd-landing/copilot/",
  },
  openGraph: {
    title: "EXD AI Copilot — Explore Data with Natural Language",
    description:
      "Ask questions in plain English and get instant, beautiful data visualizations.",
    url: "https://editiononeadmin.github.io/exd-landing/copilot/",
    type: "website",
  },
};

export default function CopilotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
