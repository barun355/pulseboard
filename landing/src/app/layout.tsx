import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pulseboard.app"),
  title: {
    default: "PulseBoard - Create Polls. Collect Insights. Decide Faster.",
    template: "%s | PulseBoard",
  },
  description:
    "Build beautiful polls in seconds, share them with anyone, and watch responses stream in live — with analytics that tell you what your audience actually thinks.",
  keywords: [
    "polls",
    "survey tool",
    "real-time analytics",
    "audience insights",
    "feedback collection",
    "poll creator",
    "team polls",
    "anonymous polling",
    "live results",
    "UTM tracking",
  ],
  authors: [{ name: "PulseBoard" }],
  creator: "PulseBoard",
  publisher: "PulseBoard",
  applicationName: "PulseBoard",
  referrer: "origin-when-cross-origin",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pulseboard.app",
    siteName: "PulseBoard",
    title: "PulseBoard - Create Polls. Collect Insights. Decide Faster.",
    description:
      "Build beautiful polls in seconds, share them with anyone, and watch responses stream in live — with analytics that tell you what your audience actually thinks.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PulseBoard — The smart polling platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PulseBoard - Create Polls. Collect Insights. Decide Faster.",
    description:
      "Build beautiful polls in seconds, share them with anyone, and watch responses stream in live.",
    images: ["/og-image.png"],
    creator: "@pulseboard",
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
  alternates: {
    canonical: "https://pulseboard.app",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${plusJakarta.variable} ${inter.variable} h-full`}
      >
        <body className="min-h-full flex flex-col antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
