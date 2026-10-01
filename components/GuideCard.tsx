"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Card } from "./Cards";

export interface GuideStep {
  number: number;
  text: string;
}

export interface GuideBlock {
  label: "Ye kya hai" | "Kab use karein" | "Kaise karein" | "Dhyan rakhein" | string;
  text?: string;
  steps?: GuideStep[];
}

export interface GuideCardProps {
  title?: string;
  q?: string; // legacy alias for title
  a?: string; // legacy alias for simple answer text
  blocks?: GuideBlock[];
  isOpen?: boolean;
  onToggle?: () => void;
  testId?: string;
}

export const GuideCard: React.FC<GuideCardProps> = ({
  title,
  q,
  a,
  blocks = [],
  isOpen: initialIsOpen = false,
  onToggle,
  testId = "guide-card",
}) => {
  const [internalOpen, setInternalOpen] = React.useState(initialIsOpen);
  const isAccordionOpen = onToggle !== undefined ? initialIsOpen : internalOpen;

  const cardTitle = title || q || "Guide";
  const displayBlocks: GuideBlock[] = a
    ? [{ label: "Answer", text: a }]
    : blocks;

  const handleHeaderClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  return (
    <Card testId={testId} style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div
        onClick={handleHeaderClick}
        style={{
          minHeight: "56px",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <span className="t-label" style={{ color: "var(--c-text)" }}>
          {cardTitle}
        </span>
        <ChevronRight
          size={20}
          style={{
            color: "var(--c-text-2)",
            transform: isAccordionOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 200ms ease",
          }}
        />
      </div>

      {/* Accordion Body */}
      {isAccordionOpen && (
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {displayBlocks.map((block, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {block.label !== "Answer" && (
                <span className="t-label" style={{ color: "var(--c-accent)" }}>
                  {block.label}
                </span>
              )}
              {block.text && (
                <p className="t-body-sm" style={{ color: "var(--c-text)" }}>
                  {block.text}
                </p>
              )}
              {block.steps && block.steps.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
                  {block.steps.map((step) => (
                    <div key={step.number} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          backgroundColor: "var(--c-accent-soft)",
                          color: "var(--c-accent)",
                          fontSize: "12px",
                          fontWeight: 700,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        {step.number}
                      </div>
                      <span className="t-body" style={{ color: "var(--c-text)" }}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GuideCard;
