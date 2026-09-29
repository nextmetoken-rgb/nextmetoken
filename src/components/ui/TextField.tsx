"use client";

import React, { useState } from "react";
import { TriangleAlert, X } from "lucide-react";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  "data-testid"?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorText,
      "data-testid": testId,
      className = "",
      id,
      value,
      onChange,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const hasError = Boolean(errorText);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = () => {
      if (onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };

    return (
      <div className={`w-full flex flex-col gap-[8px] ${className}`}>
        {label && (
          <label htmlFor={inputId} className="type-label text-[var(--c-text)]">
            {label}
          </label>
        )}

        <div className="relative w-full flex items-center">
          <input
            ref={ref}
            id={inputId}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            data-testid={testId}
            className={`w-full h-[52px] rounded-[12px] px-[16px] type-body bg-[var(--c-surface)] text-[var(--c-text)] placeholder-[var(--c-text-3)] outline-none transition-all duration-fast ${
              disabled
                ? "bg-[var(--c-surface-2)] text-[var(--c-text-disabled)] cursor-not-allowed border-[1.5px] border-[var(--c-border)]"
                : hasError
                ? "border-[1.5px] border-[var(--c-danger)] shadow-[0_0_0_1px_var(--c-danger)]"
                : isFocused
                ? "border-[1.5px] border-[var(--c-accent)] shadow-[0_0_0_1px_var(--c-accent)]"
                : "border-[1.5px] border-[var(--c-border-strong)] hover:border-[var(--c-text-2)]"
            } ${value && isFocused ? "pr-[44px]" : ""}`}
            {...props}
          />

          {value && isFocused && !disabled && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              aria-label="Clear field"
              className="absolute right-[4px] w-[44px] h-[44px] flex items-center justify-center text-[var(--c-text-2)] hover:text-[var(--c-text)] transition-colors"
            >
              <X className="w-[20px] h-[20px]" />
            </button>
          )}
        </div>

        {hasError ? (
          <div
            id={`${inputId}-error`}
            className="flex items-center gap-[6px] type-caption text-[var(--c-danger)]"
          >
            <TriangleAlert className="w-[16px] h-[16px] shrink-0" />
            <span>{errorText}</span>
          </div>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="type-caption text-[var(--c-text-2)]">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

TextField.displayName = "TextField";
