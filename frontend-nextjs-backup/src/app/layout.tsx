import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Diário do Futebol - Portal de Notícias e Apostas Esportivas",
  description: "O portal mais completo de esportes e apostas do Brasil. Notícias em tempo real, análises exclusivas e as melhores dicas para suas apostas.",
  keywords: "futebol, apostas esportivas, notícias, brasileiro, libertadores, champions league",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
