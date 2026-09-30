"use client";

import React from "react";

export interface CountdownProps {
  targetDate: Date | string | number;
  testId?: string;
}

export const Countdown: React.FC<CountdownProps> = ({
  targetDate,
  testId = "countdown",
}) => {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(targetDate).getTime();
      const now = Date.now();
      const diffMs = target - now;

      if (diffMs <= 0) {
        setText("Samay samapt");
        return;
      }

      const totalMinutes = Math.floor(diffMs / (1000 * 60));
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      if (days > 0) {
        setText(`${days} din ${hours} ghante baaki`);
      } else if (hours > 0) {
        setText(`${hours} ghante ${minutes} min baaki`);
      } else {
        setText(`${minutes} min baaki`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span
      data-testid={testId}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {text}
    </span>
  );
};
