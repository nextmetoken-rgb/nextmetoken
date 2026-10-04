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
  const qrPx = withInfo ? 900 : px;
  const markup = await qrSvgMarkup(value, qrPx);
  const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    await new Promise<void>((ok, fail) => { img.onload = () => ok(); img.onerror = () => fail(new Error('img')); img.src = url; });
    const canvas = document.createElement('canvas');
    canvas.width = px; canvas.height = withInfo ? 1200 : px;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas');
    ctx.imageSmoothingEnabled = false;
    if (withInfo) {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#10231f'; ctx.textAlign = 'center';
      ctx.font = '700 46px system-ui, sans-serif'; ctx.fillText((options.businessName || 'Business').slice(0, 40), px / 2, 84, px - 72);
      ctx.font = '600 34px system-ui, sans-serif'; ctx.fillText('Next Me Token', px / 2, 136);
      ctx.imageSmoothingEnabled = false; ctx.drawImage(img, (px - qrPx) / 2, 170, qrPx, qrPx);
      ctx.fillStyle = '#40534e'; ctx.font = '600 28px system-ui, sans-serif'; ctx.fillText('Scan to join the queue', px / 2, 1110);
      ctx.font = '500 24px system-ui, sans-serif'; ctx.fillText('Nextmetoken.vercel.app', px / 2, 1152);
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
