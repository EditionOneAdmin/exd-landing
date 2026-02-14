import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation",
  description: "EXD API reference — integrate interactive data visualizations and AI-powered data exploration into your applications.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/api-docs/" },
  openGraph: { title: "EXD API Docs", description: "Developer documentation for the EXD platform API.", type: "website" },
};

export default function ApiDocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
