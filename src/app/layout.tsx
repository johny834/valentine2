import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digi-Valentýnka",
  description: "Vytvoř jedinečnou valentýnskou kartu s vlastními texty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className="font-sans antialiased">
        {/* Ambient background */}
        <div className="ambient">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
