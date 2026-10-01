"use client";

import React from "react";
import { UserMinus, MoreVertical } from "lucide-react";
import { IconButton } from "./IconButton";
import { Dialog } from "./Dialog";

export interface SwipeRowProps {
  children: React.ReactNode;
  onRemove: () => void;
  personName?: string;
  personNumber?: number;
  testId?: string;
}

export const SwipeRow: React.FC<SwipeRowProps> = ({
  children,
  onRemove,
  personName = "Customer",
  personNumber = 14,
  testId = "swipe-row",
}) => {
  const [dragX, setDragX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const startXRef = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startXRef.current;
    if (deltaX < 0) {
      setDragX(Math.max(-120, deltaX));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX < -96) {
      setShowConfirm(true);
    }
    setDragX(0);
  };

  const handleConfirmRemove = () => {
    setShowConfirm(false);
    onRemove();
  };

  return (
    <div
      data-testid={testId}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        touchAction: "pan-y",
      }}
    >
      {/* Revealed action behind */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "96px",
          backgroundColor: "var(--c-danger)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          gap: "4px",
          cursor: "pointer",
        }}
        onClick={() => setShowConfirm(true)}
      >
        <UserMinus size={20} />
        <span className="t-label" style={{ color: "#FFFFFF", fontSize: "12px" }}>
          Hatao
        </span>
      </div>

      {/* Main Row Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: "relative",
          backgroundColor: "var(--c-surface)",
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? "none" : "transform 200ms ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: 1 }}>{children}</div>
        <div style={{ paddingRight: "8px", flexShrink: 0 }}>
          <IconButton
            icon={<MoreVertical size={20} />}
            aria-label="Options"
            onClick={() => setShowConfirm(true)}
            testId={`${testId}.more`}
          />
        </div>
      </div>

      {/* v7 §11 Confirm Dialog */}
      <Dialog
        isOpen={showConfirm}
        title="Pakka list se hatana hai?"
        body={`#${personNumber} ${personName} ko line se hata diya jayega aur unhe "Owner ne aapko line se hata diya" dikhega. 5 second me Undo kar sakte hain.`}
        primaryLabel="Haan, hatao"
        primaryVariant="danger-filled"
        onPrimary={handleConfirmRemove}
        cancelLabel="Nahi"
        onCancel={() => setShowConfirm(false)}
        testId={`${testId}.confirm`}
      />
    </div>
  );
};
