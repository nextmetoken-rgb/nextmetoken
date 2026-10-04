'use client';
import { useEffect, useState } from 'react';
import { qrPath, QR_DARK, QR_LIGHT } from '@/lib/qr';

export function QRCodeSVG({ value, size, label }: { value: string; size: number | string; label?: string }) {
  const [graphic, setGraphic] = useState<{ size: number; path: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => { let active = true; setGraphic(null); setFailed(false); void qrPath(value).then(result => { if (active) setGraphic(result); }).catch(() => { if (active) setFailed(true); }); return () => { active = false; }; }, [value, attempt]);
  if (failed) return <div className="qr-error" role="alert"><span>QR code load nahi hua.</span><button type="button" onClick={() => setAttempt(value => value + 1)}>Dobara koshish karein</button></div>;
  if (!graphic) return <span className="qr-loading" role="img" aria-label={label ?? 'QR code'} />;
  const { size: box, path } = graphic;
  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={size} height={size} shapeRendering="crispEdges" role="img" aria-label={label ?? 'QR code'} style={{ display: 'block' }}>
      <rect width={box} height={box} fill={QR_LIGHT} />
      <path d={path} fill={QR_DARK} />
    </svg>
  );
}
