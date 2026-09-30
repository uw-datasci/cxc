import "./globals.css";

import { Atkinson_Hyperlegible_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { baseMetadata, baseViewport } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const fontSans = localFont({
  src: [
    { path: "./fonts/AlteHaasGroteskRegular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/AlteHaasGroteskBold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
});

const fontMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  adjustFontFallback: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
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
      className={cn("font-sans antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
