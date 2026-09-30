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

  const getVariantStyles = (): React.CSSProperties => {
    if (disabled) {
      return {
        backgroundColor: "var(--c-disabled-bg)",
        color: "var(--c-text-disabled)",
        border: "none",
        cursor: "not-allowed",
      };
    }
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--c-accent)",
          color: "var(--c-on-accent)",
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: "var(--c-surface)",
          color: "var(--c-accent)",
          border: "1.5px solid var(--c-accent)",
        };
      case "tertiary":
        return {
          backgroundColor: "transparent",
          color: "var(--c-accent)",
          border: "none",
        };
      case "danger-outline":
        return {
          backgroundColor: "var(--c-surface)",
          color: "var(--c-danger)",
          border: "1.5px solid var(--c-danger)",
        };
      case "danger-filled":
        return {
          backgroundColor: "var(--c-danger)",
          color: "#FFFFFF",
          border: "none",
        };
      case "danger-text":
        return {
          backgroundColor: "transparent",
          color: "var(--c-danger)",
          border: "none",
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case "lg":
        return {
          height: "64px",
          borderRadius: "16px",
          paddingInline: "24px",
          fontSize: "18px",
          fontWeight: 600,
        };
      case "sm":
        return {
          height: "48px",
          borderRadius: "12px",
          paddingInline: "16px",
          fontSize: "16px",
          fontWeight: 600,
        };
      case "md":
      default:
        return {
          height: "56px",
          borderRadius: "14px",
          paddingInline: "24px",
          fontSize: "16px",
          fontWeight: 600,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: isFullWidth ? "100%" : "auto",
    minWidth: isFullWidth ? undefined : "120px",
    maxWidth: isFullWidth ? "440px" : undefined,
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    outline: "none",
    textDecoration: "none",
    transition: "transform 90ms cubic-bezier(.2,0,0,1), background-color 120ms cubic-bezier(.2,0,0,1)",
    ...getSizeStyles(),
    ...getVariantStyles(),
    ...style,
  };

  if (href) {
    return (
      <Link
        href={href}
        data-testid={testId}
        style={baseStyle}
        className={`btn-comp ${className}`}
      >
        {icon && <span style={{ display: "inline-flex", flexShrink: 0, width: "20px", height: "20px" }}>{icon}</span>}
        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{children}</span>
      </Link>
    );
  }

  return (
    <button
      {...props}
      data-testid={testId}
      disabled={disabled || loading}
      onClick={handleClick}
      style={baseStyle}
      className={`btn-comp ${className}`}
    >
      {loading ? (
        <Spinner size={20} color={variant === "primary" || variant === "danger-filled" ? "#FFFFFF" : "var(--c-accent)"} />
      ) : icon ? (
        <span style={{ display: "inline-flex", flexShrink: 0, width: "20px", height: "20px" }}>{icon}</span>
      ) : null}
      <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{children}</span>
    </button>
  );
};

export const ButtonLink = Button;
export default Button;
