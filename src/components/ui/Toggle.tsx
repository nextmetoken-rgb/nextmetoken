"use client";

import React from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
  "data-testid"?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
  "data-testid": testId,
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      data-testid={testId}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex items-center w-[52px] h-[32px] rounded-full p-[3px] transition-colors duration-fast ease-standard outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-focus)] focus-visible:ring-offset-2 ${
        checked ? "bg-[var(--c-accent)]" : "bg-[var(--c-border-strong)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`w-[26px] h-[26px] rounded-full bg-white shadow-[var(--shadow-1)] transition-transform duration-fast ease-standard ${
          checked ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export interface ToggleRowProps {
  icon?: React.ReactNode;
  label: string;
  helperText?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  "data-testid"?: string;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  label,
  helperText,
  checked,
  onChange,
  disabled = false,
  "data-testid": testId,
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      data-testid={testId}
      className={`min-h-[56px] py-[12px] px-[16px] flex items-center justify-between gap-[12px] select-none cursor-pointer rounded-[12px] hover:bg-[var(--c-surface-2)] active:bg-[var(--c-surface-2)] transition-colors duration-fast ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex items-center gap-[12px] min-w-0 flex-1">
        {icon && <span className="w-[24px] h-[24px] text-[var(--c-text-2)] shrink-0">{icon}</span>}
        <div className="flex flex-col">
          <span className="type-body-strong text-[var(--c-text)]">{label}</span>
          {helperText && <span className="type-caption text-[var(--c-text-2)] mt-[2px]">{helperText}</span>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} aria-label={label} />
    </div>
  );
};
