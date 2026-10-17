import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DriveVue AI | Smart Car Rentals Powered by AI",
  description:
    "Experience the future of car rentals with DriveVue AI. Personalized vehicle recommendations, verified premium fleet, and instant Stripe payments.",
  keywords: [
    "car rental",
    "AI car recommendation",
    "luxury car rental",
    "electric vehicles",
    "DriveVue AI",
    "instant booking",
  ],
  authors: [{ name: "DriveVue AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Suspense fallback={<header className="fixed top-0 left-0 right-0 h-20 z-50 bg-transparent" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
