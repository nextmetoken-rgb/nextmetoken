"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { ChevronRight } from "lucide-react";
import { useQueue } from "@/context/QueueContext";

export default function OwnerHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { queues } = useQueue();

  const id = (params?.id as string) || "q_sharma";
  const queue = queues.find((q) => q.id === id) || queues[0];

  const sessions = [
    {
      id: "s_26sep",
      date: "26 Sep 2025",
      timeText: "Shuru: 9:00 AM · Khatam: 6:30 PM",
      totalTokens: 34,
      avgWait: 6,
    },
    {
      id: "s_25sep",
      date: "25 Sep 2025",
      timeText: "Shuru: 9:00 AM · Khatam: 7:00 PM",
      totalTokens: 42,
      avgWait: 8,
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="History" onBack={() => router.back()} />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[12px]">
        {sessions.map((s) => (
          <Card
            key={s.id}
            padding="16"
            onClick={() => router.push(`/app/business/${id}/history/${s.id}`)}
            className="cursor-pointer hover:bg-[var(--c-surface-2)] active:bg-[var(--c-surface-2)] transition-colors select-none"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0">
                <span className="type-body-strong text-[var(--c-text)]">{s.date}</span>
                <span className="type-body-sm text-[var(--c-text-2)] mt-[2px]">{s.timeText}</span>
              </div>
              <ChevronRight className="w-[20px] h-[20px] text-[var(--c-text-2)] shrink-0" />
            </div>

            <div className="flex items-center gap-[8px] mt-[12px]">
              <Chip variant="waiting" label={`${s.totalTokens} token`} />
              <Chip variant="waiting" label={`Ausat wait ${s.avgWait} min`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
