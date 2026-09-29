"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppBar } from "@/components/ui/AppBar";
import { TextField } from "@/components/ui/TextField";
import { ToggleRow } from "@/components/ui/Toggle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StickyBar } from "@/components/ui/StickyBar";
import { Dialog } from "@/components/ui/Dialog";
import { useQueue } from "@/context/QueueContext";

export default function QueueSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { queues, deleteQueue, showToast } = useQueue();

  const id = (params?.id as string) || "q_sharma";
  const queue = queues.find((q) => q.id === id) || queues[0];

  const [businessName, setBusinessName] = useState(queue?.name || "Sharma Sweets");
  const [counterName, setCounterName] = useState(queue?.counterName || "Counter 1");
  const [noLimit, setNoLimit] = useState(queue?.tokenLimit === undefined);
  const [limitCount, setLimitCount] = useState(String(queue?.tokenLimit || 100));
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast("Settings save ho gayi", "success");
      router.push(`/app/business/${id}`);
    }, 400);
  };

  const handleDeleteConfirm = () => {
    deleteQueue(id);
    setIsDeleteDialogOpen(false);
    router.push("/app/business");
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between max-w-[var(--container-max)] mx-auto pb-[calc(100px+var(--safe-bottom))] bg-[var(--c-bg)]">
      <AppBar title="Settings" onBack={() => router.back()} />

      <div className="px-[var(--page-pad)] pt-[8px] flex flex-col gap-[20px]">
        <TextField
          label="Business ka naam"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
        />

        <TextField
          label="Counter/queue ka naam"
          value={counterName}
          onChange={(e) => setCounterName(e.target.value)}
        />

        <Card padding="0">
          <ToggleRow
            label="Koi limit nahi"
            checked={noLimit}
            onChange={(val) => setNoLimit(val)}
          />
        </Card>

        {!noLimit && (
          <TextField
            label="Zyada se zyada token"
            inputMode="numeric"
            value={limitCount}
            onChange={(e) => setLimitCount(e.target.value)}
          />
        )}

        {/* Danger Zone */}
        <Card padding="16" className="border-[var(--c-danger-soft)] mt-[16px]">
          <span className="type-label text-[var(--c-danger)]">Danger Zone</span>
          <p className="type-body-sm text-[var(--c-text-2)] mt-[4px]">
            Queue delete karne par 3 din tak Recently Deleted me rehti hai.
          </p>
          <Button
            variant="danger-outline"
            size="md"
            fullWidth
            onClick={() => setIsDeleteDialogOpen(true)}
            className="mt-[12px]"
          >
            Queue delete karein
          </Button>
        </Card>
      </div>

      <StickyBar>
        <Button variant="primary" size="md" fullWidth isLoading={isLoading} onClick={handleSave}>
          Save karein
        </Button>
      </StickyBar>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Ye queue delete karein?"
        body="3 din tak Settings > Recently Deleted se wapas la sakte hain. Uske baad ye hamesha ke liye hat jayegi."
        confirmLabel="Delete karein"
        cancelLabel="Nahi"
        isDestructive
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
