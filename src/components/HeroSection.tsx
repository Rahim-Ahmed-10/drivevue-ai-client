"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  ShieldCheck, 
  KeyRound, 
  Star,
  SlidersHorizontal
} from "lucide-react";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const quickSearchTags = [
    "Tesla Model S",
    "Porsche Taycan",
    "BMW i4 M50",
    "Mercedes EQS",
    "Audi RS e-tron GT",
    "Electric SUVs",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery.trim());
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/cars");
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    if (onSearch) {
      onSearch(tag);
    } else {
      router.push(`/cars?search=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#090d16]">
      {/* =========================================================================
          2. VISUAL EFFECTS & AMBIENT BACKGROUND GLOW
         ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Subtle Cybernetic Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_15%,#000_70%,transparent_100%)]" />

        {/* Ambient Blurred Radial Gradients (Blue-600/15 & Cyan-500/10) */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-blue-600/15 via-cyan-500/10 to-transparent blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 -left-40 w-[650px] h-[450px] bg-blue-600/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[450px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-8 left-1/4 w-[700px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

        {/* Aerodynamic Contour Wave / Circuit SVG Motif */}
        <svg
          className="absolute top-24 left-0 w-full h-[640px] opacity-25 mix-blend-screen pointer-events-none"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="heroContourGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.0" />
              <stop offset="35%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="heroContourGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e40af" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.45" />
              <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <path
            d="M-50,330 C240,230 450,430 760,300 C1070,170 1260,360 1520,280"
            stroke="url(#heroContourGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M-50,380 C260,290 490,480 790,340 C1090,200 1290,400 1520,330"
            stroke="url(#heroContourGrad2)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* =========================================================================
            1. TYPOGRAPHY & LAYOUT - FLOATING BADGE
           ========================================================================= */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-[0_0_20px_rgba(6,182,212,0.12)] backdrop-blur-xl mb-6 group hover:border-cyan-400/50 transition-all duration-300">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300">
            Next-Gen Autonomous & Luxury Fleet
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
            AI v2.0
          </span>
        </div>

        {/* =========================================================================
            1. TYPOGRAPHY & LAYOUT - REFINED LUXURY HEADLINE
           ========================================================================= */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl leading-[1.08] text-balance">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 drop-shadow-[0_2px_12px_rgba(255,255,255,0.1)]">
            Discover Your Dream
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-300 drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]">
            AI-Driven
          </span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-blue-200 to-cyan-200">
            Luxury Car
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl font-normal leading-relaxed text-balance">
          Experience next-generation car rental engineered for performance. Precision AI matching,
          prestigious electric & luxury fleet, and instant Stripe-secured checkout.
        </p>

        {/* =========================================================================
            3. INTERACTIVE SEARCH BAR (DEEP GLASSMORPHISM & SMOOTH FOCUS RING)
           ========================================================================= */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl mt-8 rounded-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 p-1.5 sm:p-2 shadow-2xl shadow-blue-500/10 flex items-center transition-all duration-300 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 hover:border-slate-600"
        >
          <div className="flex items-center pl-4 pr-2 text-cyan-400">
            <Search className="w-5 h-5 shrink-0" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Brand, Model, or Vehicle Type..."
            className="w-full bg-transparent text-xs sm:text-sm md:text-base text-white placeholder-slate-400 focus:outline-none px-2 py-2.5 font-medium"
          />

          {/* =========================================================================
              4. CTA BUTTON (VIBRANT GRADIENT, INNER SHADOW, HOVER GLOW & SCALE)
             ========================================================================= */}
          <button
            type="submit"
            className="px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* =========================================================================
            3. POPULAR SEARCH TAGS (PILL BADGES WITH HOVER BORDER GLOWS)
           ========================================================================= */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-4 text-xs text-slate-400">
          <span className="text-slate-500 font-semibold tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400/80" />
            Popular:
          </span>
          {quickSearchTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="px-3.5 py-1.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 hover:text-white border border-slate-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-200 cursor-pointer text-xs font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* =========================================================================
            HERO VEHICLE SHOWCASE CONTAINER WITH RADAR PINS & AMBIENT SPOTLIGHT
           ========================================================================= */}
        <div className="relative w-full max-w-5xl mt-12 sm:mt-16 group">
          {/* Ground Spotlight Glow Under Vehicle */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-r from-blue-600/20 via-cyan-500/30 to-blue-600/20 blur-3xl rounded-full pointer-events-none" />

          {/* High-Resolution Side-Profile Car Graphic */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/90 hover:border-slate-700/80 bg-gradient-to-b from-slate-900/70 to-slate-950/95 shadow-2xl shadow-black/80 transition-all duration-300">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-car.jpg"
              alt="DriveVue AI Electric Hypercar Side Profile"
              className="w-full h-auto max-h-[520px] object-cover object-center select-none"
            />

            {/* Bottom gradient fade for seamless integration */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent pointer-events-none" />

            {/* PIN 1: Front Hood/Performance Radar Pin */}
            <div 
              className="absolute top-[28%] left-[16%] sm:left-[22%] z-20"
              onMouseEnter={() => setActiveTooltip(1)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 1 ? null : 1)}
                className="relative flex items-center justify-center p-2 focus:outline-none group/pin cursor-pointer"
                aria-label="Best AI Rental Today Details"
              >
                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-blue-400 opacity-60"></span>
                <span className="relative flex h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow-lg shadow-blue-500 group-hover/pin:scale-125 transition-transform"></span>
              </button>

              {/* Floating Tooltip Card */}
              <div
                className={`absolute -top-24 sm:-top-28 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 rounded-2xl bg-slate-950/90 border border-blue-500/40 backdrop-blur-xl shadow-2xl shadow-blue-600/20 text-left transition-all duration-300 pointer-events-none sm:pointer-events-auto ${
                  activeTooltip === 1 || activeTooltip === null
                    ? "opacity-100 translate-y-0"
                    : "opacity-40 sm:opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    Top Match
                  </span>
                  <Sparkles className="w-3 h-3 text-cyan-400 ml-auto" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Best AI Rental Today!
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  99.8% match rating based on handling, range & comfort.
                </p>
              </div>
            </div>

            {/* PIN 2: Center Cabin/Stripe Verified Pin */}
            <div 
              className="absolute top-[22%] sm:top-[26%] left-[50%] -translate-x-1/2 z-20"
              onMouseEnter={() => setActiveTooltip(2)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 2 ? null : 2)}
                className="relative flex items-center justify-center p-2 focus:outline-none group/pin cursor-pointer"
                aria-label="Instant Payments Details"
              >
                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-cyan-400 opacity-60"></span>
                <span className="relative flex h-4 w-4 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400 group-hover/pin:scale-125 transition-transform"></span>
              </button>

              {/* Floating Tooltip Card */}
              <div
                className={`absolute -top-24 sm:-top-28 left-1/2 -translate-x-1/2 w-56 sm:w-64 p-3 rounded-2xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl shadow-cyan-600/20 text-left transition-all duration-300 pointer-events-none sm:pointer-events-auto ${
                  activeTooltip === 2 || activeTooltip === null
                    ? "opacity-100 translate-y-0"
                    : "opacity-40 sm:opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Stripe Verified
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Flexible Instant Payments
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  1-Click Apple Pay & cards. $0 security hold with verified ID.
                </p>
              </div>
            </div>

            {/* PIN 3: Rear Smart Key Pin */}
            <div 
              className="absolute top-[42%] right-[12%] sm:right-[18%] z-20"
              onMouseEnter={() => setActiveTooltip(3)}
              onMouseLeave={() => setActiveTooltip(null)}
            >
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 3 ? null : 3)}
                className="relative flex items-center justify-center p-2 focus:outline-none group/pin cursor-pointer"
                aria-label="Digital Key Details"
              >
                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-blue-500 opacity-60"></span>
                <span className="relative flex h-4 w-4 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500 group-hover/pin:scale-125 transition-transform"></span>
              </button>

              {/* Floating Tooltip Card */}
              <div
                className={`absolute -top-24 sm:-top-28 left-1/2 -translate-x-1/2 w-52 sm:w-60 p-3 rounded-2xl bg-slate-950/90 border border-blue-500/40 backdrop-blur-xl shadow-2xl shadow-blue-600/20 text-left transition-all duration-300 pointer-events-none sm:pointer-events-auto ${
                  activeTooltip === 3 || activeTooltip === null
                    ? "opacity-100 translate-y-0"
                    : "opacity-40 sm:opacity-90 hover:opacity-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    Smart Access
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Instant Keyless Entry
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Unlock and start immediately from your smartphone.
                </p>
              </div>
            </div>
          </div>

          {/* Micro Stats Banner Directly Under Car Graphic */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-slate-700 transition-all">
              <span className="text-2xl sm:text-3xl font-black text-blue-400 tracking-tight">500+</span>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Verified Vehicles</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-slate-700 transition-all">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight">99.8%</span>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">AI Match Precision</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center hover:border-slate-700 transition-all">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">$0</span>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Hidden Booking Fees</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center flex flex-col items-center justify-center hover:border-slate-700 transition-all">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-1 tracking-tight">
                4.95 <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </span>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">15,000+ Completed Trips</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
