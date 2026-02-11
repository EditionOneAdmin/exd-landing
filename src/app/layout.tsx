import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const BASE_URL = "https://editiononeadmin.github.io/exd-landing";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "EXD — Experience Data Platform | Data you don't just see. You feel.",
    template: "%s | EXD",
  },
  description:
    "Transform dry statistics into aesthetic, interactive experiences that captivate and communicate. EXD is the Experience Data Platform — data you don't just see, you feel.",
  keywords: [
    "data visualization",
    "interactive data",
    "data storytelling",
    "AI copilot",
    "experience platform",
    "data experience",
    "DOOH",
    "digital out-of-home",
    "data analytics",
    "EXD",
  ],
  authors: [{ name: "Edition One", url: "https://editionone.io" }],
  creator: "Edition One",
  publisher: "Edition One",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "EXD — Experience Data Platform",
    description:
      "Data you don't just see. You feel. Transform statistics into aesthetic, interactive experiences.",
    url: BASE_URL,
    siteName: "EXD",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "EXD — Experience Data Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXD — Experience Data Platform",
    description:
      "Data you don't just see. You feel. Transform statistics into aesthetic, interactive experiences.",
    images: [`${BASE_URL}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "EXD",
                url: BASE_URL,
                logo: `${BASE_URL}/og-image.png`,
                description:
                  "EXD — Experience Data Platform. Transform dry statistics into aesthetic, interactive experiences.",
                founder: { "@type": "Organization", name: "Edition One" },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "EXD — Experience Data Platform",
                url: BASE_URL,
                applicationCategory: "DataVisualization",
                operatingSystem: "Web",
                description:
                  "Transform dry statistics into aesthetic, interactive experiences that captivate and communicate.",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                  availability: "https://schema.org/ComingSoon",
                },
                featureList: [
                  "AI Copilot for data exploration",
                  "Interactive data visualizations",
                  "Data storytelling",
                  "DOOH-ready outputs",
                  "Real-time data library",
                ],
              },
            ]),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
