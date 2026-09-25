import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "RutaIA - Tu guía inteligente de cursos",
  description: "RutaIA analiza tus intereses y experiencia para recomendarte los mejores cursos adaptados a tu perfil.",
  keywords: ["cursos", "educación", "recomendaciones", "IA", "aprendizaje"],
  authors: [{ name: "RutaIA" }],
  openGraph: {
    title: "RutaIA - Tu guía inteligente de cursos",
    description: "RutaIA analiza tus intereses y experiencia para recomendarte los mejores cursos adaptados a tu perfil.",
    type: "website",
    locale: "es_ES",
    siteName: "RutaIA",
  },
  twitter: {
    card: "summary_large_image",
    title: "RutaIA - Tu guía inteligente de cursos",
    description: "RutaIA analiza tus intereses y experiencia para recomendarte los mejores cursos adaptados a tu perfil.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}