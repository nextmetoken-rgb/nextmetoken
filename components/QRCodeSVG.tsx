'use client';
import { useMemo } from 'react';
import { qrPath, QR_DARK, QR_LIGHT } from '@/lib/qr';

export function QRCodeSVG({ value, size, label }: { value: string; size: number | string; label?: string }) {
  const { size: box, path } = useMemo(() => qrPath(value), [value]);
  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={size} height={size} shapeRendering="crispEdges" role="img" aria-label={label ?? 'QR code'} style={{ display: 'block' }}>
      <rect width={box} height={box} fill={QR_LIGHT} />
      <path d={path} fill={QR_DARK} />
    </svg>
  );
}
