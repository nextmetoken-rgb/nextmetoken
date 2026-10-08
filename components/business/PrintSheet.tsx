'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from '@/components/QRCodeSVG';
import { brand } from '@/lib/brand';

export function PrintSheet({ title, value, variants }: { title: string; value: string; variants:string[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return createPortal(<>{variants.map((variant)=><div key={variant} className={`print-sheet ${variant==='info'?'with-info':'qr-only'}`} data-testid="qr.printsheet">
    {variant==='info'?<><header><div className="print-name">{title}</div><span className="print-pill">Line me khade na rahein</span><h1>QR scan karke token lein<br/>aur apni baari par aayein.</h1></header><div className="print-qr"><QRCodeSVG value={value} size="100%" label={`QR code: ${title}`} /></div><span className="print-scan-pill">Phone ka camera yahan scan karein</span><p className="print-url-label">QR na chale to browser me likhein</p><strong className="print-url">nextmetoken.vercel.app</strong><div className="print-cards"><b>Apni baari ka live update</b><b>Ghar se token lein</b><b>Muft aur aasaan</b></div><section className="print-owner"><h2>Business owner ke liye</h2><p>1. QR ko entrance par lagayein.</p><p>2. Customer phone camera se scan kare.</p><p>3. Walk-in customer ko bhi token dein.</p><p>4. Agla dabakar number bulayein.</p><p>5. Line ko pause ya end karein.</p><p>6. Din khatam hone par balance dekhein.</p></section><footer>{brand.name}</footer></>:<><h1 className="print-name">{title}</h1><div className="print-qr"><QRCodeSVG value={value} size="100%" label={`QR code: ${title}`} /></div><p className="print-scan">Scan to join the queue</p></>}
  </div>)}</>,document.body);
}
