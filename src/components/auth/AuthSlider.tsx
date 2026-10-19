"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  Loader2
} from "lucide-react";
import axios from "axios";
import api from "@/lib/api";

interface AuthSliderProps {
  initialMode?: "login" | "register";
}

export default function AuthSlider({ initialMode = "login" }: AuthSliderProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

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
      const res = await api.post("/api/auth/login", {
        email: loginEmail.trim(),
        password: loginPassword,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("auth_token", res.data.token);
        if (res.data.data) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
        }

        // Trigger custom event for Navbar or other listeners
        window.dispatchEvent(new Event("auth-changed"));

        // Redirect to admin dashboard if admin, otherwise homepage
        const userRole = res.data.data?.role?.toLowerCase();
        if (userRole === "admin") {
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
      const res = await api.post("/api/auth/register", {
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      if (res.data && res.data.status === "success") {
        setRegisterSuccess("Account created successfully! Logging you in...");

        // Auto-login upon registration
        try {
          const loginRes = await api.post("/api/auth/login", {
            email: registerEmail.trim(),
            password: registerPassword,
          });

          if (loginRes.data && loginRes.data.token) {
            localStorage.setItem("token", loginRes.data.token);
            localStorage.setItem("auth_token", loginRes.data.token);
            if (loginRes.data.data) {
              localStorage.setItem("user", JSON.stringify(loginRes.data.data));
            }
            window.dispatchEvent(new Event("auth-changed"));
            const registeredRole = loginRes.data.data?.role?.toLowerCase();
            setTimeout(() => {
              if (registeredRole === "admin") {
                router.push("/admin/dashboard");
              } else {
                router.push("/");
              }
              router.refresh();
            }, 800);
            return;
          }
        } catch {
          // If auto-login fails, switch smoothly to sign in
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
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />

      {/* Main Sliding Card Container */}
      <div className="relative w-full max-w-4xl min-h-[640px] bg-slate-900/90 border border-slate-800/90 rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-2xl overflow-hidden z-10 flex flex-col md:flex-row">

        {/* =========================================================================
            DESKTOP SLIDING OVERLAY PANEL (Visible on md+)
           ========================================================================= */}
        <motion.div
          className="hidden md:flex absolute top-0 bottom-0 w-1/2 z-30 overflow-hidden text-white"
          initial={false}
          animate={{
            x: isSignUp ? "0%" : "100%",
            borderTopLeftRadius: isSignUp ? "1.5rem" : "6rem",
            borderBottomLeftRadius: isSignUp ? "1.5rem" : "6rem",
            borderTopRightRadius: isSignUp ? "6rem" : "1.5rem",
            borderBottomRightRadius: isSignUp ? "6rem" : "1.5rem",
          }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          {/* Gradient background with decorative curved graphics */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800" />

          {/* Decorative fluid background curves and glowing spheres */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
          <svg
            className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
            viewBox="0 0 400 640"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-50,100 C150,200 250,50 450,150 C650,250 350,450 450,600"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <circle cx="200" cy="320" r="180" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
          </svg>

          {/* Overlay Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-10 text-center">
            <AnimatePresence mode="wait">
              {isSignUp ? (
                /* Overlay Content for Sign Up Mode (Prompts returning users to Sign In) */
                <motion.div
                  key="overlay-to-signin"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center space-y-5 max-w-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
                    <Car className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    One of us?
                  </h2>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    If you already have an account, sign in now to access your AI garage, personalized rates, and active reservations.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(false);
                      setRegisterError("");
                      setLoginError("");
                    }}
                    className="mt-3 px-8 py-3 rounded-full text-sm font-bold tracking-wide uppercase border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95"
                  >
                    SIGN IN
                  </button>
                </motion.div>
              ) : (
                /* Overlay Content for Sign In Mode (Prompts new users to Sign Up) */
                <motion.div
                  key="overlay-to-signup"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center space-y-5 max-w-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-lg">
                    <Sparkles className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    New here?
                  </h2>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    Start your journey with DriveVue AI. Sign up in seconds to unlock smart vehicle matchmaking and instant digital checkout.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setLoginError("");
                      setRegisterError("");
                    }}
                    className="mt-3 px-8 py-3 rounded-full text-sm font-bold tracking-wide uppercase border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-white/20 hover:scale-105 active:scale-95"
                  >
                    SIGN UP
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* =========================================================================
            LEFT PANEL: SIGN IN FORM
           ========================================================================= */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-center transition-all duration-300 ${isSignUp ? "hidden md:flex" : "flex"
            }`}
        >
          <div className="max-w-sm mx-auto w-full">
            {/* Form Title & Subtitle */}
            <div className="text-center md:text-left mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Welcome Back
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Sign in to DriveVue
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials or use social accounts
              </p>
            </div>

            {/* Social Logins */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                title="Sign in with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                title="Sign in with Apple"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.65-.82 1.1-1.96.98-3.1-.95.04-2.12.64-2.79 1.43-.59.68-1.11 1.83-.97 2.95 1.06.08 2.13-.46 2.78-1.28z" />
                </svg>
              </button>

              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                title="Sign in with GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 absolute font-medium">
                or use email
              </span>
            </div>

            {/* Error message */}
            {loginError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email / Username */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email or Username"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Password */}
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                  />
                  <span>Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  prefetch={false}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mobile-only toggle switcher */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center md:hidden">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-blue-400 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT PANEL: SIGN UP FORM
           ========================================================================= */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-10 md:p-12 flex flex-col justify-center transition-all duration-300 ${!isSignUp ? "hidden md:flex" : "flex"
            }`}
        >
          <div className="max-w-sm mx-auto w-full">
            {/* Form Title & Subtitle */}
            <div className="text-center md:text-left mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Join DriveVue AI
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Create Account
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Sign up with your credentials or social account
              </p>
            </div>

            {/* Social Logins */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                title="Register with Google"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                title="Register with Apple"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.65-.82 1.1-1.96.98-3.1-.95.04-2.12.64-2.79 1.43-.59.68-1.11 1.83-.97 2.95 1.06.08 2.13-.46 2.78-1.28z" />
                </svg>
              </button>

              <button
                type="button"
                className="w-11 h-11 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                title="Register with GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 absolute font-medium">
                or use registration
              </span>
            </div>

            {/* Error or Success feedback */}
            {registerError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}
            {registerSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{registerSuccess}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              {/* Email */}
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              {/* Password */}
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
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showRegisterPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                />
                <label
                  htmlFor="agreeTerms"
                  className="text-xs text-slate-400 select-none cursor-pointer"
                >
                  I agree to the{" "}
                  <Link href="/terms" prefetch={false} className="text-cyan-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" prefetch={false} className="text-cyan-400 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerLoading}
                className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
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

            {/* Mobile-only toggle switcher */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-center md:hidden">
              <p className="text-xs text-slate-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-blue-400 hover:underline"
                >
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
