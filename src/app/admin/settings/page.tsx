"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Settings, ShieldCheck, ArrowRight, Menu, Save, CreditCard, Sparkles, Bell } from "lucide-react";
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

export default function AdminSettingsPage() {
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

  // Settings State
  const [stripeLive, setStripeLive] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

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
      router.replace("/login?redirect=/admin/settings");
    } else if (!isAdmin) {
      router.replace("/my-bookings");
    }
  }, [router]);

  const handleSave = () => {
    toast.success("Platform settings updated successfully!");
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
        className={`transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 py-8 ${
          isSidebarCollapsed ? "md:pl-28" : "md:pl-72"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-8">
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
                  <Settings className="w-6 h-6 text-blue-400" />
                  <span>System Configuration & Preferences</span>
                </h1>
                <p className="text-xs text-slate-400">
                  Global platform controls, payment gateway configurations, and AI telemetry
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-xs font-bold text-white transition-all shadow-md shadow-blue-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>

          {/* Settings Cards */}
          <div className="space-y-5">
            {/* Stripe Card */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Stripe Payment Gateway</h3>
                    <p className="text-xs text-slate-400">Enable real-time Stripe Checkout sessions for fleet reservations</p>
                  </div>
                </div>
                <button
                  onClick={() => setStripeLive(!stripeLive)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${stripeLive ? "bg-emerald-600" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${stripeLive ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            {/* AI Recommendation Engine */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">AI Recommendation Engine</h3>
                    <p className="text-xs text-slate-400">Intelligent Gemini neural vehicle matching and customer trip profiling</p>
                  </div>
                </div>
                <button
                  onClick={() => setAiSuggestions(!aiSuggestions)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${aiSuggestions ? "bg-blue-600" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${aiSuggestions ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">System Audit Notifications</h3>
                    <p className="text-xs text-slate-400">Instant notification alerts when customer completes rental booking</p>
                  </div>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${emailAlerts ? "bg-amber-600" : "bg-slate-800"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${emailAlerts ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
