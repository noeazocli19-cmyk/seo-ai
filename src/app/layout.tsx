import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://seo-ai-writer.app"),
  title: {
    default: "SEO AI Writer — Assistant IA pour contenu optimisé Google",
    template: "%s | SEO AI Writer",
  },
  description:
    "Le meilleur assistant IA pour créer du contenu optimisé pour Google. Générez articles SEO, méta-données, FAQ, publications sociales et plus avec Gemini 2.5 Flash.",
  keywords: [
    "SEO IA",
    "rédaction IA",
    "contenu SEO",
    "Gemini",
    "génération contenu",
    "optimisation SEO",
    "marketing de contenu",
    "référencement Google",
  ],
  authors: [{ name: "SEO AI Writer" }],
  creator: "SEO AI Writer",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/img.jpeg",
  },
  openGraph: {
    title: "SEO AI Writer — Assistant IA pour contenu optimisé Google",
    description:
      "Le meilleur assistant IA pour créer du contenu optimisé pour Google. Chat IA, génération SEO, analyse en temps réel.",
    url: "https://seo-ai-writer.app",
    siteName: "SEO AI Writer",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO AI Writer — Assistant IA SEO",
    description: "Le meilleur assistant IA pour créer du contenu optimisé pour Google.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://seo-ai-writer.app",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('seo-ai-writer-storage');
                const theme = stored ? JSON.parse(stored)?.state?.theme : null;
                const isDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
