"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserCircle, ArrowLeft, Mail, Shield, Calendar, Car } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <UserCircle className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{user?.name || "Verified Driver"}</h1>
              <p className="text-xs text-slate-400">{user?.email || "driver@drivevue.com"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Account Role</p>
                <p className="text-sm font-semibold text-white capitalize">{user?.role || "Customer"}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center gap-3">
              <Mail className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Email Status</p>
                <p className="text-sm font-semibold text-white">Verified</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/my-bookings"
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <Calendar className="w-4 h-4" />
              <span>View Reservations</span>
            </Link>
            <Link
              href="/cars"
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Browse Fleet</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
