import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lucellect | AI Assistant by Angela Gardan",
  description: "The official Lucellect AI. Developed by Angela Gardan in 2026 for engineers and developers.",
  keywords: ["Lucellect", "Angela Gardan", "Engineering AI", "Math AI", "Clean AI Interface", "Developer AI Assistant", "jelly", "gel", "gela08", "gela", "lucellectai", "lucellect.ai", "lucellect", "lucellect chat", "lucellect ai assistant", "lucellect math support", "lucellect clean interface", "lucellect", "ai"],
  authors: [{ name: "Angela Gardan" }],
  openGraph: {
    title: "Lucellect",
    description: "Developed by Angela Gardan. Purpose-built for clarity and mathematical precision.",
    url: "https://lucellectai.vercel.app",
    siteName: "Lucellect",
    images: [{ url: "/og-image.png" }], // Create a nice preview image
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
