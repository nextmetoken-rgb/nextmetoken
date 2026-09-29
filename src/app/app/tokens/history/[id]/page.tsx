"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { Card, ListRow } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { useQueue } from "@/context/QueueContext";

export default function TokenHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { tokens } = useQueue();

  const id = (params?.id as string) || "t_19";
  const token = tokens.find((t) => t.id === id) || tokens[0];

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Token history" onBack={() => router.back()} />

      <div className="px-[var(--page-pad)] pt-[16px]">
        <Card padding="20" className="flex flex-col gap-[16px]">
          <div className="flex flex-col">
            <h2 className="type-h2 text-[var(--c-text)]">{token?.businessName || "Sharma Sweets"}</h2>
            <span className="type-body-sm text-[var(--c-text-2)] mt-[2px]">26 Sep 2025</span>
          </div>

          <div className="flex flex-col border-t border-[var(--c-border)] pt-[8px]">
            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Queue shuru</span>
              <span className="type-body-strong text-[var(--c-text)]">9:00 AM</span>
            </ListRow>

            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Queue khatam</span>
              <span className="type-body-strong text-[var(--c-text)]">6:30 PM</span>
            </ListRow>

            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Aapka token</span>
              <span className="type-body-strong text-[var(--c-accent)]">{token?.number || 19}</span>
            </ListRow>

            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Token liya</span>
              <span className="type-body-strong text-[var(--c-text)]">{token?.issuedAt || "10:12 AM"}</span>
            </ListRow>

            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Aapka number aaya</span>
              <span className="type-body-strong text-[var(--c-text)]">10:42 AM</span>
            </ListRow>

            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Wait</span>
              <span className="type-body-strong text-[var(--c-text)]">30 min</span>
            </ListRow>

            <ListRow hasBorder>
              <span className="type-body-sm text-[var(--c-text-2)]">Andaza</span>
              <span className="type-body-strong text-[var(--c-text)]">25–35 min</span>
            </ListRow>

            <ListRow hasBorder={false}>
              <span className="type-body-sm text-[var(--c-text-2)]">Status</span>
              <Chip variant={token?.status === "done" ? "done" : "left"} />
            </ListRow>
          </div>

          <div className="mt-[8px]">
            <Chip variant="now" label="Andaze se pehle" className="w-full justify-center py-[6px]" />
          </div>
        </Card>
      </div>
    </div>
  );
}
