"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Last updated: October 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              1. Information We Collect
            </h2>
            <p>
              DriveVue AI collects information to provide personalized car rental recommendations and secure booking services. This includes contact information (name, email), reservation details, and driver verification credentials.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              2. Payment & Financial Data
            </h2>
            <p>
              We do not store your raw credit card numbers or payment credentials on our servers. All transactions are securely tokenized and handled directly through Stripe Encrypted Payment Gateways adhering to PCI-DSS Level 1 compliance.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              3. AI Preference Processing
            </h2>
            <p>
              Queries submitted to the DriveVue AI Recommender are processed anonymously using Google Gemini AI models to match vehicle specifications with your travel requirements. Your queries are never sold to external third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Contact Our Privacy Officer</h2>
            <p>
              If you have any questions or data removal requests regarding your DriveVue AI account, please reach out to <span className="text-cyan-400 font-medium">privacy@drivevue.com</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
