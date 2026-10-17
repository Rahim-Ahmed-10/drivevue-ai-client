"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CreditCard, 
  Headphones, 
  Zap, 
  CheckCircle2, 
  Star, 
  Users, 
  Gauge, 
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [location, setLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const categories = [
    { id: "all", label: "All Vehicles" },
    { id: "electric", label: "Electric & Hybrid" },
    { id: "luxury", label: "Luxury Sedans" },
    { id: "suv", label: "Premium SUVs" },
    { id: "sports", label: "Performance" },
  ];

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
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-80 right-0 w-[450px] h-[450px] bg-cyan-500/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none -z-10" />

      {/* =========================================================================
          1. HERO SECTION
         ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Top AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-lg shadow-indigo-500/10 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-blue-400">
              Next-Gen Mobility • AI-Powered Car Rentals
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl leading-[1.12]">
            Smart Car Rentals{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">
              Powered by AI
            </span>
          </h1>

          {/* Catchy Subtext */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Skip the paperwork and guesswork. Our deep-learning recommendation engine
            pairs your trip, vibe, and budget with high-performance electric and luxury vehicles in seconds.
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/cars"
              className="relative group px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Explore Fleet</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/ai-assistant"
              className="px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500/50 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Ask AI Recommender</span>
            </Link>
          </div>

          {/* Interactive Search Bar Preview Card */}
          <div className="w-full max-w-4xl mt-10 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl shadow-black/80 backdrop-blur-xl p-4 sm:p-6 text-left">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-slate-800/80 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    selectedCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/40"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Location Input */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 focus-within:border-indigo-500 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Pick-up City / Airport
                </label>
                <input
                  type="text"
                  placeholder="e.g. Los Angeles (LAX)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Pickup Date */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 focus-within:border-indigo-500 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  Pick-up Date
                </label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none [color-scheme:dark]"
                />
              </div>

              {/* Return Date */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 focus-within:border-indigo-500 transition-colors">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Return Date
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none [color-scheme:dark]"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center">
                <Link
                  href={`/cars?category=${selectedCategory}${location ? `&location=${encodeURIComponent(location)}` : ""}`}
                  className="w-full h-full min-h-[52px] rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>Find My Ride</span>
                </Link>
              </div>
            </div>

            {/* Micro assurance */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free cancellation up to 24h before trip
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant digital key unlock available
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified 100% clean fleet
              </span>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 max-w-4xl w-full">
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                500+
              </span>
              <span className="text-xs text-slate-400 mt-1">Luxury & EV Vehicles</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                99.8%
              </span>
              <span className="text-xs text-slate-400 mt-1">AI Match Accuracy</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                $0
              </span>
              <span className="text-xs text-slate-400 mt-1">Hidden Booking Fees</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center gap-1">
                4.95 <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
              </span>
              <span className="text-xs text-slate-400 mt-1">Over 15,000+ Trips</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CORE FEATURES GRID (AI Recommendation, Stripe Payment, 24/7 Support)
         ========================================================================= */}
      <section className="relative py-20 bg-slate-950/60 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
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
            <div className="relative group rounded-2xl bg-slate-900/50 border border-slate-800/80 p-8 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mb-6 shadow-inner">
                <Sparkles className="w-7 h-7 text-cyan-400" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
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
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Personalized trip & luggage matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Dynamic price optimization index</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Autonomous conversational car selector</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Instant Stripe Payment */}
            <div className="relative group rounded-2xl bg-slate-900/50 border border-slate-800/80 p-8 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center mb-6 shadow-inner">
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
          3. FEATURED FLEET SHOWCASE
         ========================================================================= */}
      <section className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View All 500+ Cars</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="group rounded-2xl bg-slate-900/40 border border-slate-800/80 overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col"
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
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-600/90 text-white shadow-md backdrop-blur-sm">
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
                  <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
                    {car.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5 group-hover:text-cyan-200 transition-colors">
                    {car.name}
                  </h3>

                  {/* Specs */}
                  <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-800/70 text-slate-300 text-xs">
                    <div className="flex flex-col items-center">
                      <Gauge className="w-4 h-4 text-cyan-400 mb-1" />
                      <span>{car.specs.acceleration}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Zap className="w-4 h-4 text-indigo-400 mb-1" />
                      <span>{car.specs.range}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="w-4 h-4 text-purple-400 mb-1" />
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
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-indigo-600 transition-all flex items-center gap-1.5 shadow-sm"
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
          4. HOW IT WORKS / TIMELINE
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
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold mb-4">
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
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold mb-4">
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
          5. CALL TO ACTION BANNER
         ========================================================================= */}
      <section className="relative py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-14 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
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
                className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-xl shadow-indigo-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all"
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
