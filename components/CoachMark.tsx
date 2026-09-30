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
    <div data-testid={testId} className="coach-mark" style={{ opacity: visible ? 1 : 0 }}>
      <div className="t-body-sm coach-mark-message">
        {message}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="coach-mark-action"
      >
        {actionLabel}
      </button>
    </div>
  );
};
