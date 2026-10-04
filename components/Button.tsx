"use client";

import React from "react";
import Link from "next/link";
import { Spinner } from "./Spinner";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "danger-outline"
  | "danger-filled"
  | "danger-text";

export type ButtonSize = "lg" | "md" | "sm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  wrap?: boolean; // legacy alias for fullWidth
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  testId?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  wrap = false,
  loading = false,
  icon,
  children,
  href,
  disabled,
  onClick,
  testId,
  style,
  className = "",
  ...props
}) => {
  const isFullWidth = fullWidth || wrap;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    if (variant === "primary" && typeof window !== "undefined" && window.navigator?.vibrate) {
      try {
        window.navigator.vibrate(10);
      } catch (_) {}
    }
    onClick?.(e);
  };

  const classes = `btn-comp btn-${variant} btn-size-${size}${isFullWidth ? ' btn-full' : ''}${disabled || loading ? ' is-disabled' : ''} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        data-testid={testId}
        style={style}
        className={classes}
      >
        {icon && <span className="btn-icon">{icon}</span>}
        <span className="btn-label">{children}</span>
      </Link>
    );
  }

  return (
    <button
      {...props}
      data-testid={testId}
      disabled={disabled || loading}
      onClick={handleClick}
      style={style}
      className={classes}
    >
      {loading ? (
        <Spinner size={20} color={variant === "primary" || variant === "danger-filled" ? "var(--c-on-accent)" : "var(--c-accent)"} />
      ) : icon ? (
        <span className="btn-icon">{icon}</span>
      ) : null}
      <span className="btn-label">{children}</span>
    </button>
  );
};

export const ButtonLink = Button;
export default Button;
