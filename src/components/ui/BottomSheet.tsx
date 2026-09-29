"use client";

import React, { useEffect } from "react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  "data-testid"?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  dismissible = true,
  "data-testid": testId,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible && isOpen) {
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
  }, [isOpen, dismissible, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "sheet-title" : undefined}
      aria-describedby={subtitle ? "sheet-subtitle" : undefined}
      data-testid={testId}
      className="fixed inset-0 z-[var(--z-sheet)] flex flex-col justify-end items-center"
    >
      {/* Scrim */}
      <div
        onClick={() => dismissible && onClose()}
        className="absolute inset-0 bg-[var(--c-scrim)] animate-in fade-in duration-base"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-[var(--container-max)] bg-[var(--c-surface)] rounded-t-[24px] shadow-[var(--shadow-2)] pt-[12px] px-[20px] pb-[calc(20px+var(--safe-bottom))] max-h-[90dvh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-slow ease-emph">
        {/* Drag Handle */}
        <div className="w-[36px] h-[4px] rounded-[2px] bg-[var(--c-border-strong)] mx-auto mb-[16px]" />

        {/* Header */}
        {title && (
          <div className="mb-[16px]">
            <h2 id="sheet-title" className="type-h2 text-[var(--c-text)]">
              {title}
            </h2>
            {subtitle && (
              <p id="sheet-subtitle" className="type-body-sm text-[var(--c-text-2)] mt-[4px]">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-[16px]">{children}</div>
      </div>
    </div>
  );
};
