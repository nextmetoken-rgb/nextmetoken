"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--c-bg)] max-w-[640px] mx-auto px-[var(--page-pad)] py-[24px]">
      <div className="flex items-center gap-[8px] mb-[24px]">
        <Link href="/" className="flex items-center gap-[4px] type-body-sm text-[var(--c-accent)]">
          <ArrowLeft className="w-[20px] h-[20px]" />
          <span>Wapas</span>
        </Link>
      </div>

      <h1 className="type-h1 text-[var(--c-text)]">Privacy Policy</h1>
      <p className="type-caption text-[var(--c-text-2)] mt-[4px]">Aakhri update: 26 Sep 2025</p>

      <div className="flex flex-col gap-[20px] mt-[24px] type-body text-[var(--c-text)] leading-[26px]">
        <section className="flex flex-col gap-[8px]">
          <h2 className="type-h2 text-[var(--c-text)]">1. Data Collection</h2>
          <p>
            Hum sirf aapka naam aur email address Google login se lete hain. Hum aapka GPS location, Contacts ya koi camera photo server par save nahi karte.
          </p>
        </section>

        <section className="flex flex-col gap-[8px]">
          <h2 className="type-h2 text-[var(--c-text)]">2. Public Display</h2>
          <p>
            Token lete waqt aapka bhara gaya naam queue ki live list me aane wale logon ko dikhta hai.
          </p>
        </section>
      </div>
    </div>
  );
}
