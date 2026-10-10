import { brand } from '@/lib/brand';

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

export async function downloadQrPng(value: string, filename: string, options: { businessName?: string; bookId?: string; withInfo?: boolean; px?: number } = {}): Promise<void> {
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
      const w = canvas.width, h = canvas.height, T = '#0B6B63', F = 'system-ui,sans-serif';
      const host = (() => { try { return new URL(value).host; } catch { return 'nextmetoken.vercel.app'; } })();
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = T; ctx.lineWidth = 24; ctx.strokeRect(12, 12, w - 24, h - 24);
      ctx.fillStyle = T; ctx.fillRect(24, 24, w - 48, 250);
      ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.font = `800 70px ${F}`;
      ctx.fillText((options.businessName || 'Business').slice(0, 40), w / 2, 140, w - 120);
      ctx.beginPath(); ctx.roundRect(w / 2 - 230, 184, 460, 60, 30); ctx.fill();
      ctx.fillStyle = T; ctx.font = `700 30px ${F}`; ctx.fillText('Line me khade na rahein', w / 2, 226);
      const cs = 700, cx = (w - cs) / 2 - 30, cy = 330, cw = cs + 60;
      ctx.fillStyle = '#E6F4F1'; ctx.beginPath(); ctx.roundRect(cx, cy + 10, cw, cw, 40); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.strokeStyle = T; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(cx, cy, cw, cw, 40); ctx.fill(); ctx.stroke();
      ctx.imageSmoothingEnabled = false; ctx.drawImage(img, cx + 30, cy + 30, cs, cs);
      ctx.fillStyle = T; ctx.beginPath(); ctx.roundRect(w / 2 - 290, cy + cw - 36, 580, 76, 38); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `800 38px ${F}`; ctx.fillText('Scan karke token lein', w / 2, cy + cw + 16);
      const steps = [['Phone camera se', 'QR scan karein'], ['Google se login karke', 'naam likhein'], ['Token lein, live number', 'dekhein, baari par aayein']];
      steps.forEach((st, i) => {
        const x = 60 + i * 390, y = 1170, bw = 340;
        ctx.strokeStyle = T; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, bw, 150, 20); ctx.stroke();
        ctx.fillStyle = T; ctx.beginPath(); ctx.arc(x + bw / 2, y + 36, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = `800 26px ${F}`; ctx.fillText(String(i + 1), x + bw / 2, y + 45);
        ctx.fillStyle = '#111'; ctx.font = `600 24px ${F}`; ctx.fillText(st[0], x + bw / 2, y + 96, bw - 20); ctx.fillText(st[1], x + bw / 2, y + 128, bw - 20);
      });
      ctx.fillStyle = '#F2FAF8'; ctx.strokeStyle = T; ctx.lineWidth = 3; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.roundRect(110, 1350, w - 220, 170, 24); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#222'; ctx.font = `500 26px ${F}`; ctx.fillText(`QR na chale to ${host} kholein aur ye Book ID likhein`, w / 2, 1398, w - 260);
      if (options.bookId) { ctx.font = `800 52px ${F}`; const tw = Math.min(ctx.measureText(options.bookId).width + 90, w - 300); ctx.fillStyle = T; ctx.beginPath(); ctx.roundRect(w / 2 - tw / 2, 1424, tw, 76, 20); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillText(options.bookId, w / 2, 1480, tw - 40); }
      ctx.strokeStyle = '#D1D5DB'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(72, 1560); ctx.lineTo(w - 72, 1560); ctx.stroke();
      ctx.textAlign = 'left'; ctx.fillStyle = T; ctx.font = `700 22px ${F}`; ctx.fillText('BUSINESS OWNER KE LIYE', 72, 1595);
      ctx.fillStyle = '#333'; ctx.font = `400 21px ${F}`;
      ['1. QR ko entrance par lagayein.', '2. Walk-in ko counter se token dein.', '3. Agla dabakar number bulayein.', '4. Line roken ya din khatam karein.'].forEach((line, i) => ctx.fillText(line, i % 2 ? 640 : 72, 1632 + Math.floor(i / 2) * 32));
      ctx.textAlign = 'center'; ctx.fillStyle = T; ctx.font = `800 26px ${F}`; ctx.fillText(brand.name, w / 2, 1712);
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
