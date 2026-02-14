import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "EXD pricing plans — from free exploration to enterprise data experiences. Find the plan that fits your needs.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/pricing/" },
  openGraph: { title: "EXD Pricing", description: "Flexible pricing plans for every data storytelling need.", type: "website" },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
