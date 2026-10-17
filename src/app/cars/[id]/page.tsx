"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
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
  Check
} from "lucide-react";
import api from "@/lib/api";
import { Car } from "@/types/car";
import { MOCK_CARS } from "@/lib/mockCars";

function CarDetailsContent() {
  const router = useRouter();
  const params = useParams();
  const carId = Array.isArray(params?.id) ? params.id[0] : params?.id || "mock-car-1";

  // Initial car lookup from local mock dataset for zero-latency initial render
  const initialCar = useMemo(() => {
    return MOCK_CARS.find((c) => c._id === carId || c.id === carId) || MOCK_CARS[0];
  }, [carId]);

  const [car, setCar] = useState<Car>(initialCar);
  const [activeImage, setActiveImage] = useState<string>(
    initialCar.images?.[0] ||
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80"
  );
  const [pickupDate, setPickupDate] = useState("2026-10-20");
  const [returnDate, setReturnDate] = useState("2026-10-23");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Attempt to fetch fresh car data from backend API
  useEffect(() => {
    let isMounted = true;
    api
      .get(`/cars/${carId}`)
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.data) {
          setCar(res.data.data);
          if (res.data.data.images && res.data.data.images.length > 0) {
            setActiveImage(res.data.data.images[0]);
          }
        }
      })
      .catch(() => {
        // Fallback to initialCar gracefully without blocking UI
      });

    return () => {
      isMounted = false;
    };
  }, [carId]);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    const start = new Date(pickupDate).getTime();
    const end = new Date(returnDate).getTime();
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [pickupDate, returnDate]);

  const totalPrice = rentalDays * car.pricePerDay;

  const isElectric =
    car.fuelType?.toLowerCase() === "electric" ||
    car.category?.toLowerCase() === "electric";

  const handleInstantReserve = () => {
    setIsBooking(true);
    // Simulate instantaneous reservation hold
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
      setTimeout(() => {
        router.push("/bookings");
      }, 1200);
    }, 1000);
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
            Fleet ID: <span className="font-mono text-slate-400">{car._id || car.id}</span>
          </span>
        </div>

        {/* =========================================================================
            VEHICLE SHOWCASE & BOOKING SPLIT LAYOUT
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Visuals & Specifications (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Car Visual Card */}
            <div className="relative rounded-3xl overflow-hidden bg-slate-900/60 border border-slate-800 shadow-2xl">
              <div className="relative h-80 sm:h-[440px] w-full overflow-hidden bg-slate-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={car.name}
                  className="w-full h-full object-cover select-none transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

                {/* Badges on image */}
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
            </div>

            {/* Vehicle Title & Details */}
            <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  {car.brand} • {car.year} Release
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  {car.name || `${car.brand} ${car.model}`}
                </h1>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  Engineered for unparalleled dynamics, comfort, and state-of-the-art autonomous cockpit features.
                  Equipped with GPS concierge navigation, high-fidelity acoustics, and contactless digital smartphone key.
                </p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <Users className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Seats</span>
                  <span className="text-sm font-bold text-white">{car.seats || 5} Passengers</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
                  {isElectric ? (
                    <Zap className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
                  ) : (
                    <Fuel className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
                  )}
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
                  <span className="text-sm font-bold text-white">99.8% Match</span>
                </div>
              </div>

              {/* Verified Perks */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Included with Every DriveVue Reservation:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Free cancellation up to 24 hours prior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Comprehensive vehicle insurance coverage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited Supercharger access / Fuel refill credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>24/7 dedicated concierge roadside dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout & Booking Card (1 col) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-3xl bg-slate-900/80 border border-slate-800/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
              {/* Daily Rate Header */}
              <div className="pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Pricing</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-white">${car.pricePerDay}</span>
                  <span className="text-xs text-slate-400"> / day</span>
                </div>
              </div>

              {/* Trip Dates Selector */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-400" />
                  Select Trip Dates
                </label>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Pick-up Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark]"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-transparent text-xs text-white focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Price Breakdown Calculation */}
              <div className="space-y-2.5 py-4 border-y border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>
                    ${car.pricePerDay} x {rentalDays} {rentalDays === 1 ? "day" : "days"}
                  </span>
                  <span className="font-semibold text-white">${totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Route & Concierge Assist</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Vehicle Protection</span>
                  <span className="text-emerald-400 font-semibold">$0 Deposit</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm text-white">
                  <span>Total Amount</span>
                  <span className="text-xl text-blue-400">${totalPrice}</span>
                </div>
              </div>

              {/* Success Feedback Banner */}
              {bookingSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Reservation confirmed! Redirecting to bookings...</span>
                </div>
              )}

              {/* Primary Action Button */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isBooking || bookingSuccess}
                  onClick={handleInstantReserve}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Reservation...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Reserve & Pay with Stripe</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  Instant card pre-authorization. Zero cancellation fee.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400 border-t border-slate-800">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Stripe 256-bit</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PCI Compliant</span>
                </div>
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
            <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
            <span>Loading Vehicle Details...</span>
          </div>
        </div>
      }
    >
      <CarDetailsContent />
    </Suspense>
  );
}
