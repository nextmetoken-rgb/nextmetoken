"use client";

import React from "react";

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (val: T) => void;
  testId?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  testId = "segmented-control",
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((opt) => opt.value === value);

  return (
    <div
      role="tablist"
      data-testid={testId}
      style={{
        height: "44px",
        borderRadius: "12px",
        backgroundColor: "var(--c-surface-2)",
        padding: "4px",
        display: "flex",
        position: "relative",
        width: "100%",
      }}
    >
      {/* Sliding indicator */}
      {activeIndex >= 0 && (
        <div
          style={{
            position: "absolute",
            top: "4px",
            bottom: "4px",
            left: `calc(${(activeIndex * 100) / options.length}% + 4px)`,
            width: `calc(${100 / options.length}% - 8px)`,
            borderRadius: "8px",
            backgroundColor: "var(--c-surface)",
            boxShadow: "var(--shadow-1)",
            transition: "left 200ms cubic-bezier(.2,0,0,1)",
          }}
        />
      )}

      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(opt.value)}
            className="t-label"
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              zIndex: 1,
              cursor: "pointer",
              color: isActive ? "var(--c-accent)" : "var(--c-text-2)",
              display: "grid",
              placeItems: "center",
              transition: "color 200ms ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
