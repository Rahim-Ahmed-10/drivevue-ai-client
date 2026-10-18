"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { 
  Calendar, 
  Car as CarIcon, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight, 
  RefreshCw, 
  KeyRound, 
  ExternalLink, 
  Filter, 
  Sparkles, 
  Copy, 
  Check,
  AlertTriangle,
  Loader2
} from "lucide-react";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

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

export default function MyBookingsPage() {
  const isAuthenticated = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getAuthServerSnapshot);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "CONFIRMED" | "COMPLETED" | "CANCELLED">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [modalBooking, setModalBooking] = useState<Booking | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // User-initiated manual refresh
  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshTrigger((prev) => prev + 1);
  };

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
        console.error("[My Bookings Fetch Error]:", err);
        const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
        setError(
          apiErr?.response?.data?.message ||
            "Failed to load your reservations. Please check your network connection."
        );
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, refreshTrigger]);

  const isLoading = isAuthenticated ? loading : false;

  // Handle Cancel Booking confirmation (Custom Modal -> API)
  const confirmCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await api.patch(`/bookings/cancel/${bookingId}`);
      // Refresh local list
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
      setModalBooking(null);
      toast.success("Reservation cancelled successfully. Hold released.", {
        icon: "✅",
        duration: 4000,
      });
    } catch (err: unknown) {
      console.error("[Cancel Booking Error]:", err);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        apiErr?.response?.data?.message ||
          "Unable to cancel reservation. Please contact 24/7 concierge support.",
        {
          duration: 5000,
        }
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleCopySession = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    setCopiedId(sessionId);
    toast.success("Stripe session reference copied to clipboard!", {
      icon: "📋",
      duration: 2500,
    });
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Filtered list based on tab
  const filteredBookings = useMemo(() => {
    if (activeTab === "ALL") return bookings;
    if (activeTab === "CONFIRMED") {
      return bookings.filter(
        (b) => b.status === "CONFIRMED" || b.status === "PENDING"
      );
    }
    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  // Stats calculation
  const totalSpent = useMemo(() => {
    return bookings
      .filter((b) => b.paymentStatus === "PAID" && b.status !== "CANCELLED")
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  }, [bookings]);

  const activeReservationsCount = useMemo(() => {
    return bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").length;
  }, [bookings]);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-28 pb-24 overflow-hidden">
      {/* Toast Notification Container with Dark Glassmorphism Styling */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: "bg-slate-900 text-slate-100 border border-slate-800 shadow-2xl backdrop-blur-xl",
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid #1e293b",
            borderRadius: "1rem",
            padding: "12px 18px",
            fontSize: "0.875rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#0f172a",
            },
          },
        }}
      />

      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/4 w-[600px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[500px] h-[350px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Breadcrumbs & Status */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>DriveVue Member Garage</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Vehicle Reservations
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Manage your active reservations, inspect verified Stripe payment sessions, and access digital keys for smart keyless unlock.
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
                <span>Refresh</span>
              </button>

              <Link
                href="/cars"
                className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white transition-all shadow-md shadow-blue-600/25 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CarIcon className="w-3.5 h-3.5" />
                <span>Explore Fleet</span>
              </Link>
            </div>
          )}
        </div>

        {/* Unauthenticated State */}
        {!isAuthenticated && (
          <div className="max-w-xl mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-lg shadow-blue-500/20">
              <KeyRound className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Sign In to View Your Garage</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Log in to your DriveVue AI account to view your confirmed car bookings, track Stripe checkout payments, and download digital rental keys.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login?redirect=/my-bookings"
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to DriveVue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-900 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Authenticated Dashboard Content */}
        {isAuthenticated && (
          <div className="space-y-8">
            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <span className="text-xs text-slate-400 block mb-1">Active Holds</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white">{activeReservationsCount}</span>
                  <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    Live Status
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <span className="text-xs text-slate-400 block mb-1">Total Fleet Spend</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-emerald-400">${totalSpent}</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Stripe Verified
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <span className="text-xs text-slate-400 block mb-1">Protection Plan</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-white">Full Coverage</span>
                  <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    Zero Deductible
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3 overflow-x-auto">
              <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
              {(
                [
                  { id: "ALL", label: `All (${bookings.length})` },
                  { id: "CONFIRMED", label: "Confirmed / Active" },
                  { id: "COMPLETED", label: "Completed" },
                  { id: "CANCELLED", label: "Cancelled" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                      : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-3 text-xs text-red-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white text-[11px] font-semibold transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 animate-pulse flex flex-col md:flex-row gap-6"
                  >
                    <div className="w-full md:w-64 h-44 rounded-2xl bg-slate-800/60 shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-6 w-1/3 bg-slate-800/80 rounded-lg" />
                      <div className="h-4 w-1/4 bg-slate-800/60 rounded-lg" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                        <div className="h-10 bg-slate-800/40 rounded-xl" />
                        <div className="h-10 bg-slate-800/40 rounded-xl" />
                        <div className="h-10 bg-slate-800/40 rounded-xl" />
                        <div className="h-10 bg-slate-800/40 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredBookings.length === 0 && (
              <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">No Reservations Found</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                    {activeTab === "ALL"
                      ? "Your member garage is currently empty. Explore our AI-curated fleet of premium electric cruisers and luxury sedans to lock your first ride."
                      : `You have no ${activeTab.toLowerCase()} bookings under this filter.`}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/cars"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
                  >
                    <CarIcon className="w-4 h-4" />
                    <span>Explore Fleet & Book</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Booking Cards List */}
            {!isLoading && filteredBookings.length > 0 && (
              <div className="space-y-5">
                <AnimatePresence>
                  {filteredBookings.map((b) => {
                    const car = b.car;
                    const carImage =
                      car?.images && car.images.length > 0
                        ? car.images[0]
                        : "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80";

                    const startDateFormatted = b.startDate
                      ? new Date(b.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD";

                    const endDateFormatted = b.endDate
                      ? new Date(b.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "TBD";

                    const isPaid = b.paymentStatus === "PAID";
                    const isCancelled = b.status === "CANCELLED";
                    const isConfirmed = b.status === "CONFIRMED" || b.status === "PENDING";

                    return (
                      <motion.div
                        key={b._id || b.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700/80 transition-all backdrop-blur-xl shadow-xl flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
                      >
                        {/* Vehicle Photo & Title */}
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full lg:w-auto">
                          <div className="relative w-full sm:w-56 h-36 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={carImage}
                              alt={car?.name || "Vehicle"}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            {car?.category && (
                              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md text-blue-400 border border-blue-500/20">
                                {car.category}
                              </span>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-400">
                                {car?.brand || "Premium"} · {car?.year || 2024}
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-white tracking-tight">
                              {car?.name || "DriveVue Vehicle"}
                            </h3>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {/* Booking Status Badge */}
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                  isCancelled
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                    : isConfirmed
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-slate-800 text-slate-300 border border-slate-700"
                                }`}
                              >
                                {isCancelled ? (
                                  <XCircle className="w-3 h-3 text-red-400" />
                                ) : isConfirmed ? (
                                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                                ) : (
                                  <Clock className="w-3 h-3 text-slate-400" />
                                )}
                                <span>{b.status}</span>
                              </span>

                              {/* Stripe Payment Badge */}
                              <span
                                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                                  isPaid
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                <CreditCard className="w-3 h-3" />
                                <span>{isPaid ? "Stripe Paid" : "Payment Pending"}</span>
                              </span>

                              {/* Digital Key Status */}
                              {isConfirmed && isPaid && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 inline-flex items-center gap-1.5">
                                  <KeyRound className="w-3 h-3 text-cyan-400" />
                                  <span>Digital Key Ready</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Dates & Pricing Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto text-xs py-3 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-800/80 lg:px-6">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Pick-up Date</span>
                            <span className="font-semibold text-white">{startDateFormatted}</span>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">Return Date</span>
                            <span className="font-semibold text-white">{endDateFormatted}</span>
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-slate-400 block mb-0.5">Duration</span>
                            <span className="font-semibold text-white">
                              {b.totalDays} {b.totalDays === 1 ? "day" : "days"}
                            </span>
                          </div>

                          <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-800/60 flex items-baseline justify-between">
                            <span className="text-slate-400 font-medium">Total Paid</span>
                            <span className="text-lg font-extrabold text-blue-400">
                              ${b.totalPrice}
                            </span>
                          </div>
                        </div>

                        {/* Action CTAs & Stripe Reference */}
                        <div className="space-y-3 w-full lg:w-60 flex flex-col items-stretch lg:items-end justify-between">
                          {b.stripeSessionId && (
                            <div className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
                              <span className="truncate max-w-[150px]">
                                {b.stripeSessionId}
                              </span>
                              <button
                                onClick={() => handleCopySession(b.stripeSessionId || "")}
                                title="Copy Stripe Session ID"
                                className="p-1 hover:text-white transition-colors"
                              >
                                {copiedId === b.stripeSessionId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}

                          <div className="flex items-center gap-2 w-full">
                            {car?._id && (
                              <Link
                                href={`/cars/${car._id}`}
                                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-200 hover:text-white transition-colors text-center inline-flex items-center justify-center gap-1.5"
                              >
                                <span>Vehicle</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                            )}

                            {isConfirmed && !isCancelled && (
                              <button
                                type="button"
                                onClick={() => setModalBooking(b)}
                                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sleek Custom Confirmation Modal (Replaces browser window.confirm) */}
      <AnimatePresence>
        {modalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !cancellingId && setModalBooking(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-black/90 space-y-5 text-left backdrop-blur-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Cancel Reservation?
                  </h3>
                  <p className="text-xs text-slate-400">
                    Release vehicle hold and digital key
                  </p>
                </div>
              </div>

              {/* Booking Preview Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold text-white">
                    {modalBooking.car?.brand} {modalBooking.car?.name}
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">${modalBooking.totalPrice}</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {new Date(modalBooking.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                    {new Date(modalBooking.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Are you sure you want to cancel this booking? If payment was verified via Stripe, your reservation hold will be released per our zero-deductible cancellation terms.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalBooking(null)}
                  disabled={Boolean(cancellingId)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  Keep Reservation
                </button>

                <button
                  type="button"
                  onClick={() => confirmCancelBooking(modalBooking._id)}
                  disabled={Boolean(cancellingId)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {cancellingId ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
