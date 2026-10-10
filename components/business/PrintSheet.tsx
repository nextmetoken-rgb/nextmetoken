'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from '@/components/QRCodeSVG';
import { brand } from '@/lib/brand';

const STEPS = ['Phone camera se QR scan karein', 'Google se login karke naam likhein', 'Token lein, live number dekhein aur apni baari par aayein'];
const OWNER = ['QR ko entrance par lagayein.', 'Walk-in ko counter se token dein.', 'Agla dabakar number bulayein.', 'Line roken ya din khatam karein.'];

export function PrintSheet({ title, value, bookId, variants }: { title: string; value: string; bookId?: string; variants: string[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  let host = 'nextmetoken.vercel.app';
  try { host = new URL(value).host; } catch { /* default host */ }
  return createPortal(<>{variants.map((variant) => (
    <div key={variant} className={`print-sheet ${variant === 'info' ? 'with-info' : 'qr-only'}`} data-testid="qr.printsheet">
      {variant === 'info' ? <>
        <header><div className="print-name">{title}</div><span className="print-pill">Line me khade na rahein</span></header>
        <div className="print-frame"><div className="print-qr"><QRCodeSVG value={value} size="100%" label={`QR code: ${title}`} /></div><span className="print-ribbon">Scan karke token lein</span></div>
        <ol className="print-steps">{STEPS.map((s, i) => <li key={s}><b>{i + 1}</b><span>{s}</span></li>)}</ol>
        <div className="print-book"><p>QR na chale to <strong>{host}</strong> kholein aur ye Book ID likhein</p>{bookId && <span className="print-book-id">{bookId}</span>}</div>
        <section className="print-owner"><h2>Business owner ke liye</h2><div>{OWNER.map(o => <p key={o}>{o}</p>)}</div></section>
        <footer>{brand.name}</footer>
      </> : <>
        <h1 className="print-name">{title}</h1>
        <div className="print-qr"><QRCodeSVG value={value} size="100%" label={`QR code: ${title}`} /></div>
        <p className="print-scan">Scan karke token lein</p>
        {bookId && <p className="print-brand">Book ID: <b>{bookId}</b></p>}
        <p className="print-brand">{brand.name}</p>
      </>}
    </div>
  ))}</>, document.body);
}
