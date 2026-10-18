"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  Fuel,
  Users,
  Gauge,
  CheckCircle2,
  Star,
  Calendar,
  Lock,
  Loader2,
  AlertCircle,
  Clock,
  Check
} from "lucide-react";
import api from "@/lib/api";
import { Car } from "@/types/car";
import { MOCK_CARS } from "@/lib/mockCars";

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("token") || localStorage.getItem("auth_token"));
}

function getAuthServerSnapshot() {
  return false;
}

function CarDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const carId = Array.isArray(params?.id) ? params.id[0] : params?.id || "mock-car-1";

  // Initial car lookup from local mock dataset for zero-latency instant render
  const initialCar = useMemo(() => {
    return MOCK_CARS.find((c) => c._id === carId || c.id === carId) || MOCK_CARS[0];
  }, [carId]);

  const [car, setCar] = useState<Car>(initialCar);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Default dates: tomorrow and 3 days later
  const todayStr = "2026-10-18";
  const defaultPickupStr = "2026-10-19";
  const defaultReturnStr = "2026-10-22";

  const [pickupDate, setPickupDate] = useState(defaultPickupStr);
  const [returnDate, setReturnDate] = useState(defaultReturnStr);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Check if authenticated using React 19 concurrent-safe store
  const isAuthenticated = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getAuthServerSnapshot);

  // Attempt to fetch fresh car data from backend API
  useEffect(() => {
    let isMounted = true;
    api
      .get(`/cars/${carId}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.data) {
          setCar(res.data.data);
        }
      })
      .catch(() => {
        // Fallback to initialCar gracefully without blocking UI
      });

    return () => {
      isMounted = false;
    };
  }, [carId]);

  // Gallery images with high-resolution complimentary views
  const galleryImages = useMemo(() => {
    const list = [...(car.images || [])];
    if (list.length === 0) {
      list.push("https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80");
    }
    if (list.length === 1) {
      list.push(
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80"
      );
    }
    return list;
  }, [car.images]);

  // Derive date validation error directly during render without effect
  const dateError = useMemo(() => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    if (isNaN(start) || isNaN(end) || end <= start) {
      return "Return date must be at least 1 day after pick-up date.";
    }
    return "";
  }, [pickupDate, returnDate]);

  // Validate dates and calculate rental duration in days
  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();

    if (isNaN(start) || isNaN(end)) {
      return 1;
    }

    if (end <= start) {
      return 0;
    }

    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [pickupDate, returnDate]);

  // Pricing calculations
  const subtotal = rentalDays * car.pricePerDay;
  const tax = Math.round(subtotal * 0.08); // 8% tax & municipal fee
  const totalAmount = subtotal + tax;

  const isElectric =
    car.fuelType?.toLowerCase() === "electric" ||
    car.category?.toLowerCase() === "electric";

  // Features list
  const carFeatures = [
    "AI Predictive Cruise Control",
    "Panoramic UV Glass Sunroof",
    "High-Fidelity 18-Speaker Audio",
    "Smart Keyless Mobile Unlock",
    "Wireless Apple CarPlay & Android Auto",
    "360° Surround HD Vision Cameras",
    "Heated & Ventilated Front Seats",
    "Supercharging / Fuel Refill Credit",
  ];

  // 🚀 Direct Stripe Checkout Action Handler
  const handleProceedToCheckout = async () => {
    setCheckoutError("");

    if (dateError || rentalDays <= 0) {
      setCheckoutError("Please select a valid return date after your pick-up date.");
      return;
    }

    // Resolve MongoDB vehicle ObjectId (checking car._id, car.id, or route param carId)
    const rawCarId = car._id || car.id || carId;
    const isMongoId = rawCarId && /^[0-9a-fA-F]{24}$/.test(String(rawCarId));

    if (!isMongoId) {
      setCheckoutError("This demo vehicle is not linked to the live database. Please select an active vehicle from the fleet.");
      return;
    }

    const targetCarId = String(rawCarId);

    // 1. Check authentication
    if (!isAuthenticated) {
      router.push(`/login?redirect=/cars/${targetCarId}`);
      return;
    }

    setIsCheckingOut(true);

    try {
      // 2. Direct request to Stripe Checkout Session (Backend handles booking lifecycle)
      const sessionRes = await api.post("/api/payments/create-checkout-session", {
        carId: targetCarId,
        car: targetCarId,
        startDate: pickupDate,
        endDate: returnDate,
        totalAmount: totalAmount,
      });

      // Extract Stripe checkout URL from response
      const checkoutUrl =
        sessionRes.data?.url ||
        sessionRes.data?.data?.url ||
        sessionRes.data?.sessionUrl ||
        sessionRes.data?.data?.sessionUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      setCheckoutError("Unable to retrieve Stripe checkout URL from server response.");
    } catch (err: unknown) {
      console.error("[Stripe Flow Error]:", err);
      const apiErr = err as {
        response?: {
          status?: number;
          data?: { message?: string };
        };
        message?: string;
      };

      if (apiErr?.response?.status === 401) {
        setCheckoutError("Your login session has expired. Please sign in again.");
        router.push(`/login?redirect=/cars/${targetCarId}`);
        return;
      }

      if (apiErr?.response?.status === 404) {
        setCheckoutError(apiErr?.response?.data?.message || "Vehicle not found in the fleet database.");
        return;
      }

      if (apiErr?.response?.status === 400) {
        setCheckoutError(apiErr?.response?.data?.message || "Invalid reservation parameters. Please check your dates.");
        return;
      }

      const errorMsg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Payment connection error. Please try again or contact support.";
      setCheckoutError(errorMsg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-28 pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-24 left-1/4 w-[700px] h-[450px] bg-blue-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[500px] h-[400px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Vehicles</span>
          </Link>

          <span className="text-xs text-slate-500">
            Fleet Identifier: <span className="font-mono text-slate-400">{car._id || car.id}</span>
          </span>
        </div>

        {/* VEHICLE SHOWCASE & BOOKING SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Visual Gallery & Specs */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 shadow-2xl">
              <div className="relative h-80 sm:h-[440px] w-full overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryImages[activeImageIndex] || galleryImages[0]}
                  alt={car.name}
                  className="w-full h-full object-cover select-none transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-slate-950/85 border border-slate-700 text-blue-300 backdrop-blur-md">
                    {car.category || "Luxury"}
                  </span>
                  {car.isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 backdrop-blur-md">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Ready for Instant Unlock</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900/80 border border-slate-700 text-slate-400 backdrop-blur-md">
                      Currently Reserved
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-amber-400/20 text-amber-300 text-xs">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-sm">4.98</span>
                  <span className="text-slate-400">(142 verified trips)</span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="p-3 bg-slate-950/70 border-t border-slate-800 flex items-center gap-3 overflow-x-auto">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImageIndex === idx
                        ? "border-blue-500 shadow-md shadow-blue-500/30 scale-105"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Title & Specs */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {car.brand} • {car.year} Fleet Model
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  {car.name || `${car.brand} ${car.model}`}
                </h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Engineered for seamless acceleration, whisper-quiet cabin aerodynamics, and state-of-the-art telemetry.
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <Users className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Seats</span>
                  <span className="text-sm font-bold text-white">{car.seats || 5} Passengers</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  {isElectric ? <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" /> : <Fuel className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />}
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Powertrain</span>
                  <span className="text-sm font-bold text-white">{car.fuelType || "Electric"}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <Gauge className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Transmission</span>
                  <span className="text-sm font-bold text-white">{car.transmission || "Automatic"}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <Sparkles className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">AI Match</span>
                  <span className="text-sm font-bold text-white">99.8% Score</span>
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Vehicle Highlights & Amenities:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                  {carFeatures.map((feat, fIdx) => (
                    <div key={`feat-${fIdx}`} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget & Stripe Checkout */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl bg-slate-900/85 border border-slate-800/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
              <div className="pb-4 border-b border-slate-800 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daily Rate</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-3xl font-black text-white">${car.pricePerDay}</span>
                    <span className="text-xs text-slate-400"> / day</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Instant Hold</span>
                </div>
              </div>

              {/* Date Selection */}
              <div className="space-y-3.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Trip Dates
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Pick-up Date</label>
                    <input
                      type="date"
                      min={todayStr}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Return Date</label>
                    <input
                      type="date"
                      min={pickupDate}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                {dateError && (
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{dateError}</span>
                  </div>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 py-4 border-y border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>${car.pricePerDay} × {rentalDays} {rentalDays === 1 ? "day" : "days"}</span>
                  <span className="font-semibold text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Tax & Registration (8%)</span>
                  <span className="font-semibold text-slate-300">${tax}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm text-white">
                  <span>Total Due</span>
                  <span className="text-2xl text-blue-400">${totalAmount}</span>
                </div>
              </div>

              {checkoutError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Stripe Checkout CTA */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isCheckingOut || Boolean(dateError) || rentalDays <= 0}
                  onClick={handleProceedToCheckout}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Connecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Stripe Checkout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
          <div className="animate-pulse flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-500 animate-spin" />
            <span>Loading Vehicle Specifications...</span>
          </div>
        </div>
      }
    >
      <CarDetailsContent />
    </Suspense>
  );
}