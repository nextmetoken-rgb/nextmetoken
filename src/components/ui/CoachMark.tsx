"use client";

import React, { useEffect, useState } from "react";

export interface CoachMarkProps {
  id: string;
  message: string;
  targetRef?: React.RefObject<HTMLElement | null>;
  enabled?: boolean;
  onDismiss?: () => void;
  "data-testid"?: string;
}

export const CoachMark: React.FC<CoachMarkProps> = ({
  id,
  message,
  enabled = true,
  onDismiss,
  "data-testid": testId,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const dismissedKey = `coachmark_dismissed_${id}`;
    if (localStorage.getItem(dismissedKey)) {
      return;
    }
    const timer = setTimeout(() => {
      setVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [id, enabled]);

  const handleDismiss = () => {
    localStorage.setItem(`coachmark_dismissed_${id}`, "true");
    setVisible(false);
    onDismiss?.();
  };

  if (!visible || !enabled) return null;

  return (
    <div
      data-testid={testId || `coachmark.${id}`}
      className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[var(--z-toast)] max-w-[280px] bg-[var(--c-text)] text-white p-[12px_16px] rounded-[12px] shadow-[var(--shadow-3)] flex flex-col gap-[8px] animate-in fade-in duration-fast"
    >
      <p className="type-body-sm text-white">{message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="type-label text-[#FCD34D] text-right self-end cursor-pointer hover:underline"
      >
        Samajh gaya
      </button>
    </div>
  );
};
