"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger-outline" | "danger-filled" | "danger-text";
  size?: "lg" | "md" | "sm";
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  "data-testid"?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      fullWidth = false,
      children,
      className = "",
      disabled,
      "data-testid": testId,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleVibrate = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled && !isLoading) {
        if (typeof navigator !== "undefined" && "vibrate" in navigator && variant === "primary") {
          try {
            navigator.vibrate(10);
          } catch {
            // ignore if not supported
          }
        }
        onClick?.(e);
      }
    };

    // Variant classes
    const variantClasses = {
      primary:
        "bg-[var(--c-accent)] text-[var(--c-on-accent)] border-none hover:bg-[var(--c-accent-hover)] active:bg-[var(--c-accent-pressed)]",
      secondary:
        "bg-[var(--c-surface)] text-[var(--c-accent)] border-[1.5px] border-[var(--c-accent)] hover:bg-[var(--c-accent-soft)] active:bg-[var(--c-accent-soft)]",
      tertiary:
        "bg-transparent text-[var(--c-accent)] border-none hover:bg-[var(--c-accent-soft)] active:bg-[var(--c-accent-soft)]",
      "danger-outline":
        "bg-[var(--c-surface)] text-[var(--c-danger)] border-[1.5px] border-[var(--c-danger)] hover:bg-[var(--c-danger-soft)] active:bg-[var(--c-danger-soft)]",
      "danger-filled":
        "bg-[var(--c-danger)] text-white border-none hover:bg-[var(--c-danger-hover)] active:bg-[var(--c-danger-hover)]",
      "danger-text":
        "bg-transparent text-[var(--c-danger)] border-none hover:bg-[var(--c-danger-soft)] active:bg-[var(--c-danger-soft)]",
    }[variant];

    // Size classes
    const sizeClasses = {
      lg: "h-[64px] rounded-[16px] px-[24px] type-button-lg",
      md: "h-[56px] rounded-[14px] px-[24px] type-button",
      sm: "h-[48px] rounded-[12px] px-[16px] type-button",
    }[size];

    // Disabled state
    const isDisabled = disabled || isLoading;
    const disabledClasses = isDisabled
      ? "!bg-[var(--c-disabled-bg)] !text-[var(--c-text-disabled)] !border-none cursor-not-allowed !transform-none"
      : "active:scale-[0.98] transition-transform duration-fast ease-standard";

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        data-testid={testId}
        onClick={handleVibrate}
        className={`inline-flex items-center justify-center gap-[8px] font-sans font-semibold text-center select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-focus)] focus-visible:ring-offset-2 ${
          fullWidth ? "w-full max-w-[440px]" : "min-w-[120px]"
        } ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-[20px] h-[20px] rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-label="Loading"
          />
        ) : (
          icon && <span className="w-[20px] h-[20px] flex items-center justify-center">{icon}</span>
        )}
        <span className="truncate">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
