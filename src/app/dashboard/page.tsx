"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Car, 
  Sparkles, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  ExternalLink, 
  User, 
  Award, 
  ChevronRight, 
  Compass 
} from "lucide-react";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-changed", callback);
  };
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem("token") || localStorage.getItem("auth_token"));
}

function getAuthServerSnapshot() {
  return false;
}

function getUserSnapshot() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("user") || "";
}

function getUserServerSnapshot() {
  return "";
}

export default function DashboardPage() {
  const isAuthenticated = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getAuthServerSnapshot);
  const userJson = useSyncExternalStore(subscribeToAuth, getUserSnapshot, getUserServerSnapshot);

  const currentUser = useMemo(() => {
    if (!userJson) {
      return isAuthenticated ? { name: "Driver", email: "" } : null;
    }
    try {
      return JSON.parse(userJson) as { name: string; email: string; role?: string };
    } catch {
      return { name: "Driver", email: "" };
    }
  }, [userJson, isAuthenticated]);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch bookings data
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let isMounted = true;
    api
      .get("/bookings/my-bookings")
      .then((res) => {
        if (!isMounted) return;
        if (res.data && res.data.data) {
          setBookings(res.data.data);
        } else if (Array.isArray(res.data)) {
          setBookings(res.data);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        console.error("[Dashboard Fetch Error]:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, refreshTrigger]);

  const isLoading = isAuthenticated ? loading : false;

  const handleRefresh = () => {
    setLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Calculations
  const activeBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING");
  }, [bookings]);

  const completedTrips = useMemo(() => {
    return bookings.filter((b) => b.status === "COMPLETED");
  }, [bookings]);

  const totalSpent = useMemo(() => {
    return bookings
      .filter((b) => b.paymentStatus === "PAID" && b.status !== "CANCELLED")
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  }, [bookings]);

  // Next upcoming or most recent active rental
  const nextRental = activeBookings.length > 0 ? activeBookings[0] : null;

  // Recent 4 bookings for the activity feed
  const recentBookings = useMemo(() => {
    return bookings.slice(0, 5);
  }, [bookings]);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-28 pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/4 w-[650px] h-[380px] bg-blue-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[550px] h-[350px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* =========================================================================
            HEADER & PROFILE HERO
        ========================================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center text-blue-400">
                <User className="w-8 h-8" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {currentUser?.name || "Verified Driver"}!
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Verified Member
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                {currentUser?.email || "DriveVue AI Fleet Telemetry & Personal Garage"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
              <span>Sync</span>
            </button>

            <Link
              href="/cars"
              className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white transition-all shadow-md shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Book New Car</span>
            </Link>
          </div>
        </div>

        {/* Unauthenticated Prompt */}
        {!isAuthenticated && (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-center space-y-5 max-w-lg mx-auto shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
              <KeyRound className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-white">Sign In Required</h2>
              <p className="text-xs text-slate-400">
                Log in to view your real-time vehicle holds, Stripe transaction records, and digital unlock telemetry.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login?redirect=/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>Sign In to DriveVue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* =========================================================================
            AUTHENTICATED DASHBOARD CONTENT
        ========================================================================== */}
        {isAuthenticated && (
          <>
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Active Reservations</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white">{activeBookings.length}</span>
                  <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    Upcoming
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Trips Completed</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white">{completedTrips.length}</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">Total Fleet Spend</span>
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-cyan-400">${totalSpent}</span>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    Stripe Paid
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-2"
              >
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-semibold">AI Driving Score</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-white">98 <span className="text-sm font-normal text-slate-500">/100</span></span>
                  <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                    Platinum Tier
                  </span>
                </div>
              </motion.div>
            </div>

            {/* =========================================================================
                ACTIVE RENTAL SPOTLIGHT (HERO CARD)
            ========================================================================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-400" />
                  <span>Immediate Active Hold</span>
                </h2>
                <Link
                  href="/my-bookings"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  <span>View All in Garage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {nextRental ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-blue-950/40 border border-blue-500/30 shadow-2xl backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-full sm:w-56 h-36 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          nextRental.car?.images && nextRental.car.images.length > 0
                            ? nextRental.car.images[0]
                            : "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={nextRental.car?.name || "Vehicle"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {nextRental.car?.category || "Luxury"}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          {nextRental.car?.year || 2024} Model
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white tracking-tight">
                        {nextRental.car?.brand} {nextRental.car?.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(nextRental.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                          {new Date(nextRental.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="font-semibold text-emerald-400">
                          ${nextRental.totalPrice} Paid (Stripe)
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-xs text-cyan-300">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>Digital Key Ready · Instant Keyless Access Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
                    {nextRental.car?._id && (
                      <Link
                        href={`/cars/${nextRental.car._id}`}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Vehicle Specs</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </Link>
                    )}

                    <Link
                      href="/my-bookings"
                      className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white text-center transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
                    >
                      <span>Manage Booking</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mx-auto">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">No Active Rental Hold</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      You currently have no vehicles reserved. Let our Gemini AI engine match the perfect car for your next trip.
                    </p>
                  </div>
                  <Link
                    href="/cars"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02]"
                  >
                    <span>Browse Fleet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* =========================================================================
                RECENT ACTIVITY TABLE / GRID
            ========================================================================== */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Recent Fleet Activity</span>
                </h2>
                <Link
                  href="/my-bookings"
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  View Complete History
                </Link>
              </div>

              {recentBookings.length > 0 ? (
                <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 overflow-hidden backdrop-blur-xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-4 px-6">Vehicle</th>
                          <th className="py-4 px-6">Rental Dates</th>
                          <th className="py-4 px-6">Total Paid</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {recentBookings.map((b) => {
                          const isPaid = b.paymentStatus === "PAID";
                          const isCancelled = b.status === "CANCELLED";
                          const isConfirmed = b.status === "CONFIRMED" || b.status === "PENDING";

                          return (
                            <tr key={b._id || b.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="py-4 px-6 font-semibold text-white">
                                {b.car?.brand} {b.car?.name || "Vehicle"}
                              </td>
                              <td className="py-4 px-6 text-slate-400">
                                {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                                {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </td>
                              <td className="py-4 px-6 font-mono font-bold text-cyan-300">
                                ${b.totalPrice}
                              </td>
                              <td className="py-4 px-6 space-y-1">
                                <div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                      isCancelled
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                        : isConfirmed
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}
                                  >
                                    {isCancelled ? (
                                      <XCircle className="w-3 h-3" />
                                    ) : (
                                      <CheckCircle2 className="w-3 h-3" />
                                    )}
                                    <span>{b.status}</span>
                                  </span>
                                </div>
                                <div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                      isPaid
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    }`}
                                  >
                                    <span>{isPaid ? "Stripe Paid" : "Payment Pending"}</span>
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <Link
                                  href="/my-bookings"
                                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                                >
                                  <span>Details</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 text-center text-xs text-slate-400">
                  No previous reservations on record yet.
                </div>
              )}
            </div>

            {/* =========================================================================
                QUICK SHORTCUTS GRID
            ========================================================================== */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-400" />
                <span>Quick Shortcuts & Tools</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/cars"
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all backdrop-blur-xl shadow-lg space-y-2 group hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <Car className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                    Explore Fleet
                  </h3>
                  <p className="text-xs text-slate-400">
                    Filter by luxury sedans, electric cruisers, and family SUVs.
                  </p>
                </Link>

                <Link
                  href="/ai-assistant"
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all backdrop-blur-xl shadow-lg space-y-2 group hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    AI Concierge
                  </h3>
                  <p className="text-xs text-slate-400">
                    Get real-time trip matchmaking and luggage optimization.
                  </p>
                </Link>

                <Link
                  href="/my-bookings"
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all backdrop-blur-xl shadow-lg space-y-2 group hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    My Garage
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage holds, release reservations, and review Stripe sessions.
                  </p>
                </Link>

                <Link
                  href="/about-us"
                  className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all backdrop-blur-xl shadow-lg space-y-2 group hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Why DriveVue
                  </h3>
                  <p className="text-xs text-slate-400">
                    Zero counter wait, $0 deductible protection, and EV mission.
                  </p>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
