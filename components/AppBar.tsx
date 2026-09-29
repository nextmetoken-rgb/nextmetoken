"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "./IconButton";

export interface AppBarProps {
  title: string;
  isRootTab?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  scrolled?: boolean;
  testId?: string;
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  isRootTab = false,
  onBack,
  rightActions,
  scrolled = false,
  testId,
}) => {
  return (
    <header
      data-testid={testId}
      style={{
        position: "sticky",
        top: 0,
        zIndex: "var(--z-sticky)",
        backgroundColor: "var(--c-bg)",
        borderBottom: scrolled ? "1px solid var(--c-border)" : "1px solid transparent",
        paddingTop: "var(--safe-top)",
        transition: "border-color 120ms ease",
      }}
    >
      <div
        style={{
          height: "var(--appbar-h)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: isRootTab ? "20px" : "12px",
          maxWidth: "var(--container-max)",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", flex: 1 }}>
          {!isRootTab && onBack && (
            <IconButton
              icon={<ArrowLeft size={24} />}
              aria-label="Wapas"
              onClick={onBack}
              testId="appbar.back"
            />
          )}
          {isRootTab ? (
            <h2 className="t-h2" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </h2>
          ) : (
            <h3 className="t-h3" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {title}
            </h3>
          )}
        </div>
        {rightActions && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
            {rightActions}
          </div>
        )}
      </div>
    </header>
  );
};
