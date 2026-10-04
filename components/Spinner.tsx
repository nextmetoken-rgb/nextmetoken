"use client";

import React from "react";

export interface SpinnerProps {
  size?: 20 | 32 | number;
  color?: string;
  testId?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  color = "var(--c-accent)",
  testId,
}) => {
  return (
    <div
      data-testid={testId}
      role="status"
      aria-label="Loading"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        borderTopColor: "transparent",
        animation: "spin 800ms linear infinite",
        flexShrink: 0,
        display: "inline-block",
      }}
    />
  );
};
