"use client";

import React from "react";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  title: string;
  body: React.ReactNode;
  primaryLabel: string;
  primaryVariant?: "primary" | "danger-filled";
  onPrimary: () => void;
  cancelLabel?: string;
  onCancel: () => void;
  primaryDisabled?: boolean;
  testId?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  title,
  body,
  primaryLabel,
  primaryVariant = "primary",
  onPrimary,
  cancelLabel = "Nahi",
  onCancel,
  primaryDisabled = false,
  testId = "dialog",
}) => {
  const [mounted, setMounted] = React.useState(isOpen);

  React.useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = "";
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!mounted) return null;

  return (
    <div
      data-testid={testId}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: "var(--z-dialog)",
        display: "grid",
        placeItems: "center",
      }}
    >
      {/* Scrim */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "var(--c-scrim)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 200ms cubic-bezier(0,0,.2,1)",
        }}
      />

      {/* Dialog Box */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: "min(calc(100vw - 40px), 360px)",
          backgroundColor: "var(--c-surface)",
          borderRadius: "20px",
          padding: "24px 20px 20px",
          boxShadow: "var(--shadow-3)",
          position: "relative",
          zIndex: "var(--z-dialog)",
          transform: isOpen ? "scale(1)" : "scale(0.96)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 200ms cubic-bezier(0,0,.2,1), opacity 200ms cubic-bezier(0,0,.2,1)",
        }}
      >
        <h2 className="t-h2" style={{ color: "var(--c-text)" }}>
          {title}
        </h2>
        <div className="t-body" style={{ color: "var(--c-text-2)", marginTop: "8px" }}>
          {body}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "24px",
          }}
        >
          <Button
            variant={primaryVariant}
            size="md"
            fullWidth
            onClick={onPrimary}
            disabled={primaryDisabled}
            testId={`${testId}.primary`}
          >
            {primaryLabel}
          </Button>
          <Button
            variant="tertiary"
            size="md"
            fullWidth
            onClick={onCancel}
            testId={`${testId}.cancel`}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
