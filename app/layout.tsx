import "./globals.css";

import { Geist_Mono, Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  ...baseMetadata,
  title: {
    default: "CxC - UWaterloo Data Science Competition",
    template: "%s | CxC - UWaterloo DSC",
  },
  description:
    "UWaterloo's premier data science competition bridging students and industry. Tackle real-world challenges, compete for prizes, and showcase innovative data science solutions.",
  keywords:
    "data science, competition, hackathon, uwaterloo, machine learning, analytics, cxc, conrad centre",
  openGraph: {
    type: "website",
    title: "CxC - UWaterloo Data Science Competition",
    description: "UWaterloo's premier data science competition bridging students and industry",
  },
  twitter: {
    card: "summary",
    title: "CxC - UWaterloo Data Science Competition",
    description: "UWaterloo's premier data science competition bridging students and industry",
  },
};

export const viewport: Viewport = baseViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
