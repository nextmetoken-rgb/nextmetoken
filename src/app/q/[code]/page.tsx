"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Ticket, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StickyBar } from "@/components/ui/StickyBar";
import { TicketCard } from "@/components/ui/TicketCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/TextField";
import { Banner } from "@/components/ui/Banner";
import { useAuth } from "@/context/AuthContext";
import { useQueue } from "@/context/QueueContext";
import { BRAND_NAME } from "@/config/brand";

export default function QRLandingPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, user, loginWithGoogle } = useAuth();
  const { getQueueByCode, issueToken, showToast } = useQueue();

  const code = (params?.code as string) || "sharma123";
  const queue = getQueueByCode(code);

  const businessName = queue ? queue.name : "Sharma Sweets";
  const currentNum = queue ? queue.currentNumber : 12;
  const nextAvailableNum = currentNum + 7; // e.g. 19

  const [isConfirmOpen, setIsConfirmOpen] = useState(isLoggedIn);
  const [editingName, setEditingName] = useState(user?.name || "Rahul Verma");
  const [isChangingName, setIsChangingName] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTakeToken = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newToken = issueToken(code, editingName);
      setIsLoading(false);
      setIsConfirmOpen(false);
      router.push(`/app/tokens/${newToken.id}`);
    }, 500);
  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?next=/q/${code}`);
    } else {
      setIsConfirmOpen(true);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between max-w-[var(--container-max)] mx-auto px-[var(--page-pad)] pt-[calc(24px+var(--safe-top))] pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      {/* Top Header */}
      <div className="flex flex-col items-start w-full">
        <div data-testid="land.logo" className="flex items-center gap-[8px]">
          <div className="w-[32px] h-[32px] rounded-[8px] bg-[var(--c-accent)] text-white flex items-center justify-center">
            <Ticket className="w-[18px] h-[18px]" />
          </div>
          <span className="type-h3 text-[var(--c-text)]">{BRAND_NAME}</span>
        </div>

        <h1 data-testid="land.title" className="type-h1 text-[var(--c-text)] mt-[24px]">
          {businessName}
        </h1>
        <p data-testid="land.started" className="type-body-sm text-[var(--c-text-2)] mt-[4px]">
          Shuru hua: 9:00 AM
        </p>

        {queue?.status === "paused" && <Banner variant="paused" className="mt-[16px] rounded-[12px]" />}
        {queue?.status === "closed" && <Banner variant="locked" text="Ye line abhi band hai" className="mt-[16px] rounded-[12px]" />}

        {/* Landing Ticket View */}
        <div className="w-full mt-[24px]">
          <TicketCard
            state={queue?.status === "closed" ? "closed" : "waiting"}
            variant="landing"
            currentNumber={currentNum}
            yourNumber={nextAvailableNum}
            data-testid="land.ticket"
          />
        </div>

        <p data-testid="land.note" className="type-body-sm text-[var(--c-text-2)] text-center w-full mt-[16px]">
          Abhi agla number {nextAvailableNum} hai. Confirm karte waqt ye badal sakta hai.
        </p>
      </div>

      {/* Logged Out CTA Bar */}
      <StickyBar>
        <div className="flex flex-col w-full items-center">
          <p data-testid="land.foot" className="type-caption text-[var(--c-text-2)] text-center mb-[8px]">
            Login ke baad naam bhara hua milega.
          </p>
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={queue?.status === "closed"}
            onClick={handleLoginClick}
            data-testid="land.cta"
          >
            Google se login karke token lein
          </Button>
        </div>
      </StickyBar>

      {/* Logged In Confirm Sheet */}
      <BottomSheet
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title={businessName}
        subtitle="Shuru hua: 9:00 AM"
        data-testid="confirm.sheet"
      >
        <div className="flex flex-col gap-[16px]">
          {/* Tiles Grid */}
          <div data-testid="confirm.tiles" className="grid grid-cols-2 gap-[12px] mt-[8px]">
            <Card padding="16" className="flex flex-col justify-center">
              <span className="type-overline text-[var(--c-text-2)]">ABHI CHAL RAHA</span>
              <span className="type-number-m text-[var(--c-text)] mt-[4px]">{currentNum}</span>
            </Card>

            <Card padding="16" className="flex flex-col justify-center border-[var(--c-accent-soft-border)] bg-[var(--c-accent-soft)]">
              <span className="type-overline text-[var(--c-accent)]">AAPKA NUMBER</span>
              <span className="type-number-m text-[var(--c-accent)] mt-[4px]">{nextAvailableNum}</span>
            </Card>
          </div>

          {/* ETA row */}
          <div data-testid="confirm.eta" className="flex items-center gap-[8px] type-body-sm text-[var(--c-text-2)]">
            <Clock className="w-[20px] h-[20px] shrink-0 text-[var(--c-text-2)]" />
            <span>Lagbhag 25–35 min (andaza)</span>
          </div>

          {/* Name row */}
          <div data-testid="confirm.name" className="flex flex-col gap-[4px] pt-[8px] border-t border-[var(--c-border)]">
            <div className="flex items-center justify-between">
              <span className="type-caption text-[var(--c-text-2)]">Is line me aapka naam</span>
              {!isChangingName && (
                <Button variant="tertiary" size="sm" onClick={() => setIsChangingName(true)}>
                  Badlein
                </Button>
              )}
            </div>

            {isChangingName ? (
              <TextField
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                autoFocus
              />
            ) : (
              <span className="type-body-strong text-[var(--c-text)]">{editingName}</span>
            )}

            <p data-testid="confirm.note" className="type-caption text-[var(--c-text-2)] mt-[4px]">
              Ye naam is line ke sabhi log dekhenge.
            </p>
          </div>

          <p data-testid="confirm.group" className="type-caption text-[var(--c-text-2)]">
            Saath me aur log hain? Counter par naam likhwayein.
          </p>

          {/* Sheet Actions */}
          <div className="flex flex-col gap-[8px] mt-[12px]">
            <Button
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              onClick={handleTakeToken}
              data-testid="confirm.cta"
            >
              Token lein
            </Button>

            <Button
              variant="tertiary"
              size="md"
              fullWidth
              disabled={isLoading}
              onClick={() => setIsConfirmOpen(false)}
              data-testid="confirm.cancel"
            >
              Wapas
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
