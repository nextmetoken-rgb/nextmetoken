"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Chip, ChipVariant } from "./Chip";
import { ProgressLine } from "./ProgressLine";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "16" | "20" | "0";
  "data-testid"?: string;
}

export const Card: React.FC<CardProps> = ({
  padding = "16",
  children,
  className = "",
  "data-testid": testId,
  ...props
}) => {
  const padClass = padding === "20" ? "p-[20px]" : padding === "16" ? "p-[16px]" : "p-0";
  return (
    <div
      data-testid={testId}
      className={`bg-[var(--c-surface)] border border-[var(--c-border)] rounded-[16px] overflow-hidden ${padClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export interface ListRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  hasBorder?: boolean;
  className?: string;
  "data-testid"?: string;
}

export const ListRow: React.FC<ListRowProps> = ({
  children,
  onClick,
  hasBorder = true,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <div
      onClick={onClick}
      data-testid={testId}
      className={`min-h-[56px] py-[12px] px-[16px] flex items-center justify-between gap-[12px] transition-colors duration-fast ${
        hasBorder ? "border-b border-[var(--c-border)] last:border-b-0" : ""
      } ${onClick ? "cursor-pointer hover:bg-[var(--c-surface-2)] active:bg-[var(--c-surface-2)] select-none" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export interface SettingsRowProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  showChevron?: boolean;
  onClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  showChevron = true,
  onClick,
  className = "",
  "data-testid": testId,
}) => {
  return (
    <ListRow onClick={onClick} className={className} data-testid={testId}>
      <div className="flex items-center gap-[12px] min-w-0 flex-1">
        {icon && <span className="w-[20px] h-[20px] text-[var(--c-text-2)] shrink-0">{icon}</span>}
        <span className="type-body text-[var(--c-text)] truncate">{label}</span>
      </div>
      <div className="flex items-center gap-[8px] shrink-0">
        {value && <span className="type-body-sm text-[var(--c-text-2)]">{value}</span>}
        {showChevron && <ChevronRight className="w-[20px] h-[20px] text-[var(--c-text-2)]" />}
      </div>
    </ListRow>
  );
};

export interface PersonRowProps {
  number: number;
  name: string;
  subText?: string;
  isServing?: boolean;
  isYou?: boolean;
  isWithdrawn?: boolean;
  chipVariant?: ChipVariant;
  chipLabel?: string;
  onClick?: () => void;
  "data-testid"?: string;
}

export const PersonRow: React.FC<PersonRowProps> = ({
  number,
  name,
  subText,
  isServing = false,
  isYou = false,
  isWithdrawn = false,
  chipVariant,
  chipLabel,
  onClick,
  "data-testid": testId,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleRowClick = () => {
    setIsExpanded((prev) => !prev);
    onClick?.();
  };

  let rowBg = "bg-transparent";
  let borderClass = "";
  if (isYou) {
    rowBg = "bg-[var(--c-accent-soft)]";
    borderClass = "border border-[var(--c-accent-soft-border)] rounded-[12px]";
  }

  let numBoxBg = "bg-[var(--c-surface-2)] text-[var(--c-text)]";
  if (isServing) {
    numBoxBg = "bg-[var(--c-success)] text-white";
  } else if (isYou) {
    numBoxBg = "bg-[var(--c-accent)] text-white";
  }

  return (
    <div
      onClick={handleRowClick}
      data-testid={testId}
      className={`min-h-[64px] py-[10px] px-[12px] flex items-center justify-between gap-[12px] cursor-pointer transition-colors ${rowBg} ${borderClass} ${
        isWithdrawn ? "opacity-60" : ""
      }`}
    >
      <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center type-label text-[18px] font-bold shrink-0 tabular-nums ${numBoxBg}">
        {number}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span
          className={`type-body-strong text-[var(--c-text)] ${
            isExpanded ? "break-words" : "truncate"
          }`}
        >
          {name}
        </span>
        {subText && <span className="type-caption text-[var(--c-text-2)]">{subText}</span>}
      </div>

      {chipVariant ? (
        <Chip variant={chipVariant} label={chipLabel} />
      ) : isServing ? (
        <Chip variant="now" label="Ab chal raha" />
      ) : isYou ? (
        <Chip variant="you" label="Aap" />
      ) : isWithdrawn ? (
        <Chip variant="left" label="Line chhod di" />
      ) : null}
    </div>
  );
};

export interface QueueCardProps {
  name: string;
  status: "live" | "paused" | "closed" | "locked" | "deleted";
  currentNumber?: number;
  waitingCount?: number;
  lastUsedText?: string;
  onClick: () => void;
  "data-testid"?: string;
}

export const QueueCard: React.FC<QueueCardProps> = ({
  name,
  status,
  currentNumber = 0,
  waitingCount = 0,
  lastUsedText,
  onClick,
  "data-testid": testId,
}) => {
  return (
    <Card
      padding="16"
      onClick={onClick}
      data-testid={testId}
      className="cursor-pointer hover:bg-[var(--c-surface-2)] active:bg-[var(--c-surface-2)] transition-colors select-none"
    >
      <div className="flex items-center justify-between gap-[12px]">
        <h3 className="type-h3 text-[var(--c-text)] truncate flex-1">{name}</h3>
        <Chip
          variant={
            status === "live"
              ? "live"
              : status === "paused"
              ? "paused"
              : "closed"
          }
          label={status === "locked" ? "Locked" : undefined}
        />
      </div>

      <div className="mt-[8px] type-body-sm text-[var(--c-text-2)]">
        {status === "closed" || status === "locked" ? (
          lastUsedText || "Line band hai"
        ) : (
          `Chal raha: ${currentNumber} · ${waitingCount} intezar me`
        )}
      </div>
    </Card>
  );
};

export interface TokenCardProps {
  businessName: string;
  currentNumber: number;
  yourNumber: number;
  totalTokensInQueue?: number;
  status: ChipVariant;
  statusLabel?: string;
  onClick: () => void;
  "data-testid"?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  businessName,
  currentNumber,
  yourNumber,
  totalTokensInQueue = 20,
  status,
  statusLabel,
  onClick,
  "data-testid": testId,
}) => {
  const progress = Math.min(100, Math.max(0, (currentNumber / (yourNumber || 1)) * 100));

  return (
    <Card
      padding="16"
      onClick={onClick}
      data-testid={testId}
      className="cursor-pointer hover:bg-[var(--c-surface-2)] active:bg-[var(--c-surface-2)] transition-colors select-none"
    >
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="type-h3 text-[var(--c-text)] truncate">{businessName}</h3>
          <span className="type-body-sm text-[var(--c-text-2)] mt-[4px]">
            Chal raha: <strong className="text-[var(--c-text)]">{currentNumber}</strong> · Aapka:{" "}
            <strong className="text-[var(--c-accent)]">{yourNumber}</strong>
          </span>
        </div>
        <Chip variant={status} label={statusLabel} />
      </div>

      <div className="mt-[12px]">
        <ProgressLine progress={progress} compact />
      </div>
    </Card>
  );
};
