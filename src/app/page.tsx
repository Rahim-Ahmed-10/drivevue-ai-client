"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  Zap, 
  CheckCircle2, 
  Star, 
  Users, 
  Gauge, 
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();

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
          HERO BANNER SECTION (LUXURY SAAS / HIGH-END AUTOMOTIVE AESTHETIC)
         ========================================================================= */}
      <HeroSection />

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
