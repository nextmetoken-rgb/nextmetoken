"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BRAND_NAME } from "@/config/brand";

export default function TermsPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--c-bg)] max-w-[640px] mx-auto px-[var(--page-pad)] py-[24px]">
      <div className="flex items-center gap-[8px] mb-[24px]">
        <Link href="/" className="flex items-center gap-[4px] type-body-sm text-[var(--c-accent)]">
          <ArrowLeft className="w-[20px] h-[20px]" />
          <span>Wapas</span>
        </Link>
      </div>

      <h1 className="type-h1 text-[var(--c-text)]">Terms of Service</h1>
      <p className="type-caption text-[var(--c-text-2)] mt-[4px]">Aakhri update: 26 Sep 2025</p>

      <div className="flex flex-col gap-[20px] mt-[24px] type-body text-[var(--c-text)] leading-[26px]">
        <section className="flex flex-col gap-[8px]">
          <h2 className="type-h2 text-[var(--c-text)]">1. Free Trial aur Subscription</h2>
          <p>
            Har naye Google account ko 2 din ka free trial milta hai. Trial khatam hone ke baad service jaari rakhne ke liye ₹3.57 per din (₹100 har 28 din me ek baar) ka payment karna hota hai.
          </p>
          <p>
            Ek saal me kul 13 billing cycles (28 din ki ek cycle) hoti hain.
          </p>
        </section>

        <section className="flex flex-col gap-[8px]">
          <h2 className="type-h2 text-[var(--c-text)]">2. Cancellation aur Data Recovery</h2>
          <p>
            Aap kisi bhi waqt Profile &gt; Subscription se apni subscription cancel kar sakte hain. Delete ki gayi queue ko 3 din ke andar Recently Deleted se recover kiya ja sakta hai. 3 din baad data hamesha ke liye hata diya jata hai.
          </p>
        </section>
      </div>
    </div>
  );
}
