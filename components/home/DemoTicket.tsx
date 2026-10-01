'use client';

import { useEffect, useState } from 'react';
import { NumberFlip } from '@/components/NumberFlip';

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function DemoTicket() {
  const [start, setStart] = useState(0);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const initial = randomInt(1, 100);
    setStart(initial);
    setCurrent(initial);
    let timer = 0;
    let active = true;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!active) return;
        setCurrent(value => value >= initial + 16 ? 1 : value + 1);
        schedule();
      }, randomInt(10000, 20000));
    };
    schedule();
    return () => { active = false; window.clearTimeout(timer); };
  }, []);
  const mine = start ? start + 17 : '—';
  return <div className="demo-ticket" aria-label={`Abhi ${current || '—'}, aapka token ${mine}`}>
    <div className="demo-ticket-main"><span className="t-overline">ABHI CHAL RAHA HAI</span>{current ? <NumberFlip value={current} className="demo-number" /> : <span className="demo-number">—</span>}</div>
    <div className="ticket-perf" aria-hidden="true" />
    <div className="demo-ticket-mine"><span className="t-overline">AAPKA TOKEN</span>{start ? <NumberFlip value={mine} className="demo-number demo-mine" /> : <span className="demo-number demo-mine">—</span>}</div>
  </div>;
}
