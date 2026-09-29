"use client";

import React from "react";

export interface SegmentedOption {
  id: string;
  label: string;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  selectedId: string;
  onChange: (id: string) => void;
  "data-testid"?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  selectedId,
  onChange,
  "data-testid": testId,
}) => {
  return (
    <div
      role="tablist"
      data-testid={testId}
      className="relative w-full h-[44px] rounded-[12px] bg-[var(--c-surface-2)] p-[4px] flex items-center select-none"
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <button
            key={option.id}
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(option.id)}
            data-testid={`${testId || "segment"}.${option.id}`}
            className={`relative z-10 flex-1 h-full rounded-[8px] type-label text-center flex items-center justify-center transition-colors duration-fast ${
              isSelected
                ? "bg-[var(--c-surface)] text-[var(--c-accent)] shadow-[var(--shadow-1)] font-semibold"
                : "text-[var(--c-text-2)] hover:text-[var(--c-text)]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
