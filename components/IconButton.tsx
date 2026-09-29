"use client";

import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  "aria-label": string;
  variant?: "default" | "on-dark";
  testId?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  "aria-label": ariaLabel,
  variant = "default",
  testId,
  style,
  onClick,
  disabled,
  ...props
}) => {
  const [pressed, setPressed] = React.useState(false);

  const isDark = variant === "on-dark";

  const baseStyle: React.CSSProperties = {
    width: "48px",
    height: "48px",
    borderRadius: "24px",
    border: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    backgroundColor: isDark
      ? "rgba(17,24,39,.6)"
      : pressed
      ? "var(--c-surface-2)"
      : "transparent",
    color: isDark ? "#FFFFFF" : "var(--c-text)",
    opacity: disabled ? 0.5 : 1,
    outline: "none",
    transition: "background-color 120ms ease, transform 90ms ease",
    transform: pressed ? "scale(0.96)" : "scale(1)",
    ...style,
  };

  return (
    <button
      {...props}
      aria-label={ariaLabel}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={baseStyle}
    >
      <span style={{ width: "24px", height: "24px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </span>
    </button>
  );
};
