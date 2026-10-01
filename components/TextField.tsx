"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  helperText?: string;
  error?: string;
  testId?: string;
  onClear?: () => void;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({
  label,
  helperText,
  error,
  testId,
  value,
  onChange,
  onFocus,
  onBlur,
  onClear,
  disabled,
  id,
  style,
  className = "",
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const hasValue = Boolean(value && String(value).length > 0);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
      <label htmlFor={inputId} className="t-label" style={{ color: "var(--c-text)" }}>
        {label}
      </label>
      <div style={{ position: "relative", width: "100%" }}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          data-testid={testId}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          style={{
            height: "52px",
            borderRadius: "12px",
            backgroundColor: disabled ? "var(--c-surface-2)" : "var(--c-surface)",
            border: `1.5px solid ${error ? "var(--c-danger)" : isFocused ? "var(--c-accent)" : "var(--c-border-strong)"}`,
            boxShadow: error
              ? "0 0 0 1px var(--c-danger)"
              : isFocused
              ? "0 0 0 1px var(--c-accent)"
              : "none",
            paddingInlineStart: "16px",
            paddingInlineEnd: hasValue && isFocused && onClear ? "44px" : "16px",
            fontSize: "16px",
            lineHeight: "24px",
            color: disabled ? "var(--c-text-disabled)" : "var(--c-text)",
            width: "100%",
            outline: "none",
            transition: "border-color 120ms ease, box-shadow 120ms ease",
            ...style,
          }}
        />
        {!disabled && hasValue && isFocused && onClear && (
          <button
            type="button"
            aria-label="Clear field"
            onClick={onClear}
            tabIndex={-1}
            style={{
              position: "absolute",
              right: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "44px",
              height: "44px",
              display: "grid",
              placeItems: "center",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "var(--c-text-2)",
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>
      {error ? (
        <div
          id={errorId}
          className="t-caption"
          style={{
            color: "var(--c-danger)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <div id={helperId} className="t-caption" style={{ color: "var(--c-text-2)" }}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
});

TextField.displayName = "TextField";
