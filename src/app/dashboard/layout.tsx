import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Real-time data dashboard with interactive charts, KPIs, and AI-powered insights. Experience your data like never before.",
  alternates: { canonical: "https://editiononeadmin.github.io/exd-landing/dashboard/" },
  openGraph: { title: "EXD Dashboard", description: "Real-time data dashboard with interactive charts and AI-powered insights.", type: "website" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
