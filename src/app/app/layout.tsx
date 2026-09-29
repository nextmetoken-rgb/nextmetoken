"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/ui/BottomNav";
import { Toast } from "@/components/ui/Toast";
import { useQueue } from "@/context/QueueContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast, dismissToast, tokens } = useQueue();

  // Hide BottomNav on full screen console or sub-pages if specified
  const isConsole = pathname?.includes("/business/") && !pathname?.endsWith("/business");
  const isSudoku = pathname?.includes("/sudoku");
  const showNav = !isConsole && !isSudoku;

  // Check if user has active tokens in 'next' or 'now' state
  const hasActiveLiveToken = tokens.some(
    (t) => t.status === "next" || t.status === "now"
  );

  return (
    <div className="min-h-dvh flex flex-col bg-[var(--c-bg)]">
      <main className="flex-1 w-full max-w-[var(--container-max)] mx-auto relative flex flex-col">
        {children}
      </main>

      <Toast toast={toast} onDismiss={dismissToast} hasNav={showNav} />

      {showNav && <BottomNav hasActiveLiveToken={hasActiveLiveToken} />}
    </div>
  );
}
