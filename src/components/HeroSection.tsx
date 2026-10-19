
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  CarFront,
  ShieldCheck,
  Zap,
  Gem,
  CalendarCheck,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const handleExploreCars = () => {
    router.push("/cars");
  };

  const handleAIAssistant = () => {
    // তোমার AI Assistant page-এর route অনুযায়ী পরিবর্তন করো
    router.push("/ai-assistant");
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#090d16] pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background grid */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* Background car image */}
        <div className="absolute left-1/2 top-[48%] w-full max-w-6xl -translate-x-1/2 -translate-y-1/2 opacity-25 blur-[0.5px] mix-blend-luminosity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-car.jpg"
            alt=""
            aria-hidden="true"
            className="h-auto w-full select-none object-cover"
          />
        </div>

        {/* Blue-cyan ambient glow */}
        <div className="absolute left-1/2 top-[45%] h-[450px] w-[900px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600/20 via-cyan-500/15 to-blue-600/20 blur-[140px]" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#090d16]/20 via-[#090d16]/35 to-[#090d16]" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        {/* Floating badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/85 px-4 py-2 shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-xl">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200 sm:text-xs">
            Next-Gen Luxury Mobility
          </span>

          <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-cyan-300">
            AI v2.0
          </span>
        </div>

        {/* Main heading */}
        <h2 className="max-w-5xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text pb-1 text-transparent">
            Discover Your Dream
          </span>

          <span className="mt-2 block bg-gradient-to-r from-blue-400 via-cyan-400 to-cyan-200 bg-clip-text pb-2 text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.25)]">
            AI-Driven Luxury Car
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300/90 sm:text-base md:text-lg">
          Your journey. Your style. Your perfect ride.
          Experience premium car rentals with intelligent AI
          recommendations, a luxury fleet, and secure booking.
        </p>

        {/* CTA buttons - replaces search bar */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={handleExploreCars}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-cyan-500/25 active:scale-[0.98] sm:w-auto sm:px-8"
          >
            <CarFront className="h-5 w-5" />
            Explore Luxury Cars
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={handleAIAssistant}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-cyan-500/40 bg-slate-950/70 px-7 py-3.5 text-sm font-bold text-cyan-200 backdrop-blur-xl transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-500/10 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] active:scale-[0.98] sm:w-auto sm:px-8"
          >
            <Sparkles className="h-5 w-5 text-cyan-400 transition-transform group-hover:rotate-12" />
            Meet Your AI Assistant
          </button>
        </div>

        {/* Feature highlights */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-300 sm:gap-x-8 sm:text-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Secure Booking</span>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span>Smart AI Matching</span>
          </div>

          <div className="flex items-center gap-2">
            <Gem className="h-4 w-4 text-cyan-400" />
            <span>Premium Fleet</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-cyan-400" />
            <span>Easy Reservations</span>
          </div>
        </div>

        {/* Statistics cards */}
        <div className="relative z-10 mt-14 grid w-full max-w-5xl grid-cols-2 gap-3 sm:mt-16 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40">
            <span className="text-2xl font-black tracking-tight text-blue-400 sm:text-3xl">
              500+
            </span>
            <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
              Verified Vehicles
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">
            <span className="text-2xl font-black tracking-tight text-cyan-400 sm:text-3xl">
              99.8%
            </span>
            <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
              AI Match Precision
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/75 p-4 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40">
            <span className="text-2xl font-black tracking-tight text-emerald-400 sm:text-3xl">
              $0
            </span>
            <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
              Hidden Booking Fees
            </p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/75 p-4 text-center shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40">
            <span className="flex items-center gap-1 text-2xl font-black tracking-tight text-amber-400 sm:text-3xl">
              4.95
              <span aria-hidden="true" className="text-xl">★</span>
            </span>
            <p className="mt-1 text-xs font-medium text-slate-400 sm:text-sm">
              15k+ Completed Trips
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
