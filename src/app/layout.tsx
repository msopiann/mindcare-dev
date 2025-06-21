import type React from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { ThemeToggle } from "@/components/theme-toggle";

const bricolageGrotesqueFont = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap", // Optimize font loading
  preload: true,
});

export const metadata: Metadata = {
  title: {
    template: "%s | Mindcare - Ruang Nyaman Buat Jaga Kesehatan Mental Kamu",
    default: "Mindcare | Ruang Nyaman Buat Jaga Kesehatan Mental Kamu",
  },
  description:
    "Lagi burnout? Overthinking? Atau cuma pengen cerita? Mindcare hadir buat bantu kamu tetap waras lewat konseling online & tips self-care yang relatable.",
  keywords:
    "kesehatan mental gen z, konseling online, healing, overthinking, burnout, self-care, mindfulness, psikolog muda, dukungan emosional, Mindcare Indonesia",
  openGraph: {
    title: "Mindcare | Ruang Nyaman Buat Jaga Kesehatan Mental Kamu",
    description:
      "Lagi burnout? Overthinking? Atau cuma pengen cerita? Mindcare hadir buat bantu kamu tetap waras lewat konseling online & tips self-care yang relatable.",
    type: "website",
    locale: "id_ID",
    siteName: "Mindcare",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindcare | Ruang Nyaman Buat Jaga Kesehatan Mental Kamu",
    description:
      "Lagi burnout? Overthinking? Atau cuma pengen cerita? Mindcare hadir buat bantu kamu tetap waras lewat konseling online & tips self-care yang relatable.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/assets/image/hero/hero-right-decoration.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preload"
          href="/assets/image/hero/hero-left-decoration.png"
          as="image"
          type="image/png"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      </head>
      <body className={`${bricolageGrotesqueFont.variable} antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <ThemeToggle />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
