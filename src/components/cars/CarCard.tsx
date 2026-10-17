"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, 
  Zap, 
  Fuel, 
  Gauge, 
  ArrowRight, 
  ShieldCheck, 
  Star
} from "lucide-react";
import { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
  index?: number;
}

export default function CarCard({ car, index = 0 }: CarCardProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback car image if URL fails or empty
  const defaultImage =
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80";

  const displayImage =
    imageError || !car.images || car.images.length === 0
      ? defaultImage
      : car.images[0];

  const isElectric =
    car.fuelType?.toLowerCase() === "electric" ||
    car.category?.toLowerCase() === "electric";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      className="group relative rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 flex flex-col justify-between"
    >
      {/* Top Media Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayImage}
          alt={car.name || `${car.brand} ${car.model}`}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient top vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Category Badge */}
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 border border-slate-700/80 text-blue-300 backdrop-blur-md shadow-md">
            {car.category || "Premium"}
          </span>

          {/* Availability Status Badge */}
          {car.isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 backdrop-blur-md shadow-md">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-900/80 border border-slate-700 text-slate-400 backdrop-blur-md">
              Booked
            </span>
          )}
        </div>

        {/* Bottom image overlay: Year & Rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          <span className="px-2 py-0.5 rounded bg-black/60 text-slate-300 font-medium backdrop-blur-md border border-white/10">
            {car.year || 2024}
          </span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-amber-300 border border-amber-400/20">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-xs">4.96</span>
          </div>
        </div>
      </div>

      {/* Card Body & Specs */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Name */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
              {car.brand}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">{car.model}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
            {car.name || `${car.brand} ${car.model}`}
          </h3>

          {/* Spec Badges Grid */}
          <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-slate-800/80 text-slate-300 text-xs">
            {/* Seats */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Users className="w-4 h-4 text-blue-400 mb-1" />
              <span className="font-medium text-[11px]">{car.seats || 5} Seats</span>
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              {isElectric ? (
                <Zap className="w-4 h-4 text-cyan-400 mb-1" />
              ) : (
                <Fuel className="w-4 h-4 text-indigo-400 mb-1" />
              )}
              <span className="font-medium text-[11px] truncate max-w-full">
                {car.fuelType || "Petrol"}
              </span>
            </div>

            {/* Transmission */}
            <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/60">
              <Gauge className="w-4 h-4 text-purple-400 mb-1" />
              <span className="font-medium text-[11px] truncate max-w-full">
                {car.transmission || "Automatic"}
              </span>
            </div>
          </div>

          {/* Micro assurance */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">Free cancellation up to 24h</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 flex items-center justify-between gap-2 border-t border-slate-800/60">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">${car.pricePerDay}</span>
              <span className="text-xs text-slate-400 font-medium">/ day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/cars/${car._id || car.id || "1"}`}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all"
            >
              Details
            </Link>
            <Link
              href={`/cars/${car._id || car.id || "1"}?action=rent`}
              className="px-4 py-2 rounded-xl font-semibold text-xs text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <span>Rent Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
