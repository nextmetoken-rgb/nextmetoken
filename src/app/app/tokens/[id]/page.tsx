"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EllipsisVertical, Volume2, Users, Grid3x3, CircleHelp, LogOut } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { IconButton } from "@/components/ui/IconButton";
import { TicketCard, TicketState } from "@/components/ui/TicketCard";
import { Card, SettingsRow } from "@/components/ui/Card";
import { ProgressLine } from "@/components/ui/ProgressLine";
import { ToggleRow } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { StickyBar } from "@/components/ui/StickyBar";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Dialog } from "@/components/ui/Dialog";
import { useQueue } from "@/context/QueueContext";
import { useSettings } from "@/context/SettingsContext";

export default function LiveTokenPage() {
  const params = useParams();
  const router = useRouter();
  const { tokens, queues, withdrawToken, showToast } = useQueue();
  const { soundEnabled, setSoundEnabled } = useSettings();

  const tokenId = (params?.id as string) || "t_19";
  const token = tokens.find((t) => t.id === tokenId) || tokens[0];
  const queue = queues.find((q) => q.id === token?.queueId);

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isSoundSheetOpen, setIsSoundSheetOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  if (!token) {
    return (
      <div className="p-[20px] text-center my-auto">
        <p className="type-h3 text-[var(--c-text)]">Ye token nahi mila</p>
        <Button variant="primary" size="md" className="mt-[16px]" onClick={() => router.push("/app/tokens")}>
          Mere Tokens par jayein
        </Button>
      </div>
    );
  }

  const currentNum = queue ? queue.currentNumber : 12;
  const yourNum = token.number;

  // Determine token state
  let state: TicketState = token.status;
  if (token.status === "waiting") {
    if (currentNum === yourNum) {
      state = "now";
    } else if (currentNum + 1 === yourNum) {
      state = "next";
    }
  }

  const peopleAhead = Math.max(0, yourNum - currentNum - 1);
  const progressPercent = Math.min(100, Math.max(0, (currentNum / yourNum) * 100));

  const handleLeaveConfirm = () => {
    withdrawToken(token.id);
    setIsLeaveDialogOpen(false);
    router.push("/app/tokens");
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between max-w-[var(--container-max)] mx-auto pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      {/* AppBar */}
      <AppBar
        title={token.businessName}
        onBack={() => router.push("/app/tokens")}
        data-testid="live.appbar"
        rightActions={
          <IconButton
            aria-label="Aur options"
            onClick={() => setIsMoreOpen(true)}
            data-testid="live.more"
          >
            <EllipsisVertical className="w-[24px] h-[24px]" />
          </IconButton>
        }
      />

      {/* Main Content */}
      <div className="px-[var(--page-pad)] pt-[12px] flex flex-col gap-[16px]">
        {/* TicketCard Signature Component */}
        <div data-testid="live.ticket">
          <TicketCard
            state={state}
            currentNumber={currentNum}
            yourNumber={yourNum}
            peopleAheadText={`${peopleAhead} log pehle`}
            estimatedTimeText="Lagbhag 20–30 min"
            actionButton={
              state === "done" ? (
                <Button variant="secondary" size="md" onClick={() => router.push(`/app/tokens/history/${token.id}`)}>
                  History dekhein
                </Button>
              ) : state === "removed" ? (
                <Button variant="primary" size="md" onClick={() => router.push(`/q/${token.queueId}`)}>
                  Scan karein
                </Button>
              ) : undefined
            }
          />
        </div>

        {/* Progress Card */}
        {state !== "done" && state !== "removed" && (
          <Card padding="16" data-testid="live.progress">
            <span className="type-label text-[var(--c-text)]">Line me aapki jagah</span>
            <div className="mt-[12px]">
              <ProgressLine
                progress={progressPercent}
                leftLabel={`Abhi ${currentNum}`}
                rightLabel={`Aap ${yourNum}`}
              />
            </div>
          </Card>
        )}

        {/* Sound Toggle Row */}
        {state !== "done" && state !== "removed" && (
          <Card padding="0" data-testid="live.sound-row">
            <ToggleRow
              icon={<Volume2 className="w-[24px] h-[24px]" />}
              label="Awaaz se batao"
              checked={soundEnabled}
              onChange={(val) => setSoundEnabled(val)}
            />
            <p className="type-caption text-[var(--c-text-2)] px-[16px] pb-[12px]">
              Phone off ya lock karne par awaaz nahi aayegi. Tab sirf notification milega.
            </p>
          </Card>
        )}

        {/* People Row */}
        <Card padding="0" data-testid="live.people-row">
          <SettingsRow
            icon={<Users className="w-[20px] h-[20px]" />}
            label="Line ke log dekhein"
            value="8"
            onClick={() => router.push(`/app/tokens/${token.id}/people`)}
          />
        </Card>

        {/* Sudoku Row */}
        <Card padding="0" data-testid="live.sudoku">
          <SettingsRow
            icon={<Grid3x3 className="w-[20px] h-[20px]" />}
            label="Time pass ke liye Sudoku"
            onClick={() => router.push(`/app/tokens/${token.id}/sudoku`)}
          />
        </Card>
      </div>

      {/* Sticky Bottom Leave Action */}
      {state !== "done" && state !== "removed" && (
        <StickyBar data-testid="live.leave">
          <Button
            variant="danger-outline"
            size="md"
            fullWidth
            onClick={() => setIsLeaveDialogOpen(true)}
          >
            Line chhodein
          </Button>
        </StickyBar>
      )}

      {/* More Options Sheet */}
      <BottomSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        title="Options"
      >
        <div className="flex flex-col py-[4px]">
          <SettingsRow
            icon={<Users className="w-[20px] h-[20px]" />}
            label="Line ke log dekhein"
            onClick={() => {
              setIsMoreOpen(false);
              router.push(`/app/tokens/${token.id}/people`);
            }}
          />

          <SettingsRow
            icon={<Volume2 className="w-[20px] h-[20px]" />}
            label="Awaaz settings"
            onClick={() => {
              setIsMoreOpen(false);
              setIsSoundSheetOpen(true);
            }}
          />

          <SettingsRow
            icon={<CircleHelp className="w-[20px] h-[20px]" />}
            label="Guide (Madad)"
            onClick={() => {
              setIsMoreOpen(false);
              router.push("/app/guide");
            }}
          />

          <SettingsRow
            icon={<LogOut className="w-[20px] h-[20px] text-[var(--c-danger)]" />}
            label="Line chhodein"
            showChevron={false}
            onClick={() => {
              setIsMoreOpen(false);
              setIsLeaveDialogOpen(true);
            }}
          />
        </div>
      </BottomSheet>

      {/* Sound Settings Sheet (C6) */}
      <BottomSheet
        isOpen={isSoundSheetOpen}
        onClose={() => setIsSoundSheetOpen(false)}
        title="Awaaz"
      >
        <div className="flex flex-col gap-[16px]">
          <ToggleRow
            label="Awaaz se batao"
            helperText="Number badalne par awaaz mein batayenge."
            checked={soundEnabled}
            onChange={(val) => setSoundEnabled(val)}
          />

          <div className="bg-[var(--c-next-soft)] p-[12px] rounded-[12px] flex items-start gap-[8px]">
            <span className="type-body-sm text-[var(--c-next-strong)]">
              Awaaz tabhi aayegi jab ye screen chalu ho. Phone off ya lock karne par awaaz nahi aayegi. Tab sirf notification milega.
            </span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => {
              showToast("Test awaaz baji", "info");
            }}
          >
            Test awaaz sunein
          </Button>
        </div>
      </BottomSheet>

      {/* Line Chhodein Dialog (C7) */}
      <Dialog
        isOpen={isLeaveDialogOpen}
        onClose={() => setIsLeaveDialogOpen(false)}
        title="Line chhodein?"
        body={`Aapka number ${yourNum} chala jayega. Aap dobara scan karke naya token le sakte hain.`}
        confirmLabel="Haan, chhodein"
        cancelLabel="Nahi"
        isDestructive
        onConfirm={handleLeaveConfirm}
      />
    </div>
  );
}
