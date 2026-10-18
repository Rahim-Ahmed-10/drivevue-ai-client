"use client";

import React from "react";
import Link from "next/link";
import { FileCheck, ArrowLeft, Car, ShieldAlert, Award } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
            <p className="text-xs text-slate-400">DriveVue AI Vehicle Rental & Concierge Agreement</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              1. Rental Eligibility & Driving License
            </h2>
            <p>
              Renters must be at least 21 years old (25 for select high-performance sports models) and possess a valid, government-issued driver&apos;s license in good standing. Verification may occur before vehicle pickup.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              2. Reservations & Stripe Payments
            </h2>
            <p>
              All reservations are confirmed upon successful payment authorization through Stripe. A temporary security hold may be placed on your payment card at the time of vehicle handoff.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              3. Cancellation & Refunds
            </h2>
            <p>
              Reservations cancelled at least 24 hours prior to the scheduled pickup time are eligible for a full refund. Cancellations made inside the 24-hour window may be subject to a nominal administrative cancellation fee.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Vehicle Maintenance & Care</h2>
            <p>
              Vehicles must be returned in the same condition as when rented, with normal wear and tear accepted. Smoking and unauthorized subleasing are strictly prohibited across all fleet tiers.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
