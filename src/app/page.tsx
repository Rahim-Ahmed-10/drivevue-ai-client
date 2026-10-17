"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  ArrowRight, 
  Search,
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  Zap, 
  CheckCircle2, 
  Star, 
  Users, 
  Gauge, 
  SlidersHorizontal,
  ChevronRight,
  KeyRound
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const quickSearchTags = [
    "Tesla Model S",
    "Porsche Taycan",
    "BMW i4",
    "Mercedes EQS",
    "Electric SUVs",
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/cars");
    }
  };

  const featuredCars = [
    {
      id: "car-1",
      name: "Tesla Model S Plaid",
      category: "Electric",
      tag: "AI Recommended",
      price: 189,
      image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
      specs: { acceleration: "1.99s 0-60", range: "396 mi", seats: "5 Seats" },
      rating: 4.98,
      reviews: 142,
    },
    {
      id: "car-2",
      name: "Porsche Taycan 4S",
      category: "Performance EV",
      tag: "Top Rated",
      price: 245,
      image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
      specs: { acceleration: "3.8s 0-60", range: "272 mi", seats: "4 Seats" },
      rating: 4.95,
      reviews: 98,
    },
    {
      id: "car-3",
      name: "Range Rover Sport Dynamic",
      category: "Luxury SUV",
      tag: "Most Popular",
      price: 210,
      image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80",
      specs: { acceleration: "5.4s 0-60", range: "AWD Turbo", seats: "7 Seats" },
      rating: 4.92,
      reviews: 116,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 overflow-x-hidden">
      {/* =========================================================================
          HERO BANNER SECTION
         ========================================================================= */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        {/* Subtle Blue Accent Wave Graphics in the Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Ambient radial glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/15 blur-[150px] rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 left-1/3 w-[600px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full" />

          {/* Flowing Aerodynamic Accent Waves SVG */}
          <svg
            className="absolute top-24 left-0 w-full h-[620px] opacity-40 mix-blend-screen"
            viewBox="0 0 1440 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.0" />
                <stop offset="45%" stopColor="#60a5fa" stopOpacity="0.5" />
                <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.0" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Wave 1 */}
            <path
              d="M-50,320 C240,240 450,440 760,310 C1070,180 1260,370 1520,290"
              stroke="url(#waveGrad1)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Wave 2 */}
            <path
              d="M-50,360 C260,280 490,470 790,340 C1090,210 1290,400 1520,330"
              stroke="url(#waveGrad2)"
              strokeWidth="2"
              strokeDasharray="8 6"
              strokeLinecap="round"
            />
            {/* Wave 3 - Lower undulating wave */}
            <path
              d="M-50,410 C220,340 520,510 820,390 C1120,270 1340,430 1520,380"
              stroke="url(#waveGrad3)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          {/* Subtle AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-blue-500/30 shadow-lg shadow-blue-600/10 backdrop-blur-md mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300">
              DriveVue AI Intelligent Fleet
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
            Discover Your Dream{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400">
              AI-Driven Car
            </span>{" "}
            Today!
          </h1>

          {/* Subtext */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Experience next-generation car rental tailored to your trip. Smart matching, 
            premium electric & luxury fleet, and instant Stripe-secured checkout.
          </p>

          {/* Centered Pill-Style Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-2xl mt-8 rounded-full bg-slate-900/85 border border-slate-700/80 p-1.5 sm:p-2 shadow-2xl shadow-blue-950/60 backdrop-blur-xl flex items-center transition-all duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
          >
            <div className="flex items-center pl-4 pr-2 text-blue-400">
              <Search className="w-5 h-5 shrink-0" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search By Brand, Model, or Vehicle Type..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none px-2 py-2"
            />

            <button
              type="submit"
              className="px-6 sm:px-7 py-3 rounded-full text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick search suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-400">
            <span className="text-slate-500">Popular:</span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchQuery(tag);
                  router.push(`/cars?search=${encodeURIComponent(tag)}`);
                }}
                className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Hero Image & Interactive Tooltips Container */}
          <div className="relative w-full max-w-5xl mt-12 sm:mt-16 group">
            {/* Behind car glowing ground spotlight */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />

            {/* High-Resolution Side-Profile Car Graphic */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/90 shadow-2xl shadow-black/80">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-car.jpg"
                alt="DriveVue AI Electric Hypercar Side Profile"
                className="w-full h-auto max-h-[520px] object-cover object-center select-none"
              />

              {/* Bottom gradient fade for seamless integration */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#090d16] via-[#090d16]/70 to-transparent pointer-events-none" />

              {/* =========================================================================
                  INTERACTIVE GLOWING PULSE PINS & FLOATING TOOLTIPS
                 ========================================================================= */}

              {/* PIN 1: Best AI Rental Today (Positioned on Front Hood/Wheel) */}
              <div 
                className="absolute top-[28%] left-[16%] sm:left-[22%] z-20"
                onMouseEnter={() => setActiveTooltip(1)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Glowing Radar Pulse Pin */}
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

              {/* PIN 2: Flexible Instant Payments (Positioned on Center Door/Cabin) */}
              <div 
                className="absolute top-[22%] sm:top-[26%] left-[50%] -translate-x-1/2 z-20"
                onMouseEnter={() => setActiveTooltip(2)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Glowing Radar Pulse Pin */}
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

              {/* PIN 3: Digital Smart Key (Positioned on Rear Wing/Hatch) */}
              <div 
                className="absolute top-[42%] right-[12%] sm:right-[18%] z-20"
                onMouseEnter={() => setActiveTooltip(3)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Glowing Radar Pulse Pin */}
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

            {/* Micro stats banner directly under the car */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xl sm:text-2xl font-black text-blue-400">500+</span>
                <p className="text-xs text-slate-400 mt-0.5">Premium Vehicles</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xl sm:text-2xl font-black text-cyan-400">99.8%</span>
                <p className="text-xs text-slate-400 mt-0.5">AI Match Accuracy</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xl sm:text-2xl font-black text-emerald-400">$0</span>
                <p className="text-xs text-slate-400 mt-0.5">Hidden Fees</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center flex flex-col items-center justify-center">
                <span className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1">
                  4.95 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </span>
                <p className="text-xs text-slate-400 mt-0.5">15,000+ Happy Trips</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CORE FEATURES GRID (AI Recommendation, Stripe Payment, 24/7 Support)
         ========================================================================= */}
      <section className="relative py-20 bg-slate-950/60 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Production-Grade Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Seamless Journeys
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Harness cutting-edge AI and fintech infrastructure designed to elevate every mile of your road trip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: AI Recommendation */}
            <div className="relative group rounded-2xl bg-slate-900/50 border border-slate-800/80 p-8 hover:border-blue-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center mb-6 shadow-inner">
                <Sparkles className="w-7 h-7 text-blue-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2 block">
                Algorithmic Intelligence
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                AI Recommendation Engine
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Our deep neural recommendation engine evaluates your destination, driving style, luggage requirements, and passenger count to suggest your ideal car with sub-second response times.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Personalized trip & luggage matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Dynamic price optimization index</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Autonomous conversational car selector</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Instant Stripe Payment */}
            <div className="relative group rounded-2xl bg-slate-900/50 border border-slate-800/80 p-8 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-inner">
                <CreditCard className="w-7 h-7 text-indigo-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
                Fintech Security
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                Instant Stripe Payment
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Experience friction-free checkout backed by Stripe. Instant reservation hold, transparent billing breakdown, multiple payment methods, and automated deposit refund workflows.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>PCI-DSS Level 1 bank-grade encryption</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Apple Pay, Google Pay, and major cards</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Transparent itemized fee protection</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: 24/7 Support */}
            <div className="relative group rounded-2xl bg-slate-900/50 border border-slate-800/80 p-8 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-inner">
                <Headphones className="w-7 h-7 text-emerald-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 block">
                VIP Concierge
              </span>
              <h3 className="text-xl font-bold text-white mb-3">
                24/7 Dedicated Support
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Travel with total peace of mind. Our continuous concierge combines intelligent autonomous assistance with live priority dispatchers for roadside help, extensions, and route planning.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Average chat response under 60 seconds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nationwide roadside emergency dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Flexible one-tap reservation adjustments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED FLEET SHOWCASE
         ========================================================================= */}
      <section className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Handpicked Fleet
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Popular Vehicles Ready Today
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              All vehicles are thoroughly inspected, detailed, and equipped with smart digital unlock.
            </p>
          </div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All 500+ Cars</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col"
            >
              {/* Image banner with overlay */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-600/90 text-white shadow-md backdrop-blur-sm">
                    {car.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-xs text-amber-300 border border-amber-400/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{car.rating}</span>
                  <span className="text-slate-400">({car.reviews})</span>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
                    {car.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5 group-hover:text-blue-300 transition-colors">
                    {car.name}
                  </h3>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-800/70 text-slate-300 text-xs">
                    <div className="flex flex-col items-center">
                      <Gauge className="w-4 h-4 text-blue-400 mb-1" />
                      <span>{car.specs.acceleration}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Zap className="w-4 h-4 text-cyan-400 mb-1" />
                      <span>{car.specs.range}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="w-4 h-4 text-indigo-400 mb-1" />
                      <span>{car.specs.seats}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs text-slate-400">From </span>
                    <span className="text-2xl font-black text-white">${car.price}</span>
                    <span className="text-xs text-slate-400"> /day</span>
                  </div>
                  <Link
                    href={`/cars/${car.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-[#2563eb] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS
         ========================================================================= */}
      <section className="relative py-20 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Rent Smarter in 3 Simple Steps
            </h2>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              From preference prompt to highway in less than 3 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-6 relative">
              <span className="text-5xl font-black text-slate-800/80 absolute top-4 right-6 select-none">
                01
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold mb-4">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                1. Set Your Preferences
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Enter your dates, pick-up spot, and tell the AI your trip vibe—whether an executive roadshow or coastal getaway.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-6 relative">
              <span className="text-5xl font-black text-slate-800/80 absolute top-4 right-6 select-none">
                02
              </span>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                2. AI Matches & Customizes
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                The recommendation engine compares specs, real-time rates, and luggage capacity to curate optimal matches.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/30 border border-slate-800/80 p-6 relative">
              <span className="text-5xl font-black text-slate-800/80 absolute top-4 right-6 select-none">
                03
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                3. Instant Stripe Checkout & Drive
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Lock your reservation in seconds with secure Stripe payment. Receive digital keys right on your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-blue-950/50 to-slate-900/80 border border-blue-500/30 p-8 sm:p-14 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Instant 15% Off Your First AI Booking
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Upgrade Your Next Road Journey?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Join thousands of drivers experiencing intelligent matching, guaranteed vehicle quality, and seamless Stripe transactions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-3.5 rounded-xl font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/cars"
                className="px-8 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-600 transition-all hover:scale-[1.02]"
              >
                Browse Fleet
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
