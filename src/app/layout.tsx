import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header/Header";
import { Footer } from "@/components/layout/Footer/Footer";
import { BenefitsSection } from "@/features/home/components/BenefitsSection";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "FreshCart", template: "%s | FreshCart" },
  description: "FreshCart - quality products delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Providers>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <BenefitsSection />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
