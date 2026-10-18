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

  const handleRefresh = () => {
    setLoading(true);
    setError("");
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

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
        const apiErr = err as { response?: { data?: { message?: string } } };
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

  const confirmCancelBooking = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await api.patch(`/bookings/cancel/${bookingId}`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
      setModalBooking(null);
      toast.success("Reservation cancelled successfully. Hold released.", {
        icon: "✅",
        duration: 4000,
      });
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      toast.error(apiErr?.response?.data?.message || "Unable to cancel reservation.", { duration: 5000 });
    } finally {
      setCancellingId(null);
    }
  };

  const handleCopySession = (sessionId: string) => {
    navigator.clipboard.writeText(sessionId);
    setCopiedId(sessionId);
    toast.success("Stripe session reference copied to clipboard!", { icon: "📋", duration: 2500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 🔴 Updated Filter Logic to correctly handle CANCELLED status
  const filteredBookings = useMemo(() => {
    if (activeTab === "ALL") return bookings;

    if (activeTab === "CONFIRMED") {
      return bookings.filter((b) => (b.status === "CONFIRMED" || b.status === "PENDING") && b.status !== "CANCELLED");
    }

    if (activeTab === "COMPLETED") {
      return bookings.filter((b) => (b.status === "COMPLETED" || b.status === "CONFIRMED") && b.status !== "CANCELLED");
    }

    if (activeTab === "CANCELLED") {
      return bookings.filter((b) => b.status === "CANCELLED");
    }

    return bookings.filter((b) => b.status === activeTab);
  }, [bookings, activeTab]);

  const totalSpent = useMemo(() => {
    return bookings
      .filter((b) => b.paymentStatus === "PAID" && b.status !== "CANCELLED")
      .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  }, [bookings]);

  const activeReservationsCount = useMemo(() => {
    return bookings.filter((b) => (b.status === "CONFIRMED" || b.status === "COMPLETED" || b.status === "PENDING") && b.status !== "CANCELLED").length;
  }, [bookings]);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-28 pb-24 overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute top-20 left-1/4 w-[600px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[500px] h-[350px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
              <Sparkles className="w-4 h-4" />
              <span>DriveVue Member Garage</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Vehicle Reservations
            </h1>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
                <span>Refresh</span>
              </button>
              <Link
                href="/cars"
                className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white flex items-center gap-2"
              >
                <CarIcon className="w-3.5 h-3.5" />
                <span>Explore Fleet</span>
              </Link>
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="space-y-8">
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
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                    : "bg-slate-900/50 text-slate-400 hover:text-white"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-300">
                <span>{error}</span>
                <button onClick={handleRefresh} className="px-3 py-1 bg-red-500/20 rounded-lg text-white font-semibold">Retry</button>
              </div>
            )}

            {isLoading && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse h-36" />
                ))}
              </div>
            )}

            {!isLoading && filteredBookings.length === 0 && (
              <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-4">
                <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Reservations Found</h3>
                <Link href="/cars" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  Explore Fleet & Book
                </Link>
              </div>
            )}

            {/* Bookings List */}
            {!isLoading && filteredBookings.length > 0 && (
              <div className="space-y-5">
                <AnimatePresence>
                  {filteredBookings.map((b) => {
                    const car = b.car;
                    const carImage = car?.images?.[0] || "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80";
                    const isPaid = b.paymentStatus === "PAID";
                    const isCancelled = b.status === "CANCELLED";
                    const isCompleted = b.status === "COMPLETED" || b.status === "CONFIRMED";

                    return (
                      <motion.div
                        key={b._id || b.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-xl flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between"
                      >
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center w-full lg:w-auto">
                          <div className="relative w-full sm:w-56 h-36 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={carImage} alt={car?.name || "Vehicle"} className="w-full h-full object-cover" />
                          </div>

                          <div className="space-y-2">
                            <span className="text-xs font-semibold text-slate-400">
                              {car?.brand || "Premium"} · {car?.year || 2024}
                            </span>
                            <h3 className="text-xl font-bold text-white tracking-tight">{car?.name || "DriveVue Vehicle"}</h3>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${isCancelled ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" :
                                "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                }`}>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>{b.status}</span>
                              </span>

                              <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${isPaid ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}>
                                <CreditCard className="w-3 h-3" />
                                <span>{isPaid ? "Stripe Paid" : "Payment Pending"}</span>
                              </span>

                              {isCompleted && !isCancelled && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 inline-flex items-center gap-1.5">
                                  <KeyRound className="w-3 h-3 text-cyan-400" />
                                  <span>Digital Key Ready</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Dates & Pricing */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto text-xs py-3 lg:py-0 border-y lg:border-y-0 lg:border-x border-slate-800 lg:px-6">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Pick-up Date</span>
                            <span className="font-semibold text-white">
                              {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Return Date</span>
                            <span className="font-semibold text-white">
                              {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <span className="text-slate-400 block mb-0.5">Duration</span>
                            <span className="font-semibold text-white">{b.totalDays} days</span>
                          </div>
                          <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-800 flex items-baseline justify-between">
                            <span className="text-slate-400 font-medium">Total Paid</span>
                            <span className="text-lg font-extrabold text-blue-400">${b.totalPrice}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3 w-full lg:w-60 flex flex-col items-stretch lg:items-end justify-between">
                          <div className="flex items-center gap-2 w-full">
                            {car?._id && (
                              <Link
                                href={`/cars/${car._id}`}
                                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-center inline-flex items-center justify-center gap-1.5"
                              >
                                <span>Vehicle</span>
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </Link>
                            )}

                            {!isCancelled && (
                              <button
                                type="button"
                                onClick={() => setModalBooking(b)}
                                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold"
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

      {/* Confirmation Modal */}
      <AnimatePresence>
        {modalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !cancellingId && setModalBooking(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="relative z-10 w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Cancel Reservation?</h3>
                  <p className="text-xs text-slate-400">Release vehicle hold and digital key</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
                <span className="font-semibold text-white block">{modalBooking.car?.name}</span>
                <span className="text-cyan-300 font-mono font-bold">${modalBooking.totalPrice}</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalBooking(null)} disabled={Boolean(cancellingId)} className="px-5 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300">
                  Keep Reservation
                </button>
                <button type="button" onClick={() => confirmCancelBooking(modalBooking._id)} disabled={Boolean(cancellingId)} className="px-5 py-2.5 rounded-xl bg-red-600 text-xs font-bold text-white flex items-center gap-2">
                  {cancellingId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Confirm Cancellation</span>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}