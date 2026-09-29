"use client";

import React from "react";

export interface StepDotsProps {
  currentStep: number;
  totalSteps: number;
  "data-testid"?: string;
}

export const StepDots: React.FC<StepDotsProps> = ({
  currentStep,
  totalSteps,
  "data-testid": testId,
}) => {
  return (
    <div data-testid={testId} className="flex items-center justify-between w-full py-[8px]">
      <div className="flex items-center gap-[8px]">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const isActive = index + 1 === currentStep;
          return (
            <div
              key={index}
              className={`h-[8px] rounded-full transition-all duration-base ease-standard ${
                isActive
                  ? "w-[24px] bg-[var(--c-accent)]"
                  : "w-[8px] bg-[var(--c-border-strong)]"
              }`}
            />
          );
        })}
      </div>

      <span className="type-caption text-[var(--c-text-2)]">
        {currentStep} / {totalSteps}
      </span>
    </div>
  );
};
