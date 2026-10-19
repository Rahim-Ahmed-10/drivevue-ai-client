"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Car,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ShieldCheck,
  UserCheck
} from "lucide-react";
import axios from "axios";
import api from "@/lib/api";

interface AuthSliderProps {
  initialMode?: "login" | "register";
}

export default function AuthSlider({ initialMode = "login" }: AuthSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginAdminCode, setLoginAdminCode] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerAdminCode, setRegisterAdminCode] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Check if emails belong to @drivevue.com domain
  const isLoginAdminEmail = loginEmail.trim().toLowerCase().endsWith("@drivevue.com");
  const isRegisterAdminEmail = registerEmail.trim().toLowerCase().endsWith("@drivevue.com");

  // Helper function to fill Demo credentials in Login form only (সঠিক করা হয়েছে)
  const handleFillDemo = (role: "admin" | "user") => {
    setLoginError("");
    if (role === "admin") {
      setLoginEmail("admin@drivevue.com");
      setLoginPassword("admin123456"); // ব্যাকএন্ডের ডিফল্ট বা সিড করা পাসওয়ার্ড
      setLoginAdminCode("DriveVueAdmin2026"); // ব্যাকএন্ডের সঠিক ADMIN_SECRET_CODE
    } else {
      setLoginEmail("user@gmail.com");
      setLoginPassword("user123");
      setLoginAdminCode("");
    }
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError("Please enter both email and password.");
      return;
    }

    try {
      setLoginLoading(true);
      const payload: any = {
        email: loginEmail.trim(),
        password: loginPassword,
      };

      if (isLoginAdminEmail) {
        payload.adminCode = loginAdminCode.trim();
      }

      const res = await api.post("/api/auth/login", payload);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("auth_token", res.data.token);
        const userData = res.data.data || res.data.user;
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }

        window.dispatchEvent(new Event("auth-changed"));

        const userRole = userData?.role?.toLowerCase();
        const rawRedirect = searchParams?.get("redirect");
        const safeRedirect = rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//") ? rawRedirect : null;

        if (safeRedirect) {
          router.push(safeRedirect);
        } else if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
        router.refresh();
      } else {
        setLoginError("Login failed. No authentication token received.");
      }
    } catch (err: unknown) {
      let message = "Invalid credentials or connection error.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");

    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setRegisterError("Please fill out all required fields.");
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters.");
      return;
    }

    if (!agreeTerms) {
      setRegisterError("Please agree to the Terms of Service.");
      return;
    }

    try {
      setRegisterLoading(true);
      const payload: any = {
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      };

      if (isRegisterAdminEmail) {
        payload.adminCode = registerAdminCode.trim();
      }

      const res = await api.post("/api/auth/register", payload);

      if (res.data && (res.data.status === "success" || res.data.token)) {
        setRegisterSuccess("Account created successfully! Logging you in...");

        try {
          const loginPayload: any = {
            email: registerEmail.trim(),
            password: registerPassword,
          };
          if (isRegisterAdminEmail) {
            loginPayload.adminCode = registerAdminCode.trim();
          }

          const loginRes = await api.post("/api/auth/login", loginPayload);

          if (loginRes.data && loginRes.data.token) {
            localStorage.setItem("token", loginRes.data.token);
            localStorage.setItem("auth_token", loginRes.data.token);
            const loginUserData = loginRes.data.data || loginRes.data.user;
            if (loginUserData) {
              localStorage.setItem("user", JSON.stringify(loginUserData));
            }
            window.dispatchEvent(new Event("auth-changed"));
            const registeredRole = loginUserData?.role?.toLowerCase();
            const rawRegRedirect = searchParams?.get("redirect");
            const safeRegRedirect = rawRegRedirect && rawRegRedirect.startsWith("/") && !rawRegRedirect.startsWith("//") ? rawRegRedirect : null;

            setTimeout(() => {
              if (safeRegRedirect) {
                router.push(safeRegRedirect);
              } else if (registeredRole === "admin") {
                router.push("/admin/dashboard");
              } else {
                router.push("/");
              }
              router.refresh();
            }, 800);
            return;
          }
        } catch {
          setLoginEmail(registerEmail);
          setTimeout(() => {
            setIsSignUp(false);
            setRegisterSuccess("");
          }, 1500);
        }
      } else {
        setRegisterError("Failed to register. Please try again.");
      }
    } catch (err: unknown) {
      let message = "Registration failed. User may already exist.";
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setRegisterError(message);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#07090e] overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 blur-[140px] pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl min-h-[640px] bg-[#0b0f17]/80 border border-slate-800/80 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-3xl overflow-hidden z-10 flex flex-col md:flex-row">

        {/* DESKTOP SLIDING OVERLAY PANEL */}
        <motion.div
          className="hidden md:flex absolute top-0 bottom-0 w-1/2 z-30 overflow-hidden text-white"
          initial={false}
          animate={{
            x: isSignUp ? "0%" : "100%",
            borderTopLeftRadius: isSignUp ? "0rem" : "3rem",
            borderBottomLeftRadius: isSignUp ? "0rem" : "3rem",
            borderTopRightRadius: isSignUp ? "3rem" : "0rem",
            borderBottomRightRadius: isSignUp ? "3rem" : "0rem",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-950 border-x border-slate-700/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.15),transparent_50%)]" />

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 text-center">
            <AnimatePresence mode="wait">
              {isSignUp ? (
                <motion.div
                  key="overlay-to-signin"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center space-y-6 max-w-xs"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center shadow-inner">
                    <Car className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      One of us?
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      If you already have an account, sign in now to access your AI garage and active reservations.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setRegisterError("");
                      setLoginError("");
                    }}
                    className="px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase bg-slate-800/80 hover:bg-slate-700 border border-slate-600/50 text-cyan-400 hover:text-cyan-300 transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
                  >
                    SIGN IN
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="overlay-to-signup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center space-y-6 max-w-xs"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      New here?
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Start your journey with DriveVue AI. Sign up in seconds to unlock smart vehicle matchmaking.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setLoginError("");
                      setRegisterError("");
                    }}
                    className="px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase bg-slate-800/80 hover:bg-slate-700 border border-slate-600/50 text-blue-400 hover:text-blue-300 transition-all duration-300 shadow-lg cursor-pointer active:scale-95"
                  >
                    SIGN UP
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* LEFT PANEL: SIGN IN FORM */}
        <div className={`w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-center transition-all duration-300 ${isSignUp ? "hidden md:flex" : "flex"}`}>
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center md:text-left mb-5 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">WELCOME BACK</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Sign in to DriveVue</h1>
              <p className="text-xs text-slate-400">Enter your credentials or use quick demo roles</p>
            </div>

            {/* QUICK DEMO ROLES */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="py-2 px-3 rounded-xl text-xs font-bold border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("user")}
                className="py-2 px-3 rounded-xl text-xs font-bold border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Demo User</span>
              </button>
            </div>

            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#05070b] border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showLoginPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#05070b] border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Admin Secret Code Field for @drivevue.com Login */}
              {isLoginAdminEmail && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in duration-300 space-y-1.5">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Secret Code Required</span>
                  </label>
                  <input
                    type="password"
                    required={isLoginAdminEmail}
                    value={loginAdminCode}
                    onChange={(e) => setLoginAdminCode(e.target.value)}
                    placeholder="Enter personal admin key"
                    className="w-full bg-[#05070b] border border-amber-500/40 rounded-lg py-2 px-3 text-sm text-amber-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-[#05070b] border-slate-800 text-blue-600" />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" prefetch={false} className="text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center md:hidden">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <button type="button" onClick={() => setIsSignUp(true)} className="font-bold text-blue-400 hover:underline cursor-pointer">
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: SIGN UP FORM */}
        <div className={`w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-center transition-all duration-300 ${!isSignUp ? "hidden md:flex" : "flex"}`}>
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center md:text-left mb-6 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Join DriveVue AI</span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Create Account</h1>
              <p className="text-xs text-slate-400">Sign up with your credentials</p>
            </div>

            {registerError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}
            {registerSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{registerSuccess}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#05070b] border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#05070b] border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  required
                  placeholder="Create Password (min. 6 chars)"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#05070b] border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Admin Secret Code Field for @drivevue.com Signup */}
              {isRegisterAdminEmail && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 animate-in fade-in duration-300 space-y-1">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Secret Code Required</span>
                  </label>
                  <input
                    type="password"
                    required={isRegisterAdminEmail}
                    value={registerAdminCode}
                    onChange={(e) => setRegisterAdminCode(e.target.value)}
                    placeholder="Enter admin secret key"
                    className="w-full bg-[#05070b] border border-amber-500/40 rounded-lg py-2 px-3 text-sm text-amber-200 focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] text-amber-400/80 mt-1">
                    @drivevue.com emails require the correct admin secret code to register.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-[#05070b] border-slate-800 text-cyan-600 cursor-pointer w-4 h-4"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-400 select-none cursor-pointer">
                  I agree to the{" "}
                  <Link href="/terms" prefetch={false} className="text-cyan-400 hover:underline">
                    Terms of Service
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={registerLoading}
                className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 active:scale-[0.98]"
              >
                {registerLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN UP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-center md:hidden">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <button type="button" onClick={() => setIsSignUp(false)} className="font-bold text-cyan-400 hover:underline cursor-pointer">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}