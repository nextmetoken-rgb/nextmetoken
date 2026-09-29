"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { RotateCcw, Trash2 } from "lucide-react";
import { AppBar } from "@/components/ui/AppBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { useQueue } from "@/context/QueueContext";

export default function RecentlyDeletedPage() {
  const router = useRouter();
  const { queues, restoreQueue, purgeQueue } = useQueue();

  const deletedQueues = queues.filter((q) => q.status === "deleted");

  return (
    <div className="min-h-dvh flex flex-col max-w-[var(--container-max)] mx-auto pb-[calc(24px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Recently Deleted" onBack={() => router.back()} data-testid="rd.appbar" />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[16px]">
        {/* Info Card */}
        <Card padding="16" data-testid="rd.info" className="bg-[var(--c-surface-2)]">
          <p className="type-body-sm text-[var(--c-text)]">
            Delete kiye gaye items 3 din tak yahan rehte hain. Uske baad hamesha ke liye hat jate hain.
          </p>
        </Card>

        {deletedQueues.length === 0 ? (
          <EmptyState
            icon={<Trash2 className="w-[40px] h-[40px]" />}
            title="Koi deleted item nahi hai"
          />
        ) : (
          <div data-testid="rd.list" className="flex flex-col gap-[12px]">
            {deletedQueues.map((q) => (
              <Card key={q.id} padding="16" className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <span className="type-body-strong text-[var(--c-text)]">{q.name}</span>
                  <Chip variant="waiting" label="Queue" />
                </div>

                <div className="flex flex-col gap-[2px] type-body-sm text-[var(--c-text-2)]">
                  <span>Delete hua: 26 Sep, 4:10 PM</span>
                  <span className="text-[var(--c-next-strong)] font-semibold">
                    Hamesha ke liye hatega: 2 din 3 ghante baaki
                  </span>
                </div>

                <div className="flex items-center gap-[12px] pt-[4px]">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<RotateCcw className="w-[16px] h-[16px]" />}
                    onClick={() => restoreQueue(q.id)}
                  >
                    Recover
                  </Button>

                  <Button
                    variant="danger-text"
                    size="sm"
                    onClick={() => purgeQueue(q.id)}
                  >
                    Hamesha ke liye hatao
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
