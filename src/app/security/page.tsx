"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Server, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
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
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Security Overview</h1>
            <p className="text-xs text-slate-400">Enterprise-grade security protecting your data and transactions</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              End-to-End Encryption
            </h2>
            <p>
              All traffic between your client browser and DriveVue AI servers is encrypted with TLS 1.3 / SSL encryption. Passwords and credentials use industry-standard cryptographic hashing (bcrypt) with high salt rounds.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Serverless Isolation & Rate Limiting
            </h2>
            <p>
              Backend API instances are run in isolated, sandboxed environments with connection caching, automated timeouts, and strict CORS policies preventing cross-site scripting and resource hijacking.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              Stripe PCI-DSS Level 1 Compliance
            </h2>
            <p>
              Payment data is routed directly to Stripe servers via secure tokens. No sensitive payment card data ever touches DriveVue servers or databases.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
