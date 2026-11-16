import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "DEADLINE OS — Your Goals. Your Time. Your Moment.",
  description:
    "AI-powered deadline planning, backward milestone timelines, and high-resolution countdown lock screen wallpapers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-bg-primary text-text-primary min-h-screen selection:bg-accent-purple/30 selection:text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
