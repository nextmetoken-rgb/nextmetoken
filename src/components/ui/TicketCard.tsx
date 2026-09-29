"use client";

import React from "react";
import { NumberFlip } from "./NumberFlip";
import { Chip } from "./Chip";
import { CircleCheck, UserMinus, TriangleAlert, Moon } from "lucide-react";

export type TicketState = "waiting" | "next" | "now" | "done" | "removed" | "withdrawn" | "skipped" | "closed";

export interface TicketCardProps {
  state: TicketState;
  variant?: "default" | "console" | "landing";
  currentNumber: number;
  yourNumber?: number;
  startTimeText?: string;
  peopleAheadText?: string;
  estimatedTimeText?: string;
  subText?: string;
  actionButton?: React.ReactNode;
  "data-testid"?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  state,
  variant = "default",
  currentNumber,
  yourNumber,
  startTimeText = "Shuru: 9:00 AM",
  peopleAheadText = "6 log pehle",
  estimatedTimeText = "Lagbhag 20–30 min",
  subText,
  actionButton,
  "data-testid": testId,
}) => {
  // State styling table per Section 2.9
  let cardBg = "bg-[var(--c-accent)]";
  let primaryTextColor = "text-white";
  let secTextColor = "text-[var(--c-white-80)]";
  let perfColor = "border-[var(--c-white-35)]";

  if (state === "next") {
    cardBg = "bg-[var(--c-next)]";
    primaryTextColor = "text-[var(--c-on-next)]";
    secTextColor = "text-[rgba(59,35,0,0.75)]";
    perfColor = "border-[rgba(59,35,0,0.30)]";
  } else if (state === "now") {
    cardBg = "bg-[var(--c-success)]";
    primaryTextColor = "text-white";
    secTextColor = "text-[var(--c-white-80)]";
    perfColor = "border-[var(--c-white-35)]";
  } else if (state === "done" || state === "removed" || state === "withdrawn" || state === "skipped" || state === "closed") {
    cardBg = "bg-[var(--c-surface-2)]";
    primaryTextColor = "text-[var(--c-text)]";
    secTextColor = "text-[var(--c-text-2)]";
    perfColor = "border-[var(--c-border-strong)]";
  }

  // Console variant override
  if (variant === "console") {
    cardBg = "bg-[var(--c-accent)]";
    primaryTextColor = "text-white";
    secTextColor = "text-[var(--c-white-80)]";
  }

  const isTerminalState = ["done", "removed", "withdrawn", "skipped", "closed"].includes(state);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        data-testid={testId}
        className={`relative w-full max-w-[440px] rounded-[24px] overflow-hidden transition-colors duration-slow ease-standard ${cardBg}`}
      >
        {/* Main Section */}
        <div className="pt-[24px] px-[20px] pb-[20px] flex flex-col items-center justify-center min-h-[200px] text-center">
          {isTerminalState && variant === "default" ? (
            <div className="flex flex-col items-center gap-[8px]">
              {state === "done" && <CircleCheck className="w-[40px] h-[40px] text-[var(--c-success)]" />}
              {(state === "removed" || state === "withdrawn") && <UserMinus className="w-[40px] h-[40px] text-[var(--c-text-2)]" />}
              {state === "skipped" && <TriangleAlert className="w-[40px] h-[40px] text-[var(--c-next-strong)]" />}
              {state === "closed" && <Moon className="w-[40px] h-[40px] text-[var(--c-text-2)]" />}

              <h2 className={`type-h2 ${primaryTextColor}`}>
                {state === "done" && "Dhanyavaad"}
                {state === "removed" && "Owner ne aapko line se hata diya"}
                {state === "withdrawn" && "Aapne line chhod di"}
                {state === "skipped" && "Aapka number nikal gaya"}
                {state === "closed" && "Aaj ki line khatam ho gayi"}
              </h2>

              <p className={`type-body-sm ${secTextColor}`}>
                {subText ||
                  (state === "done" && `Aapka token ${yourNumber || ""} poora hua.`) ||
                  (state === "removed" && "Aap dobara scan karke token le sakte hain.") ||
                  (state === "withdrawn" && "Aap dobara scan karke naya token le sakte hain.") ||
                  (state === "skipped" && "Aap line me last me wapas aa sakte hain.") ||
                  (state === "closed" && "Aapka token history me hai.")}
              </p>
            </div>
          ) : (
            <>
              <span className={`type-overline ${secTextColor}`}>AB CHAL RAHA HAI</span>

              <div className={`mt-[8px] type-display-hero ${primaryTextColor}`}>
                <NumberFlip value={currentNumber} data-testid={`${testId || "ticket"}.running-number`} />
              </div>

              <span className={`type-caption mt-[8px] ${secTextColor}`}>{startTimeText}</span>
            </>
          )}
        </div>

        {/* Notches & Perforation Line (only if stub exists) */}
        {variant !== "console" && (
          <div className="relative w-full flex items-center justify-between">
            {/* Left Notch cut out */}
            <div className="w-[24px] h-[24px] rounded-full bg-[var(--c-bg)] -ml-[12px] z-10 shrink-0" />

            {/* Dashed Perforation Line */}
            <div className={`flex-1 border-t-2 dashed h-0 mx-[8px] ${perfColor}`} />

            {/* Right Notch cut out */}
            <div className="w-[24px] h-[24px] rounded-full bg-[var(--c-bg)] -mr-[12px] z-10 shrink-0" />
          </div>
        )}

        {/* Stub Section */}
        {variant !== "console" && (
          <div className="pt-[16px] px-[20px] pb-[20px]">
            {isTerminalState ? (
              actionButton && <div className="w-full flex justify-center">{actionButton}</div>
            ) : variant === "landing" ? (
              <div className="flex items-center justify-between gap-[16px]">
                <div className="flex flex-col">
                  <span className={`type-overline ${secTextColor}`}>AGLA AVAILABLE NUMBER</span>
                  <span className={`type-display-l ${primaryTextColor}`}>{yourNumber || currentNumber + 1}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-[16px] items-center">
                {/* Left column */}
                <div className="flex flex-col">
                  <span className={`type-overline ${secTextColor}`}>
                    {state === "now" ? "AAPKI BAARI" : "AAPKA TOKEN"}
                  </span>
                  <span
                    className={`type-display-l ${primaryTextColor}`}
                    data-testid={`${testId || "ticket"}.your-number`}
                  >
                    {yourNumber}
                  </span>
                </div>

                {/* Right column */}
                <div className="flex flex-col items-end text-right">
                  {state === "now" ? (
                    <span className={`type-body-strong ${primaryTextColor}`}>Counter par jaayein</span>
                  ) : state === "next" ? (
                    <>
                      <span className={`type-body-strong ${primaryTextColor}`}>Aap agle hain</span>
                      <span className={`type-body-sm ${secTextColor}`}>Lagbhag 5 min</span>
                    </>
                  ) : (
                    <>
                      <span className={`type-body-strong ${primaryTextColor}`}>{peopleAheadText}</span>
                      <span className={`type-body-sm ${secTextColor}`}>{estimatedTimeText}</span>
                      <div className="mt-[4px]">
                        <Chip variant="estimate" label="andaza" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note under ticket card per spec */}
      {variant === "default" && !isTerminalState && (
        <p className="type-caption text-[var(--c-text-2)] text-center mt-[8px]">
          Ye anumaan hai, sahi samay alag ho sakta hai.
        </p>
      )}
    </div>
  );
};
