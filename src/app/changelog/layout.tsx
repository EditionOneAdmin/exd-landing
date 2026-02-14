import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in EXD — latest features, improvements, and updates to the Experience Data Platform.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/changelog/" },
  openGraph: { title: "EXD Changelog", description: "Latest updates and features for the EXD platform.", type: "website" },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
