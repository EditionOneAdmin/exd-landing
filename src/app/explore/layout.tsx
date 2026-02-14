import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Data",
  description: "Browse and explore datasets from around the world. Filter, search, and discover data stories waiting to be told.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/explore/" },
  openGraph: { title: "Explore Data — EXD", description: "Browse and explore global datasets with interactive tools.", type: "website" },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
