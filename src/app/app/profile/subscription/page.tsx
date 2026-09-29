"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Check } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { Card, ListRow } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Dialog } from "@/components/ui/Dialog";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useQueue();

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsPaywallOpen(false);
      showToast("Subscription chalu ho gayi!", "success");
    }, 800);
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Subscription" onBack={() => router.back()} />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[16px]">
        <Card padding="20" className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <span className="type-overline text-[var(--c-text-2)]">STATUS</span>
            <Chip variant="trial" label="Trial chalu" />
          </div>

          <div className="flex items-baseline gap-[6px] mt-[4px]">
            <h2 className="type-display-l text-[var(--c-accent)]">₹3.57</h2>
            <span className="type-body-sm text-[var(--c-text-2)]">per din</span>
          </div>

          <p className="type-body-sm text-[var(--c-text-2)]">
            ₹100 har 28 din me ek baar.
          </p>

          <div className="flex flex-col border-t border-[var(--c-border)] pt-[8px] mt-[8px]">
            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Trial khatam</span>
              <span className="type-body-strong text-[var(--c-text)]">1 din 4 ghante baaki</span>
            </ListRow>

            <ListRow hasBorder={false}>
              <span className="type-body-sm text-[var(--c-text-2)]">Agla payment</span>
              <span className="type-body-strong text-[var(--c-text)]">28 Sep 2026</span>
            </ListRow>
          </div>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setIsPaywallOpen(true)}
            className="mt-[8px]"
          >
            ₹100 dekar shuru karein
          </Button>

          <Button
            variant="danger-text"
            size="sm"
            onClick={() => setIsCancelDialogOpen(true)}
            className="self-center"
          >
            Subscription band karein
          </Button>
        </Card>

        {/* Receipts Section */}
        <div className="flex flex-col gap-[8px] mt-[8px]">
          <span className="type-overline text-[var(--c-text-2)] px-[4px]">RECEIPTS</span>
          <Card padding="0">
            <ListRow hasBorder={false}>
              <div className="flex flex-col">
                <span className="type-body-strong text-[var(--c-text)]">28 Aug 2026</span>
                <span className="type-caption text-[var(--c-text-2)]">₹100 (28 din)</span>
              </div>
              <Button variant="tertiary" size="sm">
                Download
              </Button>
            </ListRow>
          </Card>
        </div>
      </div>

      {/* Paywall Sheet (O12) */}
      <BottomSheet
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        title="Apni line chalate rahein"
      >
        <div className="flex flex-col gap-[16px]">
          <div className="w-[72px] h-[72px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] flex items-center justify-center mx-auto">
            <Store className="w-[40px] h-[40px]" />
          </div>

          <div className="flex items-baseline justify-center gap-[6px]">
            <span className="type-display-l text-[var(--c-accent)]">₹3.57</span>
            <span className="type-body-sm text-[var(--c-text-2)]">per din</span>
          </div>

          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[10px]">
              <Check className="w-[20px] h-[20px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-sm text-[var(--c-text)]">Unlimited token aur queues</span>
            </div>

            <div className="flex items-center gap-[10px]">
              <Check className="w-[20px] h-[20px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-sm text-[var(--c-text)]">Live update aur notification</span>
            </div>

            <div className="flex items-center gap-[10px]">
              <Check className="w-[20px] h-[20px] text-[var(--c-accent)] shrink-0" />
              <span className="type-body-sm text-[var(--c-text)]">History aur recovery</span>
            </div>
          </div>

          <div className="flex flex-col gap-[8px] mt-[8px]">
            <Button
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              onClick={handlePay}
            >
              ₹100 dekar shuru karein
            </Button>
            <p className="type-caption text-[var(--c-text-2)] text-center">
              ₹100 har 28 din me ek baar. Kabhi bhi band karein.
            </p>

            <Button
              variant="tertiary"
              size="md"
              fullWidth
              disabled={isLoading}
              onClick={() => setIsPaywallOpen(false)}
            >
              Baad me
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Cancel Dialog */}
      <Dialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        title="Band karein?"
        body="Aapka plan date tak chalega. Uske baad queues lock ho jayengi. Data safe rahega."
        confirmLabel="Haan, band karein"
        cancelLabel="Nahi"
        isDestructive
        onConfirm={() => {
          setIsCancelDialogOpen(false);
          showToast("Subscription cancel ho gayi", "info");
        }}
      />
    </div>
  );
}
