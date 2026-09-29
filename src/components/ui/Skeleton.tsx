"use client";

import React from "react";

export interface SkeletonProps {
  className?: string;
  radius?: "6" | "12" | "16" | "pill" | "circle";
  width?: string | number;
  height?: string | number;
  "data-testid"?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  radius = "6",
  width,
  height,
  "data-testid": testId,
}) => {
  let rClass = "rounded-[6px]";
  if (radius === "12") rClass = "rounded-[12px]";
  if (radius === "16") rClass = "rounded-[16px]";
  if (radius === "pill" || radius === "circle") rClass = "rounded-full";

  return (
    <div
      data-testid={testId}
      style={{ width, height }}
      className={`relative overflow-hidden bg-[var(--c-skeleton)] ${rClass} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-[shimmer_1.2s_linear_infinite]" />
    </div>
  );
};

export interface SpinnerProps {
  size?: 20 | 32;
  className?: string;
  "data-testid"?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  className = "",
  "data-testid": testId,
}) => {
  const sizeClass = size === 20 ? "w-[20px] h-[20px] border-2" : "w-[32px] h-[32px] border-3";

  return (
    <div
      data-testid={testId}
      aria-label="Loading"
      className={`rounded-full border-[var(--c-accent)]/20 border-t-[var(--c-accent)] animate-spin ${sizeClass} ${className}`}
    />
  );
};
