import React from 'react';

export type DaysCoinSize = 'sm' | 'md' | 'lg';

/** Sone ka coin: andar din ki ginti. */
export function DaysCoin({ days, size = 'md' }: { days: number | string; size?: DaysCoinSize }) {
  return (
    <span className={`days-coin days-coin-${size}`} role="img" aria-label={`${days} din`}>
      <span className="days-coin-n">{days}</span>
      <span className="days-coin-u">din</span>
    </span>
  );
}

export default DaysCoin;
