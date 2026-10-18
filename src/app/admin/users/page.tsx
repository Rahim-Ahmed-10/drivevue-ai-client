"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { Users, Search, ShieldCheck, ArrowRight, Menu, UserCheck } from "lucide-react";
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

const STATIC_USERS = [
  {
    id: "usr-1",
    name: "Alexander Vance",
    email: "alex.vance@velocity.io",
    role: "USER",
    tier: "VIP Executive",
    status: "Verified",
    totalTrips: 8,
    totalSpent: 4250
  },
  {
    id: "usr-2",
    name: "Sophia Lin",
    email: "sophia.lin@aurora-tech.com",
    role: "USER",
    tier: "Verified Driver",
    status: "Verified",
    totalTrips: 3,
    totalSpent: 1600
  },
  {
    id: "usr-3",
    name: "Marcus Thorne",
    email: "marcus.thorne@skyline.org",
    role: "USER",
    tier: "Verified Driver",
    status: "Verified",
    totalTrips: 5,
    totalSpent: 2600
  },
  {
    id: "usr-4",
    name: "Super Admin",
    email: "admin@drivevue.ai",
    role: "ADMIN",
    tier: "System Administrator",
    status: "Verified",
    totalTrips: 12,
    totalSpent: 7800
  }
];

export default function AdminUsersPage() {
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
  const [searchQuery, setSearchQuery] = useState("");

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
      router.replace("/login?redirect=/admin/users");
    } else if (!isAdmin) {
      router.replace("/my-bookings");
    }
  }, [router]);

  const filteredUsers = useMemo(() => {
    return STATIC_USERS.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      }
      return true;
    });
  }, [searchQuery]);

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
        className={`transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 py-8 ${
          isSidebarCollapsed ? "md:pl-28" : "md:pl-72"
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
                  <Users className="w-6 h-6 text-blue-400" />
                  <span>User & Driver Management</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Registered customer accounts, driver validation records, and role administration
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Users Table */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/90 bg-slate-950/50 text-slate-400 font-semibold tracking-wider uppercase text-[10px]">
                    <th className="py-4 px-6">Driver / Customer</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6">Total Trips</th>
                    <th className="py-4 px-6">Platform Spend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                          u.role === "ADMIN" 
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30" 
                            : "bg-slate-800 text-slate-300 border-slate-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{u.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-200">
                        {u.totalTrips} Trips
                      </td>
                      <td className="py-4 px-6 font-bold text-white">
                        ${u.totalSpent.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
