"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--c-bg)] max-w-[640px] mx-auto px-[var(--page-pad)] py-[24px]">
      <div className="flex items-center gap-[8px] mb-[24px]">
        <Link href="/" className="flex items-center gap-[4px] type-body-sm text-[var(--c-accent)]">
          <ArrowLeft className="w-[20px] h-[20px]" />
          <span>Wapas</span>
        </Link>
      </div>

      <h1 className="type-h1 text-[var(--c-text)]">Refund & Cancellation Policy</h1>
      <p className="type-caption text-[var(--c-text-2)] mt-[4px]">Aakhri update: 26 Sep 2025</p>

      <div className="flex flex-col gap-[20px] mt-[24px] type-body text-[var(--c-text)] leading-[26px]">
        <section className="flex flex-col gap-[8px]">
          <h2 className="type-h2 text-[var(--c-text)]">1. Refund Policy</h2>
          <p>
            Subscription payment karne ke 7 din ke andar agar aapko service pasand nahi aati hai toh aap 100% refund ke liye support par sampark kar sakte hain.
          </p>
        </section>

        <section className="flex flex-col gap-[8px]">
          <h2 className="type-h2 text-[var(--c-text)]">2. Cancellation</h2>
          <p>
            Aap kisi bhi waqt billing cycle ke dauran subscription cancel kar sakte hain. Cancellation ke baad current 28-day cycle ke bache hue din tak service chalu rahegi.
          </p>
        </section>
      </div>
    </div>
  );
}
