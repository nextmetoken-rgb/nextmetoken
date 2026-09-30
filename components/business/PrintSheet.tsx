'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from '@/components/QRCodeSVG';
import { brand } from '@/lib/brand';
import { t } from '@/lib/i18n';

export function PrintSheet({ title, value }: { title: string; value: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return createPortal(
    <div className="print-sheet" data-testid="qr.printsheet">
      <h1 className="print-name">{title}</h1>
      <div className="print-qr"><QRCodeSVG value={value} size="100%" label={`QR code: ${title}`} /></div>
      <p className="print-scan"><span>{t('qr.scanHi')}</span><span>{t('qr.scanEn')}</span></p>
      <p className="print-brand">{brand.name}</p>
    </div>,
    document.body,
  );
}
