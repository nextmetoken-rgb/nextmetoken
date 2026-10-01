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
    <div data-testid={testId} className="sticky-action-bar">
      {children}
    </div>
  );
};
