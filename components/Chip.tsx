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
  testId?: string;
}

export const Chip: React.FC<ChipProps> = ({ variant, label, testId }) => {
  const getVariantDetails = () => {
    switch (variant) {
      case "live":
        return {
          bg: "var(--c-success-soft)",
          text: "var(--c-success)",
          defaultLabel: "Live",
          dot: true,
        };
      case "paused":
        return {
          bg: "var(--c-next-soft)",
          text: "var(--c-next-strong)",
          defaultLabel: "Ruka hua",
          icon: <Pause size={14} />,
        };
      case "closed":
        return {
          bg: "var(--c-surface-2)",
          text: "var(--c-text-2)",
          defaultLabel: "Band",
        };
      case "waiting":
        return {
          bg: "var(--c-surface-2)",
          text: "var(--c-text)",
          defaultLabel: "Intezar me",
        };
      case "next":
        return {
          bg: "var(--c-next-soft)",
          text: "var(--c-next-strong)",
          defaultLabel: "Aapki baari aane wali hai",
        };
      case "now":
        return {
          bg: "var(--c-success-soft)",
          text: "var(--c-success)",
          defaultLabel: "Ab chal raha",
        };
      case "done":
        return {
          bg: "var(--c-surface-2)",
          text: "var(--c-text-2)",
          defaultLabel: "Ho gaya",
          icon: <Check size={14} />,
        };
      case "left":
        return {
          bg: "var(--c-surface-2)",
          text: "var(--c-text-2)",
          defaultLabel: "Hata diya",
        };
      case "walkin":
        return {
          bg: "var(--c-accent-soft)",
          text: "var(--c-accent)",
          defaultLabel: "Walk-in",
        };
      case "trial":
        return {
          bg: "var(--c-accent-soft)",
          text: "var(--c-accent)",
          defaultLabel: "Trial",
        };
      case "you":
        return {
          bg: "var(--c-accent)",
          text: "#FFFFFF",
          defaultLabel: "Aap",
        };
      case "estimate":
        return {
          bg: "rgba(255,255,255,.18)",
          text: "#FFFFFF",
          defaultLabel: "andaza",
        };
    }
  };

  const details = getVariantDetails();
  const textLabel = label || details.defaultLabel;

  return (
    <span
      data-testid={testId}
      style={{
        height: "24px",
        paddingInline: "10px",
        borderRadius: "999px",
        backgroundColor: details.bg,
        color: details.text,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "12px",
        lineHeight: "16px",
        fontWeight: 600,
        whiteSpace: "nowrap",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {details.dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: details.text,
            display: "inline-block",
          }}
        />
      )}
      {details.icon && (
        <span style={{ display: "inline-flex", alignItems: "center" }}>{details.icon}</span>
      )}
      <span>{textLabel}</span>
    </span>
  );
};
