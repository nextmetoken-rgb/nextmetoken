"use client";

import React from "react";

export interface NumberFlipProps {
  value: number | string;
  className?: string;
  style?: React.CSSProperties;
  testId?: string;
}

export const NumberFlip: React.FC<NumberFlipProps> = ({
  value,
  className = "",
  style,
  testId,
}) => {
  const [currentVal, setCurrentVal] = React.useState(value);
  const [prevVal, setPrevVal] = React.useState<number | string | null>(null);
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    if (value !== currentVal) {
      setPrevVal(currentVal);
      setCurrentVal(value);
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        setPrevVal(null);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [value, currentVal]);

  return (
    <div
      data-testid={testId}
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "relative",
        overflow: "hidden",
        display: "inline-block",
        minWidth: "3ch",
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
        height: "1em",
        verticalAlign: "middle",
        ...style,
      }}
      className={className}
    >
      {animating && prevVal !== null && (
        <span
          key={`prev-${prevVal}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            transform: "translateY(-100%)",
            opacity: 0,
            transition: "transform 250ms cubic-bezier(.2,.8,.2,1), opacity 250ms cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {prevVal}
        </span>
      )}
      <span
        key={`curr-${currentVal}`}
        style={{
          display: "inline-block",
          transform: animating ? "translateY(0)" : "translateY(0)",
          opacity: 1,
          transition: animating
            ? "transform 250ms cubic-bezier(.2,.8,.2,1), opacity 250ms cubic-bezier(.2,.8,.2,1)"
            : "none",
        }}
      >
        {currentVal}
      </span>
    </div>
  );
};
