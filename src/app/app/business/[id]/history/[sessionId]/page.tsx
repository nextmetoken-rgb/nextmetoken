"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { Card, ListRow } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useQueue } from "@/context/QueueContext";

export default function SessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { queues } = useQueue();

  const id = (params?.id as string) || "q_sharma";
  const queue = queues.find((q) => q.id === id) || queues[0];

  const sessionTokens = [
    { number: 1, name: "Rahul Verma", time: "Liya 9:02 AM · Call 9:08 AM", status: "done" as const },
    { number: 2, name: "Suresh Gupta", time: "Liya 9:05 AM · Call 9:14 AM", status: "done" as const },
    { number: 3, name: "Anita Roy", time: "Liya 9:10 AM · Line chhod di", status: "left" as const },
    { number: 4, name: "Priya Sharma", time: "Liya 9:12 AM · Call 9:25 AM", status: "done" as const },
  ];

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Session detail" onBack={() => router.back()} />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[16px]">
        {/* Summary Card */}
        <Card padding="20" className="flex flex-col gap-[12px]">
          <h2 className="type-h2 text-[var(--c-text)]">26 Sep 2025</h2>

          <div className="grid grid-cols-2 gap-[12px] type-body-sm text-[var(--c-text-2)]">
            <span>Shuru: 9:00 AM</span>
            <span>Khatam: 6:30 PM</span>
            <span>Total token: 34</span>
            <span>Ausat wait: 6 min</span>
          </div>
        </Card>

        {/* Tokens List */}
        <Card padding="0">
          {sessionTokens.map((t) => (
            <ListRow key={t.number}>
              <div className="flex items-center gap-[12px] min-w-0 flex-1">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[var(--c-surface-2)] text-[var(--c-text)] type-label font-bold flex items-center justify-center shrink-0">
                  {t.number}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="type-body-strong text-[var(--c-text)] truncate">{t.name}</span>
                  <span className="type-caption text-[var(--c-text-2)]">{t.time}</span>
                </div>
              </div>

              <Chip variant={t.status} />
            </ListRow>
          ))}
        </Card>
      </div>
    </div>
  );
}
