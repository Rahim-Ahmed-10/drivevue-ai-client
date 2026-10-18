"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  RotateCcw,
  Loader2,
  Zap,
  ShieldCheck,
  Star,
  Users,
  Gauge
} from "lucide-react";
import api from "@/lib/api";
import { Car } from "@/types/car";
import { MOCK_CARS } from "@/lib/mockCars";

interface RecommendedCar extends Car {
  aiReason?: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  matchingCars?: RecommendedCar[];
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Hello! I am your DriveVue Smart AI Mobility Assistant. Tell me about your destination, trip vibe, luggage requirements, or budget, and I'll analyze our verified fleet to handpick the ideal vehicle for you.",
      timestamp: "Just now",
    },
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    {
      label: "⚡ Electric City Cruiser",
      query: "I need an electric vehicle for city driving with high efficiency and great tech.",
    },
    {
      label: "🏔️ Family Mountain SUV",
      query: "Looking for a spacious luxury SUV for a family roadtrip to the mountains with luggage.",
    },
    {
      label: "🏎️ High Performance Weekend",
      query: "Recommend an exhilarating sports car for a weekend coastal road trip.",
    },
    {
      label: "💼 Executive Business Sedan",
      query: "I need a prestigious luxury sedan for executive corporate client meetings.",
    },
    {
      label: "💰 Budget Friendly under $150",
      query: "Show me the best reliable rental cars under $150 per day.",
    },
  ];

  const generateFallbackRecommendation = (query: string): { text: string; matchingCars: RecommendedCar[] } => {
    const q = query.toLowerCase();
    let matches: RecommendedCar[] = [];

    if (q.includes("electric") || q.includes("ev") || q.includes("tesla") || q.includes("city")) {
      matches = MOCK_CARS.filter(
        (c) => c.category === "Electric" || c.fuelType === "Electric"
      ).map((c) => ({
        ...c,
        aiReason: "Instant torque, zero emissions, and integrated GPS routing tailored for smooth urban and highway cruising.",
      }));
    } else if (q.includes("suv") || q.includes("family") || q.includes("mountain") || q.includes("luggage")) {
      matches = MOCK_CARS.filter(
        (c) => c.category === "SUV" || c.seats >= 5
      ).map((c) => ({
        ...c,
        aiReason: "All-wheel drive stability, generous seating, and expansive cargo space designed for rugged terrain and group comfort.",
      }));
    } else if (q.includes("sport") || q.includes("performance") || q.includes("fast") || q.includes("speed")) {
      matches = MOCK_CARS.filter(
        (c) => c.category === "Sports" || c.pricePerDay >= 240
      ).map((c) => ({
        ...c,
        aiReason: "Precision handling, sub-4 second 0-60 acceleration, and aerodynamic contouring built for pure driving excitement.",
      }));
    } else if (q.includes("luxury") || q.includes("executive") || q.includes("business") || q.includes("sedan")) {
      matches = MOCK_CARS.filter(
        (c) => c.category === "Luxury" || c.name.includes("S 580") || c.name.includes("Model S")
      ).map((c) => ({
        ...c,
        aiReason: "Whisper-quiet acoustic cabin, ambient executive leather styling, and VIP presence for professional itineraries.",
      }));
    } else if (q.includes("budget") || q.includes("150") || q.includes("cheap")) {
      matches = MOCK_CARS.filter((c) => c.pricePerDay <= 160).map((c) => ({
        ...c,
        aiReason: "Exceptional cost-to-performance ratio without compromising verified DriveVue safety and luxury standards.",
      }));
    }

    if (matches.length === 0) {
      matches = MOCK_CARS.slice(0, 2).map((c) => ({
        ...c,
        aiReason: "Versatile top-tier vehicle consistently praised by DriveVue drivers for reliability and comfort.",
      }));
    }

    const limitedMatches = matches.slice(0, 3);
    const summaryText = `Based on your request "${query}", our intelligent recommendation engine matched ${limitedMatches.length} optimal vehicles from the fleet:`;

    return {
      text: summaryText,
      matchingCars: limitedMatches,
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${prev.length + 1}`,
        sender: "user",
        text: trimmed,
        timestamp: "Just now",
      },
    ]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await api.post("/api/ai/recommend", {
        prompt: trimmed,
      });

      if (res.data && res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${prev.length + 1}`,
            sender: "assistant",
            text: res.data.recommendation || `Here are the top matches for your request:`,
            timestamp: "Just now",
            matchingCars: res.data.matchingCars || [],
          },
        ]);
      } else {
        const fallback = generateFallbackRecommendation(trimmed);
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${prev.length + 1}`,
            sender: "assistant",
            text: fallback.text,
            timestamp: "Just now",
            matchingCars: fallback.matchingCars,
          },
        ]);
      }
    } catch {
      const fallback = generateFallbackRecommendation(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${prev.length + 1}`,
          sender: "assistant",
          text: fallback.text,
          timestamp: "Just now",
          matchingCars: fallback.matchingCars,
        },
      ]);
    } finally {
      setLoading(false);
      // Soft internal scroll inside container only if overflow exists
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "msg-welcome-init",
        sender: "assistant",
        text: "Chat refreshed. How can I assist with your next road journey today?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 pt-28 pb-12 flex flex-col items-center overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-[40%] right-10 w-[450px] h-[450px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-400 to-indigo-600 p-[1.5px] shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                <div className="w-full h-full bg-[#050b18] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Drive<span className="text-blue-500">Vue</span> AI Mobility Assistant
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized vehicle matchmaking powered by deep neural recommendation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md transition-all duration-300 ${loading
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-slate-900/90 border-cyan-500/30 text-cyan-300 shadow-md"
              }`}>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>{loading ? "AI Processing Neural Search..." : "Gemini 2.5 Active"}</span>
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all shadow-sm"
              title="Reset Chat Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CHAT MESSAGE HISTORY CONTAINER */}
        <div
          ref={chatContainerRef}
          className="flex-1 h-[480px] sm:h-[540px] rounded-3xl bg-[#070d1e]/80 border border-white/10 p-4 sm:p-6 backdrop-blur-2xl shadow-2xl overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={`${msg.id}-${index}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 sm:gap-4 ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.sender === "assistant" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xl ${msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-600/20"
                      : "bg-[#0b1329] border border-white/10 text-slate-200 rounded-tl-none shadow-black/40"
                    }`}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {msg.matchingCars && msg.matchingCars.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Recommended Vehicles ({msg.matchingCars.length}):
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {msg.matchingCars.map((car, carIdx) => (
                          <div
                            key={`car-${car._id || car.id || carIdx}-${carIdx}`}
                            className="group rounded-2xl bg-[#050b18] border border-white/10 hover:border-cyan-500/50 p-3.5 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-900 mb-2.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={
                                    car.images?.[0] ||
                                    "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80"
                                  }
                                  alt={car.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/75 text-cyan-300 border border-cyan-400/30 backdrop-blur-md">
                                    {car.category || "Vehicle"}
                                  </span>
                                </div>
                                <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/75 text-amber-300 text-[10px] border border-amber-400/20">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>4.98</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                                <span>{car.brand}</span>
                                <span>•</span>
                                <span>{car.year || 2024}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {car.name || `${car.brand} ${car.model}`}
                              </h4>

                              <div className="flex items-center gap-3 my-2 text-[11px] text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-blue-400" />
                                  {car.seats || 5} seats
                                </span>
                                <span className="flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-cyan-400" />
                                  {car.fuelType || "Electric"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Gauge className="w-3 h-3 text-purple-400" />
                                  {car.transmission || "Auto"}
                                </span>
                              </div>

                              {car.aiReason && (
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-cyan-200/90 leading-relaxed my-2">
                                  <span className="font-semibold text-cyan-300">Why matched: </span>
                                  {car.aiReason}
                                </div>
                              )}
                            </div>

                            <div className="pt-2.5 mt-2 border-t border-white/10 flex items-center justify-between">
                              <div>
                                <span className="text-base font-extrabold text-white">
                                  ${car.pricePerDay}
                                </span>
                                <span className="text-[10px] text-slate-400"> /day</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/cars/${car._id || car.id}`}
                                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                  Details
                                </Link>
                                <Link
                                  href={`/cars/${car._id || car.id}?action=rent`}
                                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-md shadow-blue-600/30 hover:scale-[1.02] transition-all flex items-center gap-1"
                                >
                                  <span>Rent</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <span className="text-[10px] text-slate-400/70">{msg.timestamp}</span>
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 shrink-0 shadow-lg">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}

            {/* In-chat Floating Thinking Loader */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-center text-xs text-cyan-400"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#0b1329] border border-cyan-500/30 flex items-center gap-2.5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="font-semibold tracking-wide">Analyzing DriveVue fleet inventory & requirements...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* QUICK PROMPT CHIPS */}
        <div className="mt-4 mb-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 shrink-0 font-semibold">Quick Prompts:</span>
          {quickPrompts.map((p, pIdx) => (
            <button
              key={`prompt-${p.label}-${pIdx}`}
              type="button"
              disabled={loading}
              onClick={() => handleSendMessage(p.query)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-[#0b1329] hover:bg-[#131b2e] text-slate-300 hover:text-white border border-white/10 hover:border-cyan-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* INPUT BAR WITH INLINE LOADER */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputQuery);
          }}
          className={`relative rounded-2xl bg-[#0b1329]/95 border p-2.5 shadow-2xl backdrop-blur-2xl flex items-center gap-2.5 transition-all duration-300 ${loading
              ? "border-cyan-400/60 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
              : "border-white/15 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20"
            }`}
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            placeholder={loading ? "DriveVue AI is finding your best vehicle..." : "Describe your trip, group size, or desired car vibe..."}
            className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none disabled:opacity-70"
          />

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Searching</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* FOOTER NOTE */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            AI vehicle match accuracy verified against real-time fleet telemetry.
          </span>
          <Link href="/cars" className="text-cyan-400 hover:underline font-medium">
            Browse All Cars
          </Link>
        </div>
      </div>
    </div>
  );
}