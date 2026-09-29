"use client";

import React, { useEffect, useState } from "react";

export interface NumberFlipProps {
  value: number | string;
  className?: string;
  "data-testid"?: string;
}

export const NumberFlip: React.FC<NumberFlipProps> = ({
  value,
  className = "",
  "data-testid": testId,
}) => {
  const [currentVal, setCurrentVal] = useState(value);
  const [prevVal, setPrevVal] = useState<number | string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPrevVal(null);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [value, currentVal]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      data-testid={testId}
      className={`relative inline-block overflow-hidden tabular-nums min-w-[3ch] text-center select-none ${className}`}
    >
      {isAnimating && prevVal !== null ? (
        <div className="relative w-full">
          <span className="block animate-[flipOut_250ms_var(--ease-emph)_forwards]">
            {prevVal}
          </span>
          <span className="absolute inset-0 block animate-[flipIn_250ms_var(--ease-emph)_forwards]">
            {currentVal}
          </span>
        </div>
      ) : (
        <span>{currentVal}</span>
      )}
    </div>
  );
};
