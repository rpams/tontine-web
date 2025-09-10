import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Tontine - Plateforme de gestion collaborative",
  description: "Gérez vos tontines en toute sécurité avec notre plateforme moderne et fiable.",
  openGraph: {
    locale: 'fr_FR',
  },
  other: {
    'google': 'notranslate',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" translate="no">
      <body
        className={`${inter.variable} ${poppins.variable} font-inter antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
