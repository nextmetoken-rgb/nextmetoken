"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Plus, Clock } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { QueueCard, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { SettingsRow } from "@/components/ui/Card";
import { Banner } from "@/components/ui/Banner";
import { useQueue, QueueItem } from "@/context/QueueContext";

export default function BusinessPage() {
  const router = useRouter();
  const { queues, reopenQueue } = useQueue();

  const [selectedOldQueue, setSelectedOldQueue] = useState<QueueItem | null>(null);

  const activeQueues = queues.filter((q) => q.status === "live" || q.status === "paused");
  const oldQueues = queues.filter((q) => q.status === "closed" || q.status === "deleted");

  const handleNewQueueClick = () => {
    router.push("/app/business/new");
  };

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Business" isRootTab data-testid="biz.appbar" />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[16px]">
        {/* Trial Card */}
        <Card padding="16" data-testid="biz.trial-card" className="bg-[var(--c-accent-soft)] border-[var(--c-accent-soft-border)]">
          <div className="flex items-center gap-[10px]">
            <Clock className="w-[20px] h-[20px] text-[var(--c-accent)] shrink-0" />
            <div className="flex flex-col">
              <span className="type-body-strong text-[var(--c-accent)]">Free trial: 1 din 4 ghante baaki</span>
              <span className="type-caption text-[var(--c-text-2)]">Trial ke baad ₹3.57 per din.</span>
            </div>
          </div>
        </Card>

        {queues.length === 0 ? (
          <EmptyState
            icon={<Store className="w-[40px] h-[40px]" />}
            title="Apni pehli line banayein"
            body="Customer QR scan karke token lenge aur apni baari ka wait aaram se karenge."
            actionLabel="Queue banayein"
            onAction={handleNewQueueClick}
          />
        ) : (
          <>
            {/* Active Queues */}
            <div data-testid="biz.list" className="flex flex-col gap-[12px]">
              {activeQueues.map((q) => (
                <QueueCard
                  key={q.id}
                  name={q.name}
                  status={q.status}
                  currentNumber={q.currentNumber}
                  waitingCount={5}
                  onClick={() => router.push(`/app/business/${q.id}`)}
                />
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              icon={<Plus className="w-[20px] h-[20px]" />}
              onClick={handleNewQueueClick}
              data-testid="biz.new"
            >
              + Nayi queue banayein
            </Button>

            {/* Old / Closed Queues Section */}
            {oldQueues.length > 0 && (
              <div data-testid="biz.old" className="flex flex-col gap-[8px] mt-[16px]">
                <span className="type-overline text-[var(--c-text-2)]">PURANI QUEUES</span>
                <div className="flex flex-col gap-[12px]">
                  {oldQueues.map((q) => (
                    <QueueCard
                      key={q.id}
                      name={q.name}
                      status="closed"
                      lastUsedText={q.lastUsedText || "Aakhri baar: Aaj · 34 token"}
                      onClick={() => setSelectedOldQueue(q)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Purani Queue Sheet (O3) */}
      <BottomSheet
        isOpen={Boolean(selectedOldQueue)}
        onClose={() => setSelectedOldQueue(null)}
        title={selectedOldQueue?.name || "Queue"}
        subtitle={selectedOldQueue?.lastUsedText || "Aakhri baar: 26 Sep · 34 token"}
      >
        <div className="flex flex-col py-[4px]">
          <SettingsRow
            label="Dobara shuru karein"
            value="Number 1 se reset"
            onClick={() => {
              if (selectedOldQueue) {
                reopenQueue(selectedOldQueue.id);
                setSelectedOldQueue(null);
                router.push(`/app/business/${selectedOldQueue.id}`);
              }
            }}
          />
          <SettingsRow
            label="History dekhein"
            onClick={() => {
              if (selectedOldQueue) {
                router.push(`/app/business/${selectedOldQueue.id}/history`);
              }
            }}
          />
          <SettingsRow
            label="Settings badlein"
            onClick={() => {
              if (selectedOldQueue) {
                router.push(`/app/business/${selectedOldQueue.id}/settings`);
              }
            }}
          />
        </div>
      </BottomSheet>
    </div>
  );
}
