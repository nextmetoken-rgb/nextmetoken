"use client";

import React from "react";
import { Pause, Check } from "lucide-react";

export type ChipVariant =
  | "live"
  | "paused"
  | "closed"
  | "waiting"
  | "next"
  | "now"
  | "done"
  | "left"
  | "walkin"
  | "trial"
  | "you"
  | "estimate";

export interface ChipProps {
  variant: ChipVariant;
  label?: string;
  className?: string;
  "data-testid"?: string;
}

export const Chip: React.FC<ChipProps> = ({ variant, label, className = "", "data-testid": testId }) => {
  let bgClass = "";
  let textClass = "";
  let defaultText = label;
  let icon: React.ReactNode = null;

  switch (variant) {
    case "live":
      bgClass = "bg-[var(--c-success-soft)]";
      textClass = "text-[var(--c-success)]";
      defaultText = label || "Live";
      icon = <span className="w-[6px] h-[6px] rounded-full bg-[var(--c-success)] mr-[4px]" />;
      break;
    case "paused":
      bgClass = "bg-[var(--c-next-soft)]";
      textClass = "text-[var(--c-next-strong)]";
      defaultText = label || "Paused";
      icon = <Pause className="w-[14px] h-[14px] mr-[4px]" />;
      break;
    case "closed":
      bgClass = "bg-[var(--c-surface-2)]";
      textClass = "text-[var(--c-text-2)]";
      defaultText = label || "Band hai";
      break;
    case "waiting":
      bgClass = "bg-[var(--c-surface-2)]";
      textClass = "text-[var(--c-text)]";
      defaultText = label || "Intezar me";
      break;
    case "next":
      bgClass = "bg-[var(--c-next-soft)]";
      textClass = "text-[var(--c-next-strong)]";
      defaultText = label || "Aap agle hain";
      break;
    case "now":
      bgClass = "bg-[var(--c-success-soft)]";
      textClass = "text-[var(--c-success)]";
      defaultText = label || "Ab chal raha";
      break;
    case "done":
      bgClass = "bg-[var(--c-surface-2)]";
      textClass = "text-[var(--c-text-2)]";
      defaultText = label || "Poora hua";
      icon = <Check className="w-[14px] h-[14px] mr-[4px]" />;
      break;
    case "left":
      bgClass = "bg-[var(--c-surface-2)]";
      textClass = "text-[var(--c-text-2)]";
      defaultText = label || "Line chhod di";
      break;
    case "walkin":
      bgClass = "bg-[var(--c-accent-soft)]";
      textClass = "text-[var(--c-accent)]";
      defaultText = label || "Walk-in";
      break;
    case "trial":
      bgClass = "bg-[var(--c-accent-soft)]";
      textClass = "text-[var(--c-accent)]";
      defaultText = label || "Trial";
      break;
    case "you":
      bgClass = "bg-[var(--c-accent)]";
      textClass = "text-white";
      defaultText = label || "Aap";
      break;
    case "estimate":
      bgClass = "bg-[rgba(255,255,255,0.18)]";
      textClass = "text-white";
      defaultText = label || "andaza";
      break;
  }

  return (
    <span
      data-testid={testId}
      className={`inline-flex items-center h-[24px] px-[10px] rounded-full type-caption font-semibold shrink-0 select-none ${bgClass} ${textClass} ${className}`}
    >
      {icon}
      <span>{defaultText}</span>
    </span>
  );
};
