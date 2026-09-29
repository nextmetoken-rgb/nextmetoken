"use client";

import React, { useEffect } from "react";
import { Button } from "./Button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string | React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  "data-testid"?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel,
  onConfirm,
  cancelLabel = "Nahi",
  isDestructive = false,
  isLoading = false,
  "data-testid": testId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      data-testid={testId}
      className="fixed inset-0 z-[var(--z-dialog)] flex items-center justify-center p-[20px]"
    >
      {/* Scrim */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[var(--c-scrim)] animate-in fade-in duration-base"
      />

      {/* Dialog Window */}
      <div className="relative w-full max-w-[360px] bg-[var(--c-surface)] rounded-[20px] shadow-[var(--shadow-3)] p-[24px_20px_20px] z-10 animate-in zoom-in-95 fade-in duration-base ease-decel flex flex-col">
        <h2 id="dialog-title" className="type-h2 text-[var(--c-text)]">
          {title}
        </h2>

        <div className="type-body text-[var(--c-text-2)] mt-[8px]">{body}</div>

        <div className="flex flex-col gap-[12px] mt-[24px]">
          <Button
            variant={isDestructive ? "danger-filled" : "primary"}
            size="md"
            fullWidth
            isLoading={isLoading}
            onClick={onConfirm}
            data-testid={`${testId || "dialog"}.confirm`}
          >
            {confirmLabel}
          </Button>

          <Button
            variant="tertiary"
            size="md"
            fullWidth
            disabled={isLoading}
            onClick={onClose}
            data-testid={`${testId || "dialog"}.cancel`}
          >
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
