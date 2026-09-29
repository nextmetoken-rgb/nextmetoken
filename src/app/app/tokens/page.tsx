"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { TokenCard, Card, ListRow } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Ticket, ChevronRight } from "lucide-react";
import { useQueue } from "@/context/QueueContext";

export default function MereTokensPage() {
  const router = useRouter();
  const { tokens, queues } = useQueue();

  const activeTokens = tokens.filter((t) => t.status === "waiting" || t.status === "next" || t.status === "now");
  const pastTokens = tokens.filter((t) => t.status === "done" || t.status === "withdrawn" || t.status === "removed" || t.status === "closed");

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Mere Tokens" isRootTab data-testid="tokens.appbar" />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[20px]">
        {/* Active Tokens Section */}
        <div className="flex flex-col gap-[8px]">
          <span data-testid="tokens.live-label" className="type-overline text-[var(--c-text-2)]">
            ABHI KE TOKENS
          </span>

          {activeTokens.length === 0 ? (
            <EmptyState
              icon={<Ticket className="w-[40px] h-[40px]" />}
              title="Abhi koi token nahi"
              body="QR scan karke token lein."
              actionLabel="Scan karein"
              onAction={() => router.push("/app/scan")}
            />
          ) : (
            <div data-testid="tokens.live-list" className="flex flex-col gap-[12px]">
              {activeTokens.map((t) => {
                const queue = queues.find((q) => q.id === t.queueId);
                const currentNum = queue ? queue.currentNumber : 12;
                return (
                  <TokenCard
                    key={t.id}
                    businessName={t.businessName}
                    currentNumber={currentNum}
                    yourNumber={t.number}
                    status={t.status === "now" ? "now" : t.status === "next" ? "next" : "waiting"}
                    onClick={() => router.push(`/app/tokens/${t.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Past Tokens Section */}
        <div className="flex flex-col gap-[8px] mt-[16px]">
          <span data-testid="tokens.past-label" className="type-overline text-[var(--c-text-2)]">
            PURANE
          </span>

          {pastTokens.length === 0 ? (
            <p className="type-caption text-[var(--c-text-2)]">Koi purana token nahi hai.</p>
          ) : (
            <Card padding="0" data-testid="tokens.past-list">
              {pastTokens.map((t) => (
                <ListRow key={t.id} onClick={() => router.push(`/app/tokens/history/${t.id}`)}>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="type-body-strong text-[var(--c-text)] truncate">{t.businessName}</span>
                    <span className="type-caption text-[var(--c-text-2)]">26 Sep · Token {t.number}</span>
                  </div>
                  <div className="flex items-center gap-[8px] shrink-0">
                    <Chip variant={t.status === "done" ? "done" : "left"} />
                    <ChevronRight className="w-[20px] h-[20px] text-[var(--c-text-2)]" />
                  </div>
                </ListRow>
              ))}
            </Card>
          )}

          {pastTokens.length > 5 && (
            <Button variant="tertiary" size="sm" data-testid="tokens.more" className="self-center mt-[8px]">
              Aur dekhein
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
