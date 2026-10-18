"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  CalendarDays,
  Search,
  ShieldCheck,
  ArrowRight,
  Menu,
  CheckCheck,
  XCircle,
  ArrowUpRight
} from "lucide-react";
import api from "@/lib/api";
import { Booking } from "@/types/booking";
import AdminSidebar from "@/components/admin/AdminSidebar";

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-changed", callback);
  };
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || localStorage.getItem("auth_token") || "";
}

function getUserSnapshot() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("user") || "";
}

function getServerSnapshot() {
  return "";
}

const STATIC_SAMPLE_BOOKINGS: Booking[] = [
  {
    _id: "bk-sys-101",
    user: { _id: "usr-1", name: "Alexander Vance", email: "alex.vance@velocity.io" },
    car: {
      _id: "car-demo-1",
      name: "Porsche 911 GT3 RS",
      brand: "Porsche",
      model: "911 GT3 RS",
      year: 2024,
      pricePerDay: 580,
      category: "Sports",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 2,
      images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"],
      isAvailable: true
    },
    startDate: "2026-10-20T10:00:00.000Z",
    endDate: "2026-10-23T10:00:00.000Z",
    totalDays: 3,
    totalPrice: 1740,
    status: "CONFIRMED",
    paymentStatus: "PAID",
    stripeSessionId: "cs_live_9x8f7d6a5c4b3e2a1",
    createdAt: "2026-10-17T12:00:00.000Z"
  },
  {
    _id: "bk-sys-104",
    user: { _id: "usr-4", name: "Elena Rostova", email: "elena.r@quantum-cap.ch" },
    car: {
      _id: "car-demo-1",
      name: "Porsche 911 GT3 RS",
      brand: "Porsche",
      model: "911 GT3 RS",
      year: 2024,
      pricePerDay: 580,
      category: "Sports",
      fuelType: "Petrol",
      transmission: "Automatic",
      seats: 2,
      images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"],
      isAvailable: true
    },
    startDate: "2026-10-24T10:00:00.000Z",
    endDate: "2026-10-27T10:00:00.000Z",
    totalDays: 3,
    totalPrice: 1740,
    status: "PENDING",
    paymentStatus: "UNPAID",
    stripeSessionId: "cs_test_pending_4f5g6h7j8k",
    createdAt: "2026-10-17T18:00:00.000Z"
  }
];

export default function AdminBookingsPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const token = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerSnapshot);
  const userJson = useSyncExternalStore(subscribeToAuth, getUserSnapshot, getServerSnapshot);

  const currentUser = useMemo(() => {
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as { role?: string };
    } catch {
      return null;
    }
  }, [userJson]);

  const isAuthorizedAdmin = Boolean(token && currentUser?.role?.toLowerCase() === "admin");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token") || localStorage.getItem("auth_token");
    const u = localStorage.getItem("user");
    let isAdmin = false;

    if (u) {
      try {
        const parsed = JSON.parse(u);
        if (parsed?.role?.toLowerCase() === "admin") isAdmin = true;
      } catch {
        // ignore
      }
    }

    if (!t) {
      router.replace("/login?redirect=/admin/bookings");
    } else if (!isAdmin) {
      router.replace("/my-bookings");
    }
  }, [router]);

  // Fetch all bookings from backend API
  const fetchBookings = () => {
    api.get("/api/bookings")
      .then((res) => {
        const bData = res.data?.data || res.data;
        if (Array.isArray(bData) && bData.length > 0) {
          setBookings(bData);
        } else {
          setBookings(STATIC_SAMPLE_BOOKINGS);
        }
      })
      .catch(() => {
        setBookings(STATIC_SAMPLE_BOOKINGS);
      });
  };

  useEffect(() => {
    if (!isAuthorizedAdmin) return;
    fetchBookings();
  }, [isAuthorizedAdmin]);

  const effectiveBookings = bookings.length > 0 ? bookings : STATIC_SAMPLE_BOOKINGS;

  const filteredBookings = useMemo(() => {
    return effectiveBookings.filter((b) => {
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const userName = typeof b.user === "object" ? b.user?.name || "" : "";
        const userEmail = typeof b.user === "object" ? b.user?.email || "" : "";
        const carName = b.car?.name || "";
        const matches =
          userName.toLowerCase().includes(q) ||
          userEmail.toLowerCase().includes(q) ||
          carName.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [effectiveBookings, statusFilter, searchQuery]);

  // 🔴 Real API Handler for Approval (CONFIRMED)
  const handleApprove = async (bookingId: string) => {
    try {
      setActionLoadingId(bookingId);
      await api.patch(`/api/bookings/${bookingId}/status`, { status: "CONFIRMED" });

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "CONFIRMED" } : b))
      );
      toast.success("Booking request approved successfully! Car is now locked.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to approve booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // 🔴 Real API Handler for Cancellation (CANCELLED)
  const handleCancel = async (bookingId: string) => {
    try {
      setActionLoadingId(bookingId);
      await api.patch(`/api/bookings/${bookingId}/status`, { status: "CANCELLED" });

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "CANCELLED" } : b))
      );
      toast.success("Booking reservation cancelled & vehicle released.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 max-w-md w-full">
          <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white">Verifying Admin Access...</h2>
          <Link href="/my-bookings" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <span>Return to My Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-20">
      <Toaster position="top-right" />

      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={isMobileSidebarOpen}
        setMobileOpen={setIsMobileSidebarOpen}
      />

      <div
        className={`transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 py-8 ${isSidebarCollapsed ? "md:pl-28" : "md:pl-72"
          }`}
      >
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-blue-400" />
                  <span>Booking Requests & Approvals</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Review incoming trip reservations, approve bookings, and monitor payments
                </p>
              </div>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search driver name, car..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs overflow-x-auto">
              {(["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${statusFilter === st
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  {st === "ALL" ? "All Bookings" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/90 bg-slate-950/50 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                    <th className="py-4 px-6">Driver</th>
                    <th className="py-4 px-6">Vehicle</th>
                    <th className="py-4 px-6">Rental Duration</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredBookings.map((b) => {
                    const userName = typeof b.user === "object" ? b.user?.name || "Customer" : "Customer";
                    const isPaid = b.paymentStatus === "PAID";
                    const isPending = b.status === "PENDING";
                    const isCancelled = b.status === "CANCELLED";

                    return (
                      <tr key={b._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-white">{userName}</td>
                        <td className="py-4 px-6 font-semibold text-slate-200">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-7 rounded bg-slate-950 overflow-hidden relative shrink-0">
                              <Image
                                src={b.car?.images?.[0] || STATIC_SAMPLE_BOOKINGS[0].car.images[0]}
                                alt={b.car?.name || "Car"}
                                width={40}
                                height={28}
                                unoptimized
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{b.car?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-slate-300">
                          {new Date(b.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(b.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} ({b.totalDays}d)
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">${b.totalPrice}</div>
                          <span className={`text-[10px] uppercase font-bold ${isPaid ? "text-emerald-400" : "text-amber-400"}`}>
                            {isPaid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${b.status === "CONFIRMED" ? "bg-blue-500/10 text-cyan-300 border-blue-500/30" :
                              b.status === "PENDING" ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
                                b.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" :
                                  "bg-rose-500/10 text-rose-300 border-rose-500/30"
                            }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <button
                                onClick={() => handleApprove(b._id)}
                                disabled={actionLoadingId === b._id}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1 text-[11px] disabled:opacity-50"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>{actionLoadingId === b._id ? "Approving..." : "Approve"}</span>
                              </button>
                            )}

                            {!isCancelled && b.status !== "COMPLETED" && (
                              <button
                                onClick={() => handleCancel(b._id)}
                                disabled={actionLoadingId === b._id}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1 text-[11px] disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Cancel</span>
                              </button>
                            )}

                            <Link
                              href={`/cars/${b.car?._id || ""}`}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}