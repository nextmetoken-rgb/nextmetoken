"use client";

import React from "react";

export interface ProgressLineProps {
  progress: number; // 0 to 100
  compact?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  "data-testid"?: string;
}

export const ProgressLine: React.FC<ProgressLineProps> = ({
  progress,
  compact = false,
  leftLabel,
  rightLabel,
  "data-testid": testId,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));

  if (compact) {
    return (
      <div
        role="progressbar"
        aria-valuenow={normalizedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress"
        data-testid={testId}
        className="w-full h-[6px] rounded-[3px] bg-[var(--c-border)] overflow-hidden"
      >
        <div
          className="h-full bg-[var(--c-accent)] transition-transform duration-slow ease-standard origin-left"
          style={{ transform: `scaleX(${normalizedProgress / 100})` }}
        />
      </div>
    );
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={normalizedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress"
      data-testid={testId}
      className="w-full flex flex-col gap-[8px]"
    >
      {(leftLabel || rightLabel) && (
        <div className="flex items-center justify-between type-caption text-[var(--c-text-2)]">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}

      <div className="relative w-full h-[8px] rounded-[4px] bg-[var(--c-border)] flex items-center">
        <div
          className="h-full rounded-[4px] bg-[var(--c-accent)] transition-transform duration-slow ease-standard origin-left"
          style={{ width: "100%", transform: `scaleX(${normalizedProgress / 100})` }}
        />
        <div
          className="absolute w-[16px] h-[16px] rounded-full bg-[var(--c-accent)] border-[3px] border-white shadow-[var(--shadow-1)] transition-transform duration-slow ease-standard"
          style={{
            left: `calc(${normalizedProgress}% - 8px)`,
          }}
        />
      </div>
    </div>
  );
};
