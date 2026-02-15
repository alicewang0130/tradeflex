import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeFlex — Show Off Your Trades",
  description: "Generate stunning trade cards, predict the market with Oracle, and compete with traders worldwide. Built by traders, for traders. 🚀",
  keywords: ["trading", "stocks", "options", "trade card", "portfolio", "wallstreetbets", "trading journal", "stock market", "trading app"],
  authors: [{ name: "TradeFlex" }],
  openGraph: {
    type: "website",
    title: "TradeFlex — Show Off Your Trades 🚀",
    description: "Generate stunning trade cards, predict the market, and compete with traders worldwide.",
    siteName: "TradeFlex",
    url: "https://tradeflex.app",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "TradeFlex — Show Off Your Trades",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeFlex — Show Off Your Trades 🚀",
    description: "Generate stunning trade cards, predict the market, and compete with traders worldwide.",
    images: ["/og-image.png"],
    creator: "@TradeFlex_app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
