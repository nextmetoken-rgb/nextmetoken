"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { Chip, ChipVariant } from "./Chip";
import { ProgressLine } from "./ProgressLine";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  big?: boolean;
  children: React.ReactNode;
  testId?: string;
}

export const Card: React.FC<CardProps> = ({
  big = false,
  children,
  testId,
  style,
  className = "",
  ...props
}) => {
  return (
    <div
      {...props}
      data-testid={testId}
      style={{
        backgroundColor: "var(--c-surface)",
        border: "1px solid var(--c-border)",
        borderRadius: "16px",
        padding: big ? "20px" : "16px",
        boxShadow: "none",
        ...style,
      }}
      className={`card ${className}`}
    >
      {children}
    </div>
  );
};

export interface ListRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  testId?: string;
  hasDivider?: boolean;
}

export const ListRow: React.FC<ListRowProps> = ({
  children,
  onClick,
  testId,
  hasDivider = true,
}) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchEnd={() => setPressed(false)}
      style={{
        minHeight: "56px",
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        borderBottom: hasDivider ? "1px solid var(--c-border)" : "none",
        backgroundColor: pressed && onClick ? "var(--c-surface-2)" : "transparent",
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 120ms ease",
      }}
    >
      {children}
    </div>
  );
};

export interface SettingsRowProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  testId?: string;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  onClick,
  testId,
}) => {
  return (
    <ListRow onClick={onClick} testId={testId}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
        {icon && (
          <span style={{ color: "var(--c-text-2)", flexShrink: 0, width: "20px", height: "20px" }}>
            {icon}
          </span>
        )}
        <span className="t-body" style={{ color: "var(--c-text)" }}>
          {label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {value && (
          <span className="t-body-sm" style={{ color: "var(--c-text-2)" }}>
            {value}
          </span>
        )}
        {onClick && <ChevronRight size={20} style={{ color: "var(--c-text-2)" }} />}
      </div>
    </ListRow>
  );
};

export interface PersonRowProps {
  number: number;
  name: string;
  metaText?: string;
  isNow?: boolean;
  isYou?: boolean;
  isRemoved?: boolean;
  chipVariant?: ChipVariant;
  chipLabel?: string;
  onClick?: () => void;
  testId?: string;
}

export const PersonRow: React.FC<PersonRowProps> = ({
  number,
  name,
  metaText,
  isNow = false,
  isYou = false,
  isRemoved = false,
  chipVariant,
  chipLabel,
  onClick,
  testId,
}) => {
  const getNumberBg = () => {
    if (isNow) return "var(--c-success)";
    if (isYou) return "var(--c-accent)";
    return "var(--c-surface-2)";
  };

  const getNumberColor = () => {
    if (isNow || isYou) return "#FFFFFF";
    return "var(--c-text)";
  };

  return (
    <div
      data-testid={testId}
      onClick={onClick}
      style={{
        minHeight: "64px",
        padding: "12px 16px",
        display: "grid",
        gridTemplateColumns: "44px 1fr auto",
        alignItems: "center",
        gap: "12px",
        backgroundColor: isYou ? "var(--c-accent-soft)" : "transparent",
        border: isYou ? "1px solid var(--c-accent-soft-border)" : "none",
        borderRadius: isYou ? "12px" : "0px",
        opacity: isRemoved ? 0.6 : 1,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          backgroundColor: getNumberBg(),
          color: getNumberColor(),
          fontSize: "18px",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        {number}
      </div>
      <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <span
          className="t-label"
          style={{
            color: "var(--c-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </span>
        {metaText && (
          <span className="t-caption" style={{ color: "var(--c-text-2)" }}>
            {metaText}
          </span>
        )}
      </div>
      <div>
        {isNow && <Chip variant="now" label="Ab chal raha" />}
        {isYou && !isNow && <Chip variant="you" label="Aap" />}
        {isRemoved && <Chip variant="left" label="Hata diya" />}
        {!isNow && !isYou && !isRemoved && chipVariant && (
          <Chip variant={chipVariant} label={chipLabel} />
        )}
      </div>
    </div>
  );
};

export interface QueueCardProps {
  queueName: string;
  status: "live" | "paused" | "closed";
  servingNumber: number | null;
  waitingCount: number;
  subText?: string;
  closedReason?: string;
  onClick?: () => void;
  onPrefetch?: () => void;
  testId?: string;
}

export const QueueCard: React.FC<QueueCardProps> = ({
  queueName,
  status,
  servingNumber,
  waitingCount,
  subText,
  closedReason,
  onClick,
  onPrefetch,
  testId,
}) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Card
      testId={testId}
      onClick={onClick}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      onTouchStart={() => { onPrefetch?.(); setPressed(true); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchEnd={() => setPressed(false)}
      style={{
        cursor: onClick ? "pointer" : "default",
        backgroundColor: pressed && onClick ? "var(--c-surface-2)" : "var(--c-surface)",
        transition: "background-color 120ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <h3
          className="t-h3"
          style={{
            color: "var(--c-text)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {queueName}
        </h3>
        <Chip variant={status} />
      </div>
      <div className="t-body-sm" style={{ color: "var(--c-text-2)", marginTop: "8px" }}>
        {subText ?? `Chal raha: ${servingNumber ?? '—'} · ${waitingCount} intezar me`}
      </div>
      {closedReason && (
        <div className="t-caption" style={{ color: "var(--c-text-3)", marginTop: "4px" }}>
          {closedReason}
        </div>
      )}
    </Card>
  );
};

export { TokenCard } from "./TokenCard";
export type { TokenCardProps } from "./TokenCard";

