import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TopNavWrapper } from "@/components/layout/TopNavWrapper";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";
import { CartProvider } from "@/components/cart/CartProvider";
import { ReferralProvider } from "@/components/loyalty";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "LOCRA - Wearable Artifacts from Iconic Destinations",
    template: "%s | LOCRA",
  },
  description:
    "Locra Travel Club curates wearable artifacts inspired by iconic places. Three destinations. One portal. Santorini, Amalfi, Kyoto.",
  keywords: [
    "luxury travel",
    "wearable artifacts",
    "Santorini",
    "Amalfi",
    "Kyoto",
    "travel club",
    "premium fashion",
  ],
  authors: [{ name: "LOCRA" }],
  creator: "LOCRA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://locra.com",
    siteName: "LOCRA",
    title: "LOCRA - Wearable Artifacts from Iconic Destinations",
    description:
      "Locra Travel Club curates wearable artifacts inspired by iconic places. Three destinations. One portal.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LOCRA - The Portal Arch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCRA - Wearable Artifacts from Iconic Destinations",
    description:
      "Three destinations. One portal. Curated wearable artifacts from Santorini, Amalfi, and Kyoto.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <ReferralProvider>
            <TopNavWrapper />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </ReferralProvider>
        </CartProvider>
      </body>
    </html>
  );
}
