"use client";

import React from "react";

export interface StepDotsProps {
  totalSteps: number;
  currentStep: number;
  showText?: boolean;
  testId?: string;
}

export const StepDots: React.FC<StepDotsProps> = ({
  totalSteps,
  currentStep,
  showText = true,
  testId = "step-dots",
}) => {
  return (
    <div
      data-testid={testId}
      style={{ display: "flex", alignItems: "center", gap: "12px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;

          return (
            <div
              key={idx}
              style={{
                height: "8px",
                width: isActive ? "24px" : "8px",
                borderRadius: "999px",
                backgroundColor: isActive ? "var(--c-accent)" : "var(--c-border-strong)",
                transition: "width 200ms cubic-bezier(.2,0,0,1), background-color 200ms cubic-bezier(.2,0,0,1)",
              }}
            />
          );
        })}
      </div>
      {showText && (
        <span className="t-caption" style={{ color: "var(--c-text-2)" }}>
          {`${currentStep} / ${totalSteps}`}
        </span>
      )}
    </div>
  );
};
