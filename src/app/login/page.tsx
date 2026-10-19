import type { Metadata } from "next";
import { Suspense } from "react";
import AuthSlider from "@/components/auth/AuthSlider";

export const metadata: Metadata = {
  title: "Sign In | DriveVue AI",
  description: "Sign in to your DriveVue AI account to access your AI garage, personalized rates, and active car reservations.",
};

export default function LoginPage() {
  return (
    <div className="relative pt-24 pb-16 min-h-screen flex items-center justify-center">
      <Suspense fallback={<div className="min-h-[500px]" />}>
        <AuthSlider initialMode="login" />
      </Suspense>
    </div>
  );
}
