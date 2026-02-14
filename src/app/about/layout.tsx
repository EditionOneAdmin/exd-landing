import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About EXD",
  description: "Learn about EXD — the Experience Data Platform by Edition One. Our mission: transform dry statistics into aesthetic, interactive experiences.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/about/" },
  openGraph: { title: "About EXD", description: "The team and mission behind the Experience Data Platform.", type: "website" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
