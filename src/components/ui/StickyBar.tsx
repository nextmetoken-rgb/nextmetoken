"use client";

import React from "react";

export interface StickyBarProps {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export const StickyBar: React.FC<StickyBarProps> = ({
  children,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <div
      data-testid={testId}
      className={`fixed bottom-0 left-0 right-0 z-[var(--z-sticky)] bg-[var(--c-bg)] border-t border-[var(--c-border)] ${className}`}
      style={{
        paddingTop: "12px",
        paddingInline: "var(--page-pad)",
        paddingBottom: "calc(12px + var(--safe-bottom))",
      }}
    >
      <div className="max-w-[var(--container-max)] mx-auto flex items-center justify-center gap-[12px]">
        {children}
      </div>
    </div>
  );
};
