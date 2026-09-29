"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "./Card";

export interface GuideCardProps {
  title: string;
  whatIsIt?: string;
  whenToUse?: string;
  howToSteps?: string[];
  keepInMind?: string;
  defaultOpen?: boolean;
  "data-testid"?: string;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  title,
  whatIsIt,
  whenToUse,
  howToSteps,
  keepInMind,
  defaultOpen = false,
  "data-testid": testId,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card padding="0" data-testid={testId} className="w-full">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full min-h-[56px] px-[16px] py-[12px] flex items-center justify-between gap-[12px] text-left outline-none cursor-pointer hover:bg-[var(--c-surface-2)] transition-colors"
      >
        <span className="type-body-strong text-[var(--c-text)]">{title}</span>
        <ChevronRight
          className={`w-[20px] h-[20px] text-[var(--c-text-2)] transition-transform duration-base ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        />
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-[16px] pb-[16px] flex flex-col gap-[16px] border-t border-[var(--c-border)] pt-[16px] animate-in fade-in duration-fast">
          {whatIsIt && (
            <div className="flex flex-col gap-[4px]">
              <span className="type-label text-[var(--c-accent)]">Ye kya hai</span>
              <p className="type-body-sm text-[var(--c-text)]">{whatIsIt}</p>
            </div>
          )}

          {whenToUse && (
            <div className="flex flex-col gap-[4px]">
              <span className="type-label text-[var(--c-accent)]">Kab use karein</span>
              <p className="type-body-sm text-[var(--c-text)]">{whenToUse}</p>
            </div>
          )}

          {howToSteps && howToSteps.length > 0 && (
            <div className="flex flex-col gap-[8px]">
              <span className="type-label text-[var(--c-accent)]">Kaise karein</span>
              <div className="flex flex-col gap-[10px]">
                {howToSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-[12px]">
                    <div className="w-[24px] h-[24px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] type-caption font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <span className="type-body text-[var(--c-text)] pt-[1px]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {keepInMind && (
            <div className="flex flex-col gap-[4px]">
              <span className="type-label text-[var(--c-accent)]">Dhyan rakhein</span>
              <p className="type-body-sm text-[var(--c-text-2)]">{keepInMind}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
