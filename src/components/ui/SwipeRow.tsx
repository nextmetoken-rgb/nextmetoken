"use client";

import React, { useState, useRef } from "react";
import { UserMinus, EllipsisVertical } from "lucide-react";
import { IconButton } from "./IconButton";

export interface SwipeRowProps {
  children: React.ReactNode;
  onRemove: () => void;
  "data-testid"?: string;
}

export const SwipeRow: React.FC<SwipeRowProps> = ({
  children,
  onRemove,
  "data-testid": testId,
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const diff = e.touches[0].clientX - startXRef.current;
    if (diff < 0) {
      setTranslateX(Math.max(diff, -120));
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (translateX < -96) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(12);
        } catch {}
      }
      onRemove();
    }
    setTranslateX(0);
  };

  return (
    <div
      data-testid={testId}
      className="relative w-full overflow-hidden select-none touch-pan-y rounded-[12px]"
    >
      {/* Revealed Background Action */}
      <div
        onClick={() => onRemove()}
        className="absolute inset-y-0 right-0 w-[96px] bg-[var(--c-danger)] text-white flex items-center justify-center gap-[4px] cursor-pointer"
      >
        <UserMinus className="w-[20px] h-[20px]" />
        <span className="type-label text-white">Hatao</span>
      </div>

      {/* Foreground Content */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${translateX}px)` }}
        className="relative z-10 bg-[var(--c-surface)] transition-transform duration-fast flex items-center justify-between"
      >
        <div className="flex-1 min-w-0">{children}</div>

        {/* Fallback menu button for desktop / mouse */}
        <div className="pr-[4px] shrink-0">
          <IconButton
            aria-label="Hatao options"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <EllipsisVertical className="w-[20px] h-[20px]" />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
