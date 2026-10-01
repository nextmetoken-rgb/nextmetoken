import React from "react";
import { Card } from "./Cards";
import { Chip, ChipVariant } from "./Chip";
import { ProgressLine } from "./ProgressLine";

export interface TokenCardProps {
  businessName: string;
  servingNumber: number;
  yourNumber: number;
  state: ChipVariant;
  progressPercentage?: number;
  onClick?: () => void;
  testId?: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  businessName,
  servingNumber,
  yourNumber,
  state,
  progressPercentage = 50,
  onClick,
  testId,
}) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Card
      testId={testId}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      style={{
        cursor: onClick ? "pointer" : "default",
        backgroundColor: pressed && onClick ? "var(--c-surface-2)" : "var(--c-surface)",
        transition: "background-color 120ms ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <h3
            className="t-h3"
            style={{
              color: "var(--c-text)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {businessName}
          </h3>
          <div className="t-body-sm" style={{ color: "var(--c-text-2)", marginTop: "4px" }}>
            {`Chal raha: ${servingNumber} · Aapka: ${yourNumber}`}
          </div>
        </div>
        <Chip variant={state} />
      </div>
      <div style={{ marginTop: "12px" }}>
        <ProgressLine percentage={progressPercentage} compact />
      </div>
    </Card>
  );
};

