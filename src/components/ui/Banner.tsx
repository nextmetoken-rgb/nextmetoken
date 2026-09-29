"use client";

import React from "react";
import { WifiOff, Pause, Clock, AlertTriangle } from "lucide-react";

export type BannerVariant = "offline" | "reconnecting" | "paused" | "trial" | "locked";

export interface BannerProps {
  variant: BannerVariant;
  text?: string;
  className?: string;
  "data-testid"?: string;
}

export const Banner: React.FC<BannerProps> = ({
  variant,
  text,
  className = "",
  "data-testid": testId,
}) => {
  let bgClass = "";
  let textClass = "";
  let icon: React.ReactNode = null;
  let defaultText = text;

  switch (variant) {
    case "offline":
      bgClass = "bg-[var(--c-surface-2)]";
      textClass = "text-[var(--c-text)]";
      icon = <WifiOff className="w-[16px] h-[16px] shrink-0" />;
      defaultText = text || "Offline. Last update abhi pehle.";
      break;
    case "reconnecting":
      bgClass = "bg-[var(--c-next-soft)]";
      textClass = "text-[var(--c-next-strong)]";
      icon = <AlertTriangle className="w-[16px] h-[16px] shrink-0" />;
      defaultText = text || "Dobara connect ho raha hai…";
      break;
    case "paused":
      bgClass = "bg-[var(--c-next-soft)]";
      textClass = "text-[var(--c-next-strong)]";
      icon = <Pause className="w-[16px] h-[16px] shrink-0" />;
      defaultText = text || "Line thodi der ke liye ruki hai.";
      break;
    case "trial":
      bgClass = "bg-[var(--c-accent-soft)]";
      textClass = "text-[var(--c-accent)]";
      icon = <Clock className="w-[16px] h-[16px] shrink-0" />;
      defaultText = text || "Free trial: 1 din baaki";
      break;
    case "locked":
      bgClass = "bg-[var(--c-danger-soft)]";
      textClass = "text-[var(--c-danger)]";
      icon = <AlertTriangle className="w-[16px] h-[16px] shrink-0" />;
      defaultText = text || "Subscription khatam. Line abhi band hai.";
      break;
  }

  return (
    <div
      data-testid={testId}
      className={`w-full min-h-[40px] px-[20px] py-[8px] flex items-center justify-center gap-[8px] type-body-sm font-semibold animate-in slide-in-from-top-full duration-base ${bgClass} ${textClass} ${className}`}
    >
      {icon}
      <span>{defaultText}</span>
    </div>
  );
};
