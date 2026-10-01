"use client";

import React from "react";

export interface ProgressLineProps {
  percentage: number;
  compact?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  ariaLabel?: string;
  testId?: string;
}

export const ProgressLine: React.FC<ProgressLineProps> = ({
  percentage,
  compact = false,
  leftLabel,
  rightLabel,
  ariaLabel = "Token progress",
  testId,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const height = compact ? 6 : 8;

  return (
    <div
      data-testid={testId}
      style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}
    >
      {!compact && (leftLabel || rightLabel) && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {leftLabel && (
            <span className="t-caption" style={{ color: "var(--c-text-2)" }}>
              {leftLabel}
            </span>
          )}
          {rightLabel && (
            <span className="t-caption" style={{ color: "var(--c-text-2)" }}>
              {rightLabel}
            </span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        style={{
          position: "relative",
          height: `${height}px`,
          width: "100%",
          backgroundColor: "var(--c-border)",
          borderRadius: `${height / 2}px`,
          overflow: compact ? "hidden" : "visible",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "var(--c-accent)",
            borderRadius: `${height / 2}px`,
            transformOrigin: "left",
            transform: `scaleX(${clamped / 100})`,
            transition: "transform 300ms cubic-bezier(.2,0,0,1)",
          }}
        />
        {!compact && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${clamped}%`,
              transform: "translate(-50%, -50%)",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: "var(--c-accent)",
              border: "3px solid #FFFFFF",
              boxShadow: "var(--shadow-1)",
              transition: "left 300ms cubic-bezier(.2,0,0,1)",
            }}
          />
        )}
      </div>
    </div>
  );
};
