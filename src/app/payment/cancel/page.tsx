"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  XCircle, 
  RotateCcw, 
  Sparkles
} from "lucide-react";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking_id") || "";

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-32 pb-20 flex items-center justify-center">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block">
              Checkout Cancelled
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Payment Was Not Completed
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
              No charges were made to your account. Your vehicle reservation hold is pending and can be resumed whenever you&apos;re ready.
            </p>
          </div>

          {bookingId && (
            <p className="text-xs text-slate-500 font-mono">
              Reference: {bookingId}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/cars"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Resume Booking / Explore Fleet</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
          <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
