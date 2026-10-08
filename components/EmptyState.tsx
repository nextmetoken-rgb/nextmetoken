"use client";

import React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  testId?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  testId = "empty-state",
}) => {
  return (
    <div
      data-testid={testId}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "32px 20px",
        minHeight: "300px",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          backgroundColor: "var(--c-accent-soft)",
          color: "var(--c-accent)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { size: 40 })}
      </div>
      <h3 className="t-h3" style={{ color: "var(--c-text)", marginTop: "16px" }}>
        {title}
      </h3>
      <p
        className="t-body-sm"
        style={{
          color: "var(--c-text-2)",
          maxWidth: "280px",
          marginTop: "8px",
        }}
      >
        {body}
      </p>
      {actionLabel && onAction && (
        <div style={{ marginTop: "24px" }}>
          <Button variant="primary" size="md" onClick={onAction} style={{ minWidth: "200px" }}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
