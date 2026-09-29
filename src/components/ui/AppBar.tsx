"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { IconButton } from "./IconButton";

export interface AppBarProps {
  title: string;
  isRootTab?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  "data-testid"?: string;
}

export const AppBar: React.FC<AppBarProps> = ({
  title,
  isRootTab = false,
  onBack,
  rightActions,
  "data-testid": testId,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 8) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      data-testid={testId}
      className={`sticky top-0 z-[var(--z-sticky)] w-full bg-[var(--c-bg)] transition-colors duration-fast ${
        isScrolled ? "border-b border-[var(--c-border)]" : "border-b border-transparent"
      }`}
      style={{
        paddingTop: "var(--safe-top)",
        height: "calc(var(--appbar-h) + var(--safe-top))",
      }}
    >
      <div className="max-w-[var(--container-max)] mx-auto h-[var(--appbar-h)] px-[12px] flex items-center justify-between">
        <div className="flex items-center gap-[4px] min-w-0 flex-1">
          {!isRootTab && onBack ? (
            <IconButton
              aria-label="Wapas jayein"
              onClick={onBack}
              data-testid={`${testId || "appbar"}.back`}
            >
              <ArrowLeft className="w-[24px] h-[24px]" />
            </IconButton>
          ) : (
            <div className="w-[12px]" />
          )}

          {isRootTab ? (
            <h2
              className="type-h2 text-[var(--c-text)] truncate pl-[8px]"
              data-testid={`${testId || "appbar"}.title`}
            >
              {title}
            </h2>
          ) : (
            <h3
              className="type-h3 text-[var(--c-text)] truncate"
              data-testid={`${testId || "appbar"}.title`}
            >
              {title}
            </h3>
          )}
        </div>

        {rightActions && (
          <div className="flex items-center gap-[4px] shrink-0">
            {rightActions}
          </div>
        )}
      </div>
    </header>
  );
};
