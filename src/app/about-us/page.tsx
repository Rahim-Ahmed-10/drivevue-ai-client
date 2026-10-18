"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Car, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Terminal, 
  Database, 
  Smartphone 
} from "lucide-react";

export default function AboutUsPage() {
  const stats = [
    {
      value: "50+",
      label: "Hand-Curated Vehicles",
      detail: "Tesla, Porsche, BMW & Mercedes",
      accent: "text-blue-400",
      bgGlow: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      value: "99.8%",
      label: "AI Match Accuracy",
      detail: "Powered by Google Gemini telemetry",
      accent: "text-cyan-400",
      bgGlow: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    },
    {
      value: "10,000+",
      label: "Trips Completed",
      detail: "Across 14 metro travel hubs",
      accent: "text-emerald-400",
      bgGlow: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      value: "4.9 / 5.0",
      label: "Verified Driver Rating",
      detail: "Zero hidden fees & 24/7 support",
      accent: "text-amber-400",
      bgGlow: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  const pillars = [
    {
      icon: Cpu,
      title: "Google Gemini AI Matchmaking",
      description:
        "Forget sorting through endless car grids. Our intelligent recommender processes your trip itinerary, passenger luggage, driving style, and efficiency goals to recommend the perfect vehicle in milliseconds.",
      badge: "Smart Telemetry",
      badgeColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      icon: KeyRound,
      title: "Instant Digital Key Access",
      description:
        "Skip the rental counter and long terminal queues. Every verified booking unlocks directly from your smartphone via secure Bluetooth NFC telemetry as soon as you step on the tarmac.",
      badge: "Zero Wait Time",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      icon: Lock,
      title: "Bank-Grade Stripe Checkout",
      description:
        "Experience frictionless, transparent billing powered by Stripe. Real-time tax calculation, zero-surprise deposits, and instantaneous reservation holds backed by PCI-DSS Level 1 encryption.",
      badge: "Secure Payments",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      icon: ShieldCheck,
      title: "24/7 Concierge & Protection",
      description:
        "Every DriveVue rental includes $0-deductible standard vehicle protection, real-time supercharger routing, and 24/7 live concierge dispatch whenever you need roadside assistance.",
      badge: "Full Coverage",
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
  ];

  const techStack = [
    {
      icon: Layers,
      name: "Next.js 16 & Turbopack",
      category: "Frontend Architecture",
      description: "Blazing fast server rendering, partial prefetching, and strict client hydration.",
      tag: "App Router",
    },
    {
      icon: Sparkles,
      name: "Google Gemini Pro AI",
      category: "Intelligence Engine",
      description: "Natural language contextual understanding and vehicle suitability scoring.",
      tag: "LLM API",
    },
    {
      icon: Lock,
      name: "Stripe Connect SDK",
      category: "Financial Infrastructure",
      description: "Encrypted payment sessions, automated refunds, and webhook event listeners.",
      tag: "PCI-DSS",
    },
    {
      icon: Smartphone,
      name: "Tailwind CSS & Framer Motion",
      category: "Design System",
      description: "Sleek dark mode glassmorphism with 60fps hardware-accelerated micro-animations.",
      tag: "Modern UI",
    },
    {
      icon: Terminal,
      name: "Node.js & Express 5",
      category: "Backend Services",
      description: "High-throughput REST APIs with JWT authentication and strict rate limiting.",
      tag: "Microservices",
    },
    {
      icon: Database,
      name: "MongoDB Atlas Cloud",
      category: "Distributed Database",
      description: "High-availability clustering storing vehicle telemetry, bookings, and auth logs.",
      tag: "Cloud Cluster",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-28 pb-24 overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-16 left-1/4 w-[750px] h-[450px] bg-blue-600/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[600px] h-[400px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-40 left-10 w-[550px] h-[350px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        {/* =========================================================================
            SECTION 1: HERO BANNER
        ========================================================================== */}
        <section className="text-center max-w-4xl mx-auto pt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-blue-400 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Pioneering Intelligent Mobility</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]"
          >
            The Future of Mobility Engine:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
              Where AI Meets Premium Fleet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            Traditional car rental is plagued with counter queues, hidden surcharges, and guesswork. 
            DriveVue AI replaces the old model with automated matchmaking, instant digital keys, and bank-grade Stripe checkout.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/cars"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Explore Our AI Fleet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/ai-assistant"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Recommender</span>
            </Link>
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 2: METRICS & IMPACT COUNTERS
        ========================================================================== */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-6 rounded-3xl bg-slate-900/60 border ${item.border} backdrop-blur-xl shadow-xl hover:border-slate-700 transition-all group`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-3xl sm:text-4xl font-extrabold ${item.accent} tracking-tight`}>
                    {item.value}
                  </span>
                  <div className={`w-8 h-8 rounded-xl ${item.bgGlow} flex items-center justify-center`}>
                    <TrendingUp className={`w-4 h-4 ${item.accent}`} />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-400">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: MISSION & NARRATIVE (SPLIT SHOWCASE)
        ========================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">
              Our Founding Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Reimagining Vehicle Rental From the Ground Up
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We started DriveVue AI with a single mission: to eliminate the friction between stepping off a flight and driving away in a vehicle perfectly tailored to your trip.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              By combining Google Gemini multimodal intelligence with an all-electric and luxury lineup, we analyze your luggage size, passenger dynamics, and charging availability along your route. The result? A personalized, verified vehicle delivered with instant smartphone unlock and transparent pricing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Counter Wait</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Keyless digital unlock directly from your phone.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Hidden Fees</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Transparent breakdowns verified through Stripe.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 shadow-2xl backdrop-blur-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">DriveVue AI Telemetry</h4>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Cluster Online
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">v2.4 Pro</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-500">Fleet Availability:</span>
                  <span className="text-cyan-400 font-semibold">96.4% Ready</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-500">Avg. Reservation Time:</span>
                  <span className="text-emerald-400 font-semibold">42 Seconds</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between">
                  <span className="text-slate-500">Payment Security:</span>
                  <span className="text-blue-400 font-semibold">Stripe Encrypted</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-xs text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300 shrink-0" />
                  <span>Gemini AI optimizes pricing and battery range dynamically for every trip.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: KEY PILLARS (WHY DRIVEVUE)
        ========================================================================== */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full inline-block">
              Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Travelers Choose DriveVue AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Four fundamental pillars engineered to make renting a car as smooth as unlocking your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 backdrop-blur-xl shadow-xl transition-all hover:scale-[1.01] space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: TECHNOLOGY STACK SHOWCASE
        ========================================================================== */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full inline-block">
              Engineering Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built on Modern Cloud Technologies
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              High-availability architecture designed for ultra-low latency, bank-level security, and real-time intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                  className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 transition-all backdrop-blur-xl shadow-lg space-y-3 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:text-blue-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                      {tech.tag}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 block mb-0.5">
                      {tech.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {tech.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: CALL TO ACTION (CTA)
        ========================================================================== */}
        <section>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/80 border border-blue-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl backdrop-blur-2xl">
            {/* Inner ambient glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-500/20 blur-[130px] pointer-events-none rounded-full" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 rounded-full inline-block">
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Ready to Experience Intelligent Mobility?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Browse our hand-inspected fleet of electric cruisers, executive luxury sedans, and family SUVs. Lock your hold in seconds with encrypted Stripe checkout.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/cars"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Car className="w-4 h-4" />
                <span>Explore Fleet & Reserve</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/ai-assistant"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-wider text-slate-200 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Chat with AI Concierge</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
