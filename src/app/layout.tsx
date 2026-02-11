import type { Metadata } from "next";
import { Nunito, Caveat } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Valentine2 — Vytvoř valentýnku",
  description: "Vytvoř jedinečnou valentýnskou kartu s vlastními texty a ilustracemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body
        className={`${nunito.variable} ${caveat.variable} font-sans antialiased bg-gradient-to-br from-pink-50 to-rose-100 min-h-screen`}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
