"use client";

import React from "react";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  dismissible?: boolean;
  testId?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  primaryAction,
  secondaryAction,
  dismissible = true,
  testId = "bottom-sheet",
}) => {
  const [mounted, setMounted] = React.useState(isOpen);
  const [dragY, setDragY] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const startYRef = React.useRef(0);

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
      if (e.key === "Escape" && isOpen && dismissible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, dismissible, onClose]);

  if (!mounted) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!dismissible) return;
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dismissible) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startYRef.current;
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || !dismissible) return;
    setIsDragging(false);
    if (dragY > 96) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-sheet)" }} data-testid={testId}>
      {/* Scrim */}
      <div
        onClick={() => dismissible && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "var(--c-scrim)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 200ms cubic-bezier(.2,0,0,1)",
          zIndex: "var(--z-scrim)",
        }}
      />

      {/* Sheet Container */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: "480px",
          margin: "0 auto",
          backgroundColor: "var(--c-surface)",
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          boxShadow: "var(--shadow-2)",
          maxHeight: "90dvh",
          display: "flex",
          flexDirection: "column",
          paddingTop: "12px",
          paddingInline: "20px",
          paddingBottom: "calc(20px + var(--safe-bottom))",
          transform: isOpen
            ? `translateY(${dragY}px)`
            : "translateY(100%)",
          transition: isDragging
            ? "none"
            : isOpen
            ? "transform 300ms cubic-bezier(.2,.8,.2,1)"
            : "transform 200ms cubic-bezier(.4,0,1,1)",
          zIndex: "var(--z-sheet)",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: "36px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: "var(--c-border-strong)",
            margin: "0 auto 16px",
            flexShrink: 0,
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: "16px", flexShrink: 0 }}>
          <h2 className="t-h2" style={{ color: "var(--c-text)" }}>
            {title}
          </h2>
          {subtitle && (
            <p className="t-body-sm" style={{ color: "var(--c-text-2)", marginTop: "4px" }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrollable Content */}
        <div style={{ overflowY: "auto", flex: 1, paddingBottom: "16px" }}>{children}</div>

        {/* Bottom Actions */}
        {(primaryAction || secondaryAction) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              marginTop: "12px",
              flexShrink: 0,
            }}
          >
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
};
