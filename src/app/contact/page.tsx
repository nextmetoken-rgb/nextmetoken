"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[var(--c-bg)] max-w-[640px] mx-auto px-[var(--page-pad)] py-[24px]">
      <div className="flex items-center gap-[8px] mb-[24px]">
        <Link href="/" className="flex items-center gap-[4px] type-body-sm text-[var(--c-accent)]">
          <ArrowLeft className="w-[20px] h-[20px]" />
          <span>Wapas</span>
        </Link>
      </div>

      <h1 className="type-h1 text-[var(--c-text)]">Contact Us</h1>
      <p className="type-caption text-[var(--c-text-2)] mt-[4px]">Humari team se sampark karein</p>

      <div className="flex flex-col gap-[16px] mt-[24px]">
        <Card padding="20" className="flex items-center gap-[16px]">
          <div className="w-[48px] h-[48px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] flex items-center justify-center shrink-0">
            <MessageSquare className="w-[24px] h-[24px]" />
          </div>
          <div className="flex flex-col">
            <span className="type-body-strong text-[var(--c-text)]">WhatsApp Support</span>
            <span className="type-body-sm text-[var(--c-text-2)]">+91 98765 43210</span>
            <span className="type-caption text-[var(--c-text-2)] mt-[2px]">Response time: 15 min ke andar</span>
          </div>
        </Card>

        <Card padding="20" className="flex items-center gap-[16px]">
          <div className="w-[48px] h-[48px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] flex items-center justify-center shrink-0">
            <Mail className="w-[24px] h-[24px]" />
          </div>
          <div className="flex flex-col">
            <span className="type-body-strong text-[var(--c-text)]">Email Support</span>
            <span className="type-body-sm text-[var(--c-text-2)]">support@tokenapp.in</span>
            <span className="type-caption text-[var(--c-text-2)] mt-[2px]">Response time: 24 ghante ke andar</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
