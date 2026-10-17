import type { Metadata } from "next";
import AuthSlider from "@/components/auth/AuthSlider";

export const metadata: Metadata = {
  title: "Create Account | DriveVue AI",
  description: "Join DriveVue AI today. Unlock intelligent vehicle matchmaking, verified premium fleet, and instant Stripe payments.",
};

export default function RegisterPage() {
  return (
    <div className="relative pt-24 pb-16 min-h-screen flex items-center justify-center">
      <AuthSlider initialMode="register" />
    </div>
  );
}
