import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EXD | Data you don't just see. You feel.",
  description: "Transform dry statistics into aesthetic, interactive experiences that captivate and communicate. EXD is the Experience Data Platform.",
  keywords: ["data visualization", "interactive data", "data storytelling", "AI", "experience platform"],
  authors: [{ name: "EXD" }],
  openGraph: {
    title: "EXD | Data you don't just see. You feel.",
    description: "Transform dry statistics into aesthetic, interactive experiences that captivate and communicate.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EXD | Data you don't just see. You feel.",
    description: "Transform dry statistics into aesthetic, interactive experiences that captivate and communicate.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
