"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Headphones,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";

function FooterContent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration ba Client-side mount na hawa porjonto blank thakbe
  if (!mounted) {
    return null;
  }

  // Admin ba Dashboard route thakle footer hyper-cleanly hide thakbe
  const isAdminRoute = pathname?.startsWith("/admin") || pathname === "/dashboard";

  if (isAdminRoute) {
    return null;
  }

  return (
    <footer className="relative bg-[#060913] border-t border-slate-800/80 overflow-hidden text-slate-300">
      {/* Background ambient lighting matching Navbar style */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute -top-40 left-1/4 w-[500px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800/80">

          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-5">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  Drive<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Vue</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                  AI
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              DriveVue AI bridges intelligent vehicle recommendation with premium mobility.
              Book verified luxury cars, electric cruisers, and family SUVs with instant Stripe checkout.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d1322] border border-slate-800 text-xs text-emerald-400 font-medium shadow-inner">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stripe Verified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0d1322] border border-slate-800 text-xs text-cyan-300 font-medium shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Core v2.0</span>
              </div>
            </div>
          </div>

          {/* Column: Fleet */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Fleet & Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/cars?category=luxury" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Luxury Sedans</span>
                </Link>
              </li>
              <li>
                <Link href="/cars?category=electric" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Electric & Hybrids</span>
                </Link>
              </li>
              <li>
                <Link href="/cars?category=suv" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Premium SUVs</span>
                </Link>
              </li>
              <li>
                <Link href="/cars?category=sports" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Sports & Performance</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: AI Engine */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              AI Technology
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/ai-assistant" className="hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span className="flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                    <span>Smart Matchmaker</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20">AI</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Trip Preference Quiz</span>
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Predictive Price Index</span>
                </Link>
              </li>
              <li>
                <Link href="/my-bookings" className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Automated Check-in</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Support & Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Support & Trust
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2 text-slate-300">
                <Headphones className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>24/7 Concierge Hotline</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <CreditCard className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Stripe Encrypted Checkout</span>
              </li>
              <li>
                <Link href="/terms" prefetch={false} className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Rental Policies & Insurance</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" prefetch={false} className="hover:text-cyan-400 transition-colors flex items-center gap-1 group">
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  <span>Help Center & FAQs</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DriveVue AI Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" prefetch={false} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" prefetch={false} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" prefetch={false} className="hover:text-slate-300 transition-colors flex items-center gap-1">
              <span>Security Overview</span>
              <ArrowUpRight className="w-3 h-3 text-slate-600" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Suspense wrapper to guarantee SSR stability on Next.js 15+ Turbopack
export default function Footer() {
  return (
    <Suspense fallback={null}>
      <FooterContent />
    </Suspense>
  );
}