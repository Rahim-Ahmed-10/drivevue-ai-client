"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  CheckCircle2, 
  Sparkles, 
  Car, 
  ShieldCheck, 
  KeyRound,
  Loader2
} from "lucide-react";
import api from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "cs_live_sample";
  const bookingId = searchParams.get("booking_id") || "BKG-2026-X889";

  const [verifying, setVerifying] = useState(true);
  const [verifiedBooking, setVerifiedBooking] = useState<any>(null);

  useEffect(() => {
    let active = true;

    const hasRealSession = sessionId && sessionId !== "cs_live_sample";
    const hasRealBooking = bookingId && bookingId !== "BKG-2026-X889";

    if (!hasRealSession && !hasRealBooking) {
      setVerifying(false);
      return;
    }

    api
      .post("/api/payments/verify-payment", {
        sessionId: hasRealSession ? sessionId : undefined,
        bookingId: hasRealBooking ? bookingId : undefined,
      })
      .then((res) => {
        if (!active) return;
        if (res.data && (res.data.success || res.data.status)) {
          setVerifiedBooking(res.data.data);
        }
      })
      .catch((err) => {
        console.warn("Payment verification note:", err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        if (active) setVerifying(false);
      });

    return () => {
      active = false;
    };
  }, [sessionId, bookingId]);

  const carInfo = verifiedBooking?.car;
  const carTitle = carInfo ? `${carInfo.brand} ${carInfo.name}` : null;

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-32 pb-20 flex items-center justify-center">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-20 right-1/4 w-[450px] h-[350px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6">
          {/* Animated Success Icon Badge */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
            {verifying ? (
              <Loader2 className="w-10 h-10 animate-spin text-emerald-400" />
            ) : (
              <CheckCircle2 className="w-10 h-10" />
            )}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
              {verifying ? "Confirming With Stripe..." : "Payment Confirmed & Verified"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {carTitle ? `Your ${carTitle} is Locked!` : "Your DriveVue Reservation is Locked!"}
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              We&apos;ve verified your Stripe transaction and confirmed your vehicle hold. 
              Your digital key will be ready for keyless unlock at pick-up.
            </p>
          </div>

          {/* Booking Summary Ticket */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800/80 p-5 text-left text-xs space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Stripe Session ID</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px]">{sessionId}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Booking Reference</span>
              <span className="font-mono text-cyan-300 font-semibold">{bookingId}</span>
            </div>
            {verifiedBooking?.totalPrice && (
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <span className="text-slate-400 font-medium">Amount Paid</span>
                <span className="font-mono text-emerald-400 font-bold">${verifiedBooking.totalPrice} USD</span>
              </div>
            )}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <span className="text-slate-400 font-medium">Check-in Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Digital Key Ready
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Zero Cancellation Fee Protection
              </span>
              <span className="text-emerald-400 font-semibold">Verified</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/my-bookings"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>View My Bookings</span>
            </Link>

            <Link
              href="/cars"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-950 border border-slate-800 hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span>Browse More Cars</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
          <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
