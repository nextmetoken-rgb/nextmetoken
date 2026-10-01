"use client";

import React from "react";
import { WifiOff, Pause, Clock } from "lucide-react";

export type BannerVariant = "offline" | "reconnecting" | "paused";

export interface BannerProps {
  variant: BannerVariant;
  customText?: string;
  minutesAgo?: number;
  testId?: string;
}

export const Banner: React.FC<BannerProps> = ({
  variant,
  customText,
  minutesAgo = 2,
  testId,
}) => {
  const getVariantDetails = () => {
    switch (variant) {
      case "offline":
        return {
          bg: "var(--c-surface-2)",
          text: "var(--c-text)",
          icon: <WifiOff size={16} />,
          copy: `Offline. Last update ${minutesAgo} min pehle.`,
        };
      case "reconnecting":
        return {
          bg: "var(--c-next-soft)",
          text: "var(--c-next-strong)",
          icon: <Clock size={16} />,
          copy: "Dobara connect ho raha hai…",
        };
      case "paused":
        return {
          bg: "var(--c-next-soft)",
          text: "var(--c-next-strong)",
          icon: <Pause size={16} />,
          copy: "Line thodi der ke liye ruki hai.",
        };
    }
  };

  const details = getVariantDetails();

  return (
    <div
      data-testid={testId}
      style={{
        width: "100%",
        minHeight: "40px",
        padding: "8px 20px",
        backgroundColor: details.bg,
        color: details.text,
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        zIndex: "var(--z-banner)",
        transition: "transform 200ms ease",
      }}
    >
      <span style={{ flexShrink: 0, display: "inline-flex" }}>{details.icon}</span>
      <span>{customText || details.copy}</span>
    </div>
  );
};
