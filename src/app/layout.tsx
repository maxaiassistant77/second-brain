import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { getDocuments } from "@/lib/documents";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Second Brain",
  description: "Your living knowledge base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const documents = getDocuments().map(d => ({
    slug: d.slug,
    title: d.title,
    folder: d.folder,
  }));

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0a0a0f] text-zinc-100 antialiased`}
      >
        <Providers documents={documents}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
