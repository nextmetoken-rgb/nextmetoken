"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export type ToastType = "info" | "success" | "error";

export interface ToastProps {
  message: string;
  type?: ToastType;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  hasBottomNav?: boolean;
  durationMs?: number;
  hasActionBar?: boolean;
  testId?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  actionLabel,
  onAction,
  onDismiss,
  hasBottomNav = true,
  durationMs,
  hasActionBar = false,
  testId = "toast",
}) => {
  const [visible, setVisible] = React.useState(true);

  const autoDuration =
    durationMs || (actionLabel === "Undo" ? 5000 : type === "error" ? 6000 : 4000);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 150);
    }, autoDuration);
    return () => clearTimeout(timer);
  }, [autoDuration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} className="toast-icon-success" />;
      case "error":
        return <AlertTriangle size={20} className="toast-icon-error" />;
      case "info":
      default:
        return <Info size={20} className="toast-icon-info" />;
    }
  };

  const bottomOffset = hasActionBar ? "calc(84px + var(--safe-bottom))" : hasBottomNav
    ? "calc(var(--nav-h) + var(--safe-bottom) + 12px)" : "calc(var(--safe-bottom) + 12px)";

  return (
    <div
      data-testid={testId}
      role={type === "error" ? "alert" : "status"}
      className={`toast-surface${visible ? ' is-visible' : ''}`}
      style={{ bottom: bottomOffset }}
    >
      {getIcon()}
      <span
        className="t-body-sm toast-message"
      >
        {message}
      </span>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={() => {
            onAction();
            setVisible(false);
            onDismiss?.();
          }}
          className="t-label toast-action"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
