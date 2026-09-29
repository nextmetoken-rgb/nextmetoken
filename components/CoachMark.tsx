"use client";

import React from "react";

export interface CoachMarkProps {
  isOpen: boolean;
  message: string;
  onDismiss: () => void;
  actionLabel?: string;
  testId?: string;
}

export const CoachMark: React.FC<CoachMarkProps> = ({
  isOpen,
  message,
  onDismiss,
  actionLabel = "Samajh gaya",
  testId = "coach-mark",
}) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-testid={testId}
      style={{
        position: "relative",
        maxWidth: "280px",
        backgroundColor: "var(--c-text)",
        color: "#FFFFFF",
        padding: "12px 16px",
        borderRadius: "12px",
        boxShadow: "var(--shadow-3)",
        opacity: visible ? 1 : 0,
        transition: "opacity 200ms ease",
        zIndex: "var(--z-sticky)",
      }}
    >
      <div className="t-body-sm" style={{ color: "#FFFFFF", marginBottom: "8px" }}>
        {message}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="t-label"
        style={{
          color: "#FCD34D",
          backgroundColor: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        {actionLabel}
      </button>
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          top: "-8px",
          left: "24px",
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderBottom: "8px solid var(--c-text)",
        }}
      />
    </div>
  );
};
