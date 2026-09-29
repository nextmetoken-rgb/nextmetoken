"use client";

import React from "react";
import { NumberFlip } from "./NumberFlip";
import { Chip } from "./Chip";

export type TicketState = "waiting" | "next" | "now" | "done" | "removed" | "skipped";

export interface TicketCardProps {
  servingNumber?: number | string;
  yourNumber?: number | string;
  current?: number | string; // legacy alias for servingNumber
  mine?: number | string; // legacy alias for yourNumber
  startTimeText?: string;
  peopleAheadText?: string;
  estimateTimeText?: string;
  state?: TicketState;
  variant?: "customer" | "console";
  testId?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  servingNumber,
  yourNumber,
  current,
  mine,
  startTimeText = "Shuru: 9:00 AM",
  peopleAheadText = "6 log pehle",
  estimateTimeText = "Lagbhag 20–30 min",
  state = "waiting",
  variant = "customer",
  testId = "ticket-card",
}) => {
  const actualServing = servingNumber ?? current ?? 12;
  const actualMine = yourNumber ?? mine ?? 19;
  const isConsole = variant === "console";

  const getColorTheme = () => {
    switch (state) {
      case "next":
        return {
          bg: "var(--c-next)",
          primary: "var(--c-on-next)",
          secondary: "rgba(59,35,0,.75)",
          perf: "rgba(59,35,0,.30)",
        };
      case "now":
        return {
          bg: "var(--c-success)",
          primary: "#FFFFFF",
          secondary: "var(--c-white-80)",
          perf: "var(--c-white-35)",
        };
      case "done":
      case "removed":
      case "skipped":
        return {
          bg: "var(--c-surface-2)",
          primary: "var(--c-text)",
          secondary: "var(--c-text-2)",
          perf: "var(--c-border-strong)",
        };
      case "waiting":
      default:
        return {
          bg: "var(--c-accent)",
          primary: "#FFFFFF",
          secondary: "var(--c-white-80)",
          perf: "var(--c-white-35)",
        };
    }
  };

  const theme = getColorTheme();

  return (
    <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto" }}>
      <div
        data-testid={testId}
        style={{
          position: "relative",
          backgroundColor: theme.bg,
          borderRadius: "24px",
          width: "100%",
          overflow: "hidden",
          transition: "background-color 300ms cubic-bezier(.2,0,0,1)",
          boxShadow: "none",
        }}
      >
        {/* Main Section */}
        <div
          style={{
            padding: "24px 20px 20px",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <span className="t-overline" style={{ color: theme.secondary, marginBottom: "8px" }}>
            AB CHAL RAHA HAI
          </span>
          <div style={{ color: theme.primary, marginBottom: "8px" }}>
            <NumberFlip value={actualServing} className="t-display-hero" />
          </div>
          {startTimeText && (
            <span className="t-caption" style={{ color: theme.secondary }}>
              {startTimeText}
            </span>
          )}
        </div>

        {/* Perforation + Notches (only for customer variant) */}
        {!isConsole && (
          <>
            <div
              style={{
                position: "relative",
                height: 0,
                borderTop: `2px dashed ${theme.perf}`,
                marginInline: "20px",
              }}
            >
              {/* Left Notch */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "-32px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "var(--c-bg)",
                }}
              />
              {/* Right Notch */}
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  right: "-32px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "var(--c-bg)",
                }}
              />
            </div>

            {/* Stub Section */}
            <div
              style={{
                padding: "16px 20px 20px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {/* Left column */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="t-overline" style={{ color: theme.secondary }}>
                  {state === "now" ? "AAPKI BAARI" : "AAPKA TOKEN"}
                </span>
                <span className="t-display-l" style={{ color: theme.primary }}>
                  {actualMine}
                </span>
              </div>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right" }}>
                <span className="t-label" style={{ color: theme.primary }}>
                  {peopleAheadText}
                </span>
                <span className="t-body-sm" style={{ color: theme.secondary }}>
                  {estimateTimeText}
                </span>
                <div style={{ marginTop: "4px" }}>
                  <Chip variant="estimate" label="andaza" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!isConsole && (
        <p
          className="t-caption"
          style={{
            color: "var(--c-text-2)",
            textAlign: "center",
            marginTop: "8px",
          }}
        >
          Ye anumaan hai, sahi samay alag ho sakta hai.
        </p>
      )}
    </div>
  );
};

export default TicketCard;
