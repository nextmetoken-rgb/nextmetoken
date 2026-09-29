"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithGoogle, user } = useAuth();
  const { showToast } = useQueue();
  const [isLoading, setIsLoading] = useState(false);

  const nextUrl = searchParams.get("next") || "/app/scan";

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithGoogle();
      setIsLoading(false);
      if (!user?.name) {
        router.push(`/onboarding/name?next=${encodeURIComponent(nextUrl)}`);
      } else {
        router.push(nextUrl);
      }
    }, 600);
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between max-w-[var(--container-max)] mx-auto px-[var(--page-pad)] pt-[calc(64px+var(--safe-top))] pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <div className="flex flex-col items-start">
        {/* Logo */}
        <div
          data-testid="login.logo"
          className="w-[56px] h-[56px] rounded-[16px] bg-[var(--c-accent)] text-white flex items-center justify-center shadow-[var(--shadow-1)]"
        >
          <Ticket className="w-[28px] h-[28px]" />
        </div>

        {/* Title */}
        <h1 data-testid="login.title" className="type-h1 text-[var(--c-text)] mt-[24px]">
          Login karein
        </h1>

        {/* Subtitle */}
        <p data-testid="login.sub" className="type-body text-[var(--c-text-2)] mt-[8px]">
          Google se ek tap me login. Password ki zaroorat nahi.
        </p>

        {/* Google Login Button */}
        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          data-testid="login.google"
          className="w-full h-[56px] rounded-[14px] bg-[var(--c-surface)] border-[1.5px] border-[var(--c-border-strong)] mt-[32px] px-[24px] flex items-center justify-center gap-[12px] type-button text-[var(--c-text)] hover:bg-[var(--c-surface-2)] active:scale-[0.98] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-focus)]"
        >
          {isLoading ? (
            <span className="w-[20px] h-[20px] rounded-full border-2 border-[var(--c-text)] border-t-transparent animate-spin" />
          ) : (
            <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
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
          )}
          <span>Google se continue karein</span>
        </button>

        {/* Note */}
        <p data-testid="login.note" className="type-caption text-[var(--c-text-2)] text-center w-full mt-[16px]">
          Aapka naam is line ke sabhi log dekh sakte hain.
        </p>
      </div>

      {/* Legal Footer */}
      <p data-testid="login.legal" className="type-caption text-[var(--c-text-2)] text-center mt-[32px]">
        Continue karke aap{" "}
        <Link href="/terms" className="text-[var(--c-accent)] underline underline-offset-2">
          Terms
        </Link>{" "}
        aur{" "}
        <Link href="/privacy" className="text-[var(--c-accent)] underline underline-offset-2">
          Privacy Policy
        </Link>{" "}
        se sehmat hote hain.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[var(--c-bg)]" />}>
      <LoginContent />
    </Suspense>
  );
}
