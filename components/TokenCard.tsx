import React from "react";
import { Check, ChevronRight, Clock3, LogOut, SkipForward, Timer } from "lucide-react";
import { ProgressLine } from "./ProgressLine";

export type TokenCardState = "waiting" | "next" | "now" | "done" | "left" | "expired" | "skipped" | "removed";

export interface TokenCardProps {
  businessName: string;
  servingNumber: number;
  yourNumber: number;
  state: TokenCardState | string;
  progressPercentage?: number;
  /** Line me kitne log pehle hain (sirf waiting ke liye) */
  aheadCount?: number;
  /** Poore ho chuke token ke neeche ki line, jaise "7 min me History me chala jayega" */
  footnote?: string;
  onClick?: () => void;
  testId?: string;
}

const LABEL: Record<string, string> = {
  now: "Ab aapki baari",
  next: "Agla number aapka",
  waiting: "Intezar me",
  done: "Baari poori hui",
  left: "Aapne line chhodi",
  expired: "Token expire ho gaya",
  skipped: "Number nikal gaya",
  removed: "Owner ne hata diya",
};

const FINISHED = ["done", "left", "expired", "skipped", "removed"];

function StateIcon({ state }: { state: string }) {
  if (state === "done") return <Check size={14} />;
  if (state === "left") return <LogOut size={14} />;
  if (state === "expired") return <Timer size={14} />;
  if (state === "skipped") return <SkipForward size={14} />;
  if (state === "removed") return <LogOut size={14} />;
  if (state === "now") return <span className="tk-dot" />;
  return <Clock3 size={14} />;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  businessName,
  servingNumber,
  yourNumber,
  state,
  progressPercentage,
  aheadCount,
  footnote,
  onClick,
  testId,
}) => {
  const finished = FINISHED.includes(state);
  const meta = finished
    ? footnote
    : state === "now"
      ? "Counter par aaiye"
      : `Ab chal raha: ${servingNumber || "—"}${typeof aheadCount === "number" ? ` · ${aheadCount === 0 ? "aap agle hain" : `${aheadCount} log pehle`}` : ""}`;

  return (
    <div
      data-testid={testId}
      className={`tk-card tk-${state}${finished ? " tk-finished" : ""}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => { if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } }}
    >
      <div className="tk-stub">
        <span className="tk-stub-label">AAPKA</span>
        <span className="tk-num">{yourNumber}</span>
      </div>
      <div className="tk-perf" aria-hidden="true" />
      <div className="tk-body">
        <h3 className="tk-title">{businessName}</h3>
        <span className="tk-pill"><StateIcon state={state} />{LABEL[state] ?? "Token"}</span>
        {meta && <p className="tk-meta">{meta}</p>}
        {!finished && typeof progressPercentage === "number" && <ProgressLine percentage={progressPercentage} compact />}
      </div>
      {onClick && <ChevronRight className="tk-go" size={20} aria-hidden="true" />}
    </div>
  );
};
