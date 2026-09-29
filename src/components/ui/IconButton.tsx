"use client";

import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "on-dark";
  "aria-label": string;
  "data-testid"?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "default",
      "aria-label": ariaLabel,
      "data-testid": testId,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "relative inline-flex items-center justify-center w-[48px] h-[48px] rounded-full outline-none select-none transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-[var(--c-focus)] focus-visible:ring-offset-2";

    const variantClasses =
      variant === "on-dark"
        ? "bg-[rgba(17,24,39,0.6)] text-white hover:bg-[rgba(17,24,39,0.8)] active:scale-[0.96]"
        : "bg-transparent text-[var(--c-text)] hover:bg-[var(--c-surface-2)] active:bg-[var(--c-surface-2)] active:scale-[0.96]";

    const disabledClasses = disabled
      ? "opacity-40 cursor-not-allowed !transform-none"
      : "";

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        data-testid={testId}
        disabled={disabled}
        className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        <span className="w-[24px] h-[24px] flex items-center justify-center pointer-events-none">
          {children}
        </span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
