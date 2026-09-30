"use client";

import React from "react";

export interface StickyBarProps {
  children: React.ReactNode;
  testId?: string;
}

export const StickyBar: React.FC<StickyBarProps> = ({
  children,
  testId = "sticky-bar",
}) => {
  return (
    <div
      data-testid={testId}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--c-bg)",
        borderTop: "1px solid var(--c-border)",
        padding: "12px 20px calc(12px + var(--safe-bottom))",
        zIndex: "var(--z-sticky)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
};
