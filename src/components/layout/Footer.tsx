"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Headphones
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
    <footer className="relative bg-slate-950 border-t border-slate-900 overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">

          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Car className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">
                  Drive<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Vue</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
                  AI
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              DriveVue AI bridges intelligent vehicle recommendation with premium mobility.
              Book verified luxury cars, electric cruisers, and family SUVs with instant Stripe checkout.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stripe Verified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Recommendation Core</span>
              </div>
            </div>
          </div>

          {/* Column: Fleet */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Fleet & Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/cars?category=luxury" className="hover:text-cyan-400 transition-colors">
                  Luxury Sedans
                </Link>
              </li>
              <li>
                <Link href="/cars?category=electric" className="hover:text-cyan-400 transition-colors">
                  Electric & Hybrids
                </Link>
              </li>
              <li>
                <Link href="/cars?category=suv" className="hover:text-cyan-400 transition-colors">
                  Premium SUVs
                </Link>
              </li>
              <li>
                <Link href="/cars?category=sports" className="hover:text-cyan-400 transition-colors">
                  Sports & Performance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: AI Engine */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Technology
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/ai-assistant" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <span>Smart Matchmaker</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">v2.0</span>
                </Link>
              </li>
              <li>
                <Link href="/ai-assistant" className="hover:text-cyan-400 transition-colors">
                  Trip Preference Quiz
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-cyan-400 transition-colors">
                  Predictive Price Index
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:text-cyan-400 transition-colors">
                  Automated Check-in
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Support & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Support & Trust
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>24/7 Concierge Hotline</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Stripe Encrypted Checkout</span>
              </li>
              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Rental Policies & Insurance
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-cyan-400 transition-colors">
                  Help Center & FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 DriveVue AI Inc. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-slate-400 transition-colors">
              Security Overview
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