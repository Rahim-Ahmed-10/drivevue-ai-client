
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
  Star,
} from "lucide-react";
import { Car } from "@/types/car";

interface CarCardProps {
  car: Car;
  index?: number;
}

export default function CarCard({
  car,
  index = 0,
}: CarCardProps) {
  const [imageError, setImageError] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=900&q=85";

  const displayImage =
    !imageError && car.images?.length
      ? car.images[0]
      : defaultImage;

  const isElectric =
    car.fuelType?.toLowerCase() === "electric" ||
    car.category?.toLowerCase() === "electric";

  const carId = String(car._id || car.id || "1");

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.04, 0.24),
      }}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0c1423] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/30"
    >
      {/* Car image */}
      <Link
        href={`/cars/${carId}`}
        aria-label={`View ${car.name || `${car.brand} ${car.model}`}`}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-900"
      >
        <img
          src={displayImage}
          alt={car.name || `${car.brand} ${car.model}`}
          onError={() => {
            if (!imageError) setImageError(true);
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080e19]/80 via-transparent to-black/20" />

        {/* Category and availability */}
        <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-2">
          <span className="max-w-[55%] truncate rounded-lg border border-white/10 bg-[#0a1020]/90 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-300 backdrop-blur-md">
            {car.category || "Premium"}
          </span>

          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur-md ${car.isAvailable
                ? "border-emerald-500/25 bg-emerald-950/90 text-emerald-400"
                : "border-slate-600/50 bg-slate-900/90 text-slate-300"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${car.isAvailable
                  ? "bg-emerald-400"
                  : "bg-slate-400"
                }`}
            />
            {car.isAvailable ? "Available" : "Booked"}
          </span>
        </div>

        {/* Year and rating */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="rounded-md border border-white/10 bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {car.year || 2024}
          </span>

          <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/20 bg-black/70 px-2 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
            <Star className="h-3.5 w-3.5 fill-current" />
            4.96
          </span>
        </div>
      </Link>

      {/* Car details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="min-w-0">
          <div className="mb-1.5 flex min-w-0 items-center gap-2 text-[10px] font-semibold uppercase tracking-wider">
            <span className="truncate text-blue-400">
              {car.brand}
            </span>
            <span className="text-slate-600">•</span>
            <span className="truncate font-medium normal-case tracking-normal text-slate-400">
              {car.model}
            </span>
          </div>

          <h3
            title={car.name || `${car.brand} ${car.model}`}
            className="truncate text-base font-bold text-slate-100 transition-colors group-hover:text-blue-300"
          >
            {car.name || `${car.brand} ${car.model}`}
          </h3>
        </div>

        {/* Compact specifications */}
        <div className="my-4 grid grid-cols-3 gap-2">
          <div className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-slate-800/80 bg-[#080f1d] px-1 py-3">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-[11px] font-medium text-slate-300">
              {car.seats || 5} Seats
            </span>
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-slate-800/80 bg-[#080f1d] px-1 py-3">
            {isElectric ? (
              <Zap className="h-4 w-4 text-cyan-400" />
            ) : (
              <Fuel className="h-4 w-4 text-indigo-400" />
            )}
            <span className="max-w-full truncate px-1 text-[11px] font-medium text-slate-300">
              {car.fuelType || "Petrol"}
            </span>
          </div>

          <div className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-slate-800/80 bg-[#080f1d] px-1 py-3">
            <Gauge className="h-4 w-4 text-purple-400" />
            <span className="max-w-full truncate px-1 text-[11px] font-medium text-slate-300">
              {car.transmission || "Automatic"}
            </span>
          </div>
        </div>

        {/* Trust information */}
        <div className="mb-4 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>Free cancellation up to 24h</span>
        </div>

        {/* Price and actions */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-800 pt-4">
          <div className="min-w-0">
            <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-slate-500">
              Daily rate
            </p>
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="text-xl font-extrabold tracking-tight text-white">
                ${car.pricePerDay}
              </span>
              <span className="text-[11px] text-slate-400">
                / day
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href={`/cars/${carId}`}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-700 px-3 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            >
              Details
            </Link>

            {car.isAvailable ? (
              <Link
                href={`/cars/${carId}?action=rent`}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 text-xs font-bold text-white shadow-md shadow-blue-950/30 transition hover:bg-blue-500 active:scale-[0.98]"
              >
                Rent
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-xl bg-slate-800 px-3 text-xs font-semibold text-slate-500"
              >
                Booked
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
