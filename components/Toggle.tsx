"use client";

import React from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  testId?: string;
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  testId,
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      data-testid={testId}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: "52px",
        height: "32px",
        borderRadius: "999px",
        backgroundColor: checked ? "var(--c-accent)" : "var(--c-border-strong)",
        border: "none",
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background-color 120ms cubic-bezier(.2,0,0,1)",
        outline: "none",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          boxShadow: "var(--shadow-1)",
          position: "absolute",
          top: "3px",
          left: "3px",
          transform: checked ? "translateX(20px)" : "translateX(0)",
          transition: "transform 120ms cubic-bezier(.2,0,0,1)",
        }}
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
  testId?: string;
}

export const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  label,
  helperText,
  checked,
  onChange,
  disabled = false,
  testId,
}) => {
  const [pressed, setPressed] = React.useState(false);
  const toggleId = React.useId();

  return (
    <div
      data-testid={testId}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest('button')) return;
        if (!disabled) onChange(!checked);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        minHeight: "56px",
        paddingBlock: "12px",
        paddingInline: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        backgroundColor: pressed ? "var(--c-surface-2)" : "transparent",
        borderRadius: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 120ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        {icon && (
          <span style={{ color: "var(--c-text-2)", flexShrink: 0, width: "24px", height: "24px" }}>
            {icon}
          </span>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span className="t-label" style={{ color: "var(--c-text)" }}>
            {label}
          </span>
          {helperText && (
            <span className="t-caption" style={{ color: "var(--c-text-2)" }}>
              {helperText}
            </span>
          )}
        </div>
      </div>
      <Toggle id={toggleId} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
};
