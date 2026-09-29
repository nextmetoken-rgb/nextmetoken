"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ticket, Store, Stethoscope, Wrench, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TicketCard } from "@/components/ui/TicketCard";
import { GuideCard } from "@/components/ui/GuideCard";
import { BRAND_NAME } from "@/config/brand";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--c-bg)]">
      {/* Sticky Top Header Bar */}
      <header className="sticky top-0 z-20 w-full bg-[var(--c-bg)] border-b border-[var(--c-border)] h-[56px] px-[20px] flex items-center justify-between">
        <div className="max-w-[720px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="w-[32px] h-[32px] rounded-[8px] bg-[var(--c-accent)] text-white flex items-center justify-center">
              <Ticket className="w-[18px] h-[18px]" />
            </div>
            <span className="type-h3 text-[var(--c-text)]">{BRAND_NAME}</span>
          </div>

          <Button variant="primary" size="sm" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      </header>

      {/* Main Container max 720px */}
      <main className="w-full max-w-[720px] mx-auto px-[20px] py-[32px] flex flex-col gap-[48px]">
        {/* Section 1: Hero */}
        <section className="flex flex-col items-center text-center">
          <h1 className="type-h1 text-[var(--c-text)] text-[32px] leading-[40px]">
            Line ka jhanjhat khatam. Token QR se.
          </h1>

          <p className="type-body text-[var(--c-text-2)] mt-[12px] max-w-[500px]">
            Dukaan ke bahar QR lagayein. Customer scan karke token lega aur apni baari ka aaram se wait karega.
          </p>

          <div className="mt-[24px] flex flex-col items-center gap-[8px]">
            <Button variant="primary" size="md" onClick={() => router.push("/login")}>
              Free try karein (2 din)
            </Button>
            <span className="type-caption text-[var(--c-text-2)]">Google se login. Koi card nahi.</span>
          </div>

          {/* Ticket Demo Card */}
          <div className="w-full max-w-[380px] mt-[32px]">
            <TicketCard state="waiting" currentNumber={12} yourNumber={19} />
          </div>
        </section>

        {/* Section 2: How it Works */}
        <section className="flex flex-col gap-[20px]">
          <h2 className="type-h2 text-[var(--c-text)] text-center">3 step me</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            <Card padding="20" className="flex flex-col gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] type-label font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="type-h3 text-[var(--c-text)]">QR banayein</h3>
              <p className="type-body-sm text-[var(--c-text-2)]">Business ka naam daalein, QR print karein.</p>
            </Card>

            <Card padding="20" className="flex flex-col gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] type-label font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="type-h3 text-[var(--c-text)]">Customer scan kare</h3>
              <p className="type-body-sm text-[var(--c-text-2)]">Naam bhara hua, ek tap me token.</p>
            </Card>

            <Card padding="20" className="flex flex-col gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] type-label font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="type-h3 text-[var(--c-text)]">Number aage badhayein</h3>
              <p className="type-body-sm text-[var(--c-text-2)]">Customer ko live update aur notification milta hai.</p>
            </Card>
          </div>
        </section>

        {/* Section 3: Who can use */}
        <section className="flex flex-col gap-[20px]">
          <h2 className="type-h2 text-[var(--c-text)] text-center">Kaun kaun use kar sakta hai</h2>

          <div className="grid grid-cols-2 gap-[12px]">
            <Card padding="16" className="flex items-center gap-[12px]">
              <Store className="w-[24px] h-[24px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-strong text-[var(--c-text)]">Mithai/chai ki dukaan</span>
            </Card>

            <Card padding="16" className="flex items-center gap-[12px]">
              <Stethoscope className="w-[24px] h-[24px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-strong text-[var(--c-text)]">Clinic aur lab</span>
            </Card>

            <Card padding="16" className="flex items-center gap-[12px]">
              <Wrench className="w-[24px] h-[24px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-strong text-[var(--c-text)]">Repair aur service</span>
            </Card>

            <Card padding="16" className="flex items-center gap-[12px]">
              <Building2 className="w-[24px] h-[24px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-strong text-[var(--c-text)]">Bank/Office counter</span>
            </Card>
          </div>
        </section>

        {/* Section 4: Price */}
        <section className="flex flex-col gap-[16px] items-center text-center">
          <h2 className="type-h2 text-[var(--c-text)]">Simple price</h2>

          <Card padding="20" className="w-full max-w-[380px] flex flex-col gap-[16px]">
            <div className="flex items-baseline justify-center gap-[6px]">
              <span className="type-display-l text-[var(--c-accent)]">₹3.57</span>
              <span className="type-body-sm text-[var(--c-text-2)]">per din</span>
            </div>

            <div className="flex flex-col gap-[8px] text-left">
              <div className="flex items-center gap-[8px]">
                <Check className="w-[18px] h-[18px] text-[var(--c-accent)] shrink-0" />
                <span className="type-body-sm text-[var(--c-text)]">2 din free trial</span>
              </div>

              <div className="flex items-center gap-[8px]">
                <Check className="w-[18px] h-[18px] text-[var(--c-accent)] shrink-0" />
                <span className="type-body-sm text-[var(--c-text)]">Unlimited token</span>
              </div>

              <div className="flex items-center gap-[8px]">
                <Check className="w-[18px] h-[18px] text-[var(--c-accent)] shrink-0" />
                <span className="type-body-sm text-[var(--c-text)]">Kabhi bhi band karein</span>
              </div>
            </div>

            <span className="type-caption text-[var(--c-text-2)]">₹100 har 28 din me ek baar.</span>
          </Card>
        </section>

        {/* Section 5: FAQ */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="type-h2 text-[var(--c-text)] text-center">Sawal aur jawab</h2>

          <GuideCard
            title="Customer ko app download karna padega?"
            whatIsIt="Nahi. QR scan se website khulti hai."
          />
          <GuideCard
            title="iPhone me notification?"
            whatIsIt="Home Screen par add karein, Guide me steps hain."
          />
          <GuideCard
            title="Phone off ho toh awaaz?"
            whatIsIt="Awaaz tabhi jab screen chalu; notification tab bhi milega."
          />
          <GuideCard
            title="Data safe hai?"
            whatIsIt="Haan, aap 3 din tak delete ki hui queue wapas la sakte hain."
          />
        </section>

        {/* Section 6: Final CTA */}
        <section className="flex flex-col items-center text-center py-[24px]">
          <Button variant="primary" size="md" onClick={() => router.push("/login")}>
            Free try karein
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--c-border)] py-[24px] px-[20px] flex flex-col items-center gap-[12px] text-center">
        <div className="flex items-center justify-center gap-[16px] type-body-sm text-[var(--c-accent)] underline">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/refund">Refund</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <p className="type-caption text-[var(--c-text-2)]">
          © {new Date().getFullYear()} {BRAND_NAME}
        </p>
      </footer>
    </div>
  );
}
