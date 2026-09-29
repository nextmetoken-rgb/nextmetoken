"use client";

import React from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  "data-testid"?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  body,
  actionLabel,
  onAction,
  "data-testid": testId,
}) => {
  return (
    <div
      data-testid={testId}
      className="flex flex-col items-center justify-center text-center py-[40px] px-[20px] my-auto"
    >
      <div className="w-[72px] h-[72px] rounded-full bg-[var(--c-accent-soft)] text-[var(--c-accent)] flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: "w-[40px] h-[40px]",
        })}
      </div>

      <h3 className="type-h3 text-[var(--c-text)] mt-[16px]">{title}</h3>

      {body && <p className="type-body-sm text-[var(--c-text-2)] max-w-[280px] mt-[8px]">{body}</p>}

      {actionLabel && onAction && (
        <div className="mt-[24px]">
          <Button variant="primary" size="md" onClick={onAction} className="min-w-[200px]">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
