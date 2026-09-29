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
        return <CheckCircle2 size={20} style={{ color: "#86EFAC", flexShrink: 0 }} />;
      case "error":
        return <AlertTriangle size={20} style={{ color: "#FCA5A5", flexShrink: 0 }} />;
      case "info":
      default:
        return <Info size={20} style={{ color: "#FFFFFF", flexShrink: 0 }} />;
    }
  };

  const bottomOffset = hasBottomNav
    ? "calc(var(--nav-h) + var(--safe-bottom) + 12px)"
    : "calc(var(--safe-bottom) + 12px)";

  return (
    <div
      data-testid={testId}
      role={type === "error" ? "alert" : "status"}
      style={{
        position: "fixed",
        bottom: bottomOffset,
        left: "20px",
        right: "20px",
        maxWidth: "440px",
        margin: "0 auto",
        minHeight: "48px",
        padding: "12px 16px",
        borderRadius: "12px",
        backgroundColor: "var(--c-toast-bg)",
        color: "#FFFFFF",
        boxShadow: "var(--shadow-3)",
        zIndex: "var(--z-toast)",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        transform: visible ? "translateY(0)" : "translateY(16px)",
        opacity: visible ? 1 : 0,
        transition: "transform 200ms cubic-bezier(0,0,.2,1), opacity 150ms ease",
      }}
    >
      {getIcon()}
      <span
        className="t-body-sm"
        style={{
          flex: 1,
          color: "#FFFFFF",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
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
          className="t-label"
          style={{
            color: "#FCD34D",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            minHeight: "48px",
            minWidth: "48px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8px",
            flexShrink: 0,
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
