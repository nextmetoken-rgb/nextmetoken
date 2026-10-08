export const QR_DARK = '#111827';
export const QR_LIGHT = '#FFFFFF';
export const QR_QUIET = 4;

export async function qrPath(value: string): Promise<{ size: number; path: string }> {
  const { default: qrcode } = await import('qrcode-generator');
  const qr = qrcode(0, 'M');
  qr.addData(value);
  qr.make();
  const n = qr.getModuleCount();
  let path = '';
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) path += `M${c + QR_QUIET} ${r + QR_QUIET}h1v1h-1z`;
    }
  }
  return { size: n + QR_QUIET * 2, path };
}

export async function qrSvgMarkup(value: string, px: number): Promise<string> {
  const { size, path } = await qrPath(value);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${QR_LIGHT}"/><path fill="${QR_DARK}" d="${path}"/></svg>`;
}

export async function downloadQrPng(value: string, filename: string, options: { businessName?: string; withInfo?: boolean; px?: number } = {}): Promise<void> {
  const px = options.px ?? 1024;
  const withInfo = options.withInfo ?? false;
  const qrPx = withInfo ? 760 : px;
  const markup = await qrSvgMarkup(value, qrPx);
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    await new Promise<void>((ok, fail) => { img.onload = () => ok(); img.onerror = () => fail(new Error('img')); img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = withInfo ? 1240 : px; canvas.height = withInfo ? 1754 : px;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.imageSmoothingEnabled = false;
    if (withInfo) {
      const w=canvas.width,h=canvas.height;ctx.fillStyle='#ffffff';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#0B6B63';ctx.lineWidth=24;ctx.strokeRect(12,12,w-24,h-24);
      ctx.fillStyle='#0B6B63';ctx.fillRect(24,24,w-48,248);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='700 54px system-ui,sans-serif';ctx.fillText((options.businessName||'Business').slice(0,40),w/2,102,w-100);ctx.font='700 34px system-ui,sans-serif';ctx.fillText('LINE ME KHADE NA RAHEIN',w/2,164);ctx.font='600 26px system-ui,sans-serif';ctx.fillText('QR scan karke token lein aur apni baari par aayein',w/2,220,w-100);
      ctx.fillStyle='#111';ctx.beginPath();ctx.roundRect((w-qrPx)/2,310,qrPx,qrPx,28);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect((w-qrPx)/2+12,322,qrPx-24,qrPx-24);ctx.imageSmoothingEnabled=false;ctx.drawImage(img,(w-qrPx)/2+22,332,qrPx-44,qrPx-44);
      ctx.fillStyle='#111';ctx.beginPath();ctx.roundRect(220,1100,w-440,64,32);ctx.fill();ctx.fillStyle='#fff';ctx.font='700 26px system-ui,sans-serif';ctx.fillText('Phone camera se yahan scan karein',w/2,1142);
      ctx.fillStyle='#333';ctx.font='500 22px system-ui,sans-serif';ctx.fillText('QR na chale to browser me likhein',w/2,1210);ctx.fillStyle='#111';ctx.font='800 38px system-ui,sans-serif';ctx.fillText('nextmetoken.vercel.app',w/2,1260);
      const cards=['LIVE UPDATE','GHAR SE TOKEN','MUFT AUR AASAAN'];const cw=350;cards.forEach((label,i)=>{const x=60+i*390;ctx.strokeStyle='#0B6B63';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(x,1310,cw,98,18);ctx.stroke();ctx.fillStyle='#0B6B63';ctx.font='700 20px system-ui,sans-serif';ctx.fillText(label,x+cw/2,1368)});
      ctx.textAlign='left';ctx.fillStyle='#0B6B63';ctx.font='700 22px system-ui,sans-serif';ctx.fillText('BUSINESS OWNER KE LIYE',72,1470);ctx.fillStyle='#222';ctx.font='400 18px system-ui,sans-serif';['1. QR entrance par lagayein.','2. Customer phone camera se scan kare.','3. Walk-in ko counter se token dein.','4. Agla dabakar number bulayein.','5. Line pause ya end kar sakte hain.','6. Balance aur history Business me dekhein.'].forEach((line,i)=>ctx.fillText(line,72,1505+i*29));ctx.textAlign='center';ctx.fillStyle='#0B6B63';ctx.font='700 20px system-ui,sans-serif';ctx.fillText('Token App',w/2,1710);
    } else { ctx.imageSmoothingEnabled = false; ctx.drawImage(img, 0, 0, px, px); }
    const blob: Blob = await new Promise((ok, fail) => canvas.toBlob(b => (b ? ok(b) : fail(new Error('blob'))), 'image/png'));
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  } finally {
    URL.revokeObjectURL(url);
  }
}
