"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, ArrowLeft, ChevronDown } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      q: "How does the DriveVue AI Recommender work?",
      a: "Our AI engine analyzes your travel intentions (e.g., family vacation, scenic mountain drive, business trip) alongside seating, performance, and budget preferences to pinpoint the most suitable vehicle in our fleet."
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major credit/debit cards (Visa, MasterCard, American Express) processed securely via Stripe. Apple Pay and Google Pay are also available at checkout."
    },
    {
      q: "Can I cancel or modify my reservation?",
      a: "Yes. You can cancel your reservation directly from the My Bookings portal. Full refunds apply to cancellations made at least 24 hours prior to scheduled vehicle pickup."
    },
    {
      q: "Are the vehicles insured?",
      a: "All vehicles include baseline comprehensive insurance coverage. Premium collision damage waivers (CDW) can be selected during check-in."
    }
  ];

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
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Help Center & FAQs</h1>
            <p className="text-xs text-slate-400">Common questions about DriveVue AI rental service</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-white mb-2 flex items-center justify-between">
                <span>{faq.q}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
