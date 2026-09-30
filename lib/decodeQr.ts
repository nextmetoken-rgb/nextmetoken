import jsQR from 'jsqr';

type Detector = { detect: (src: ImageBitmapSource) => Promise<{ rawValue: string }[]> };
declare global { interface Window { BarcodeDetector?: new (o: { formats: string[] }) => Detector } }

let detector: Detector | null | undefined;
const getDetector = (): Detector | null => {
  if (detector === undefined) detector = typeof window !== 'undefined' && window.BarcodeDetector ? new window.BarcodeDetector({ formats: ['qr_code'] }) : null;
  return detector;
};

const canvas = () => (typeof document !== 'undefined' ? document.createElement('canvas') : null);

/** Video frame ya image se QR text; na mile toh null. */
export async function decodeQr(src: HTMLVideoElement | HTMLImageElement): Promise<string | null> {
  const d = getDetector();
  if (d) { try { const r = await d.detect(src); if (r[0]) return r[0].rawValue; } catch { /* jsQR par jao */ } }
  const c = canvas(); if (!c) return null;
  const w = src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth;
  const h = src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight;
  if (!w || !h) return null;
  const scale = Math.min(1, 800 / Math.max(w, h));
  c.width = Math.round(w * scale); c.height = Math.round(h * scale);
  const ctx = c.getContext('2d', { willReadFrequently: true }); if (!ctx) return null;
  ctx.drawImage(src, 0, 0, c.width, c.height);
  const img = ctx.getImageData(0, 0, c.width, c.height);
  return jsQR(img.data, img.width, img.height)?.data ?? null;
}

/** Sirf apne app ke /q/<code> link maane jaate hain. */
export function codeFromQr(text: string): string | null {
  try {
    const u = new URL(text);
    if (u.origin !== window.location.origin) return null;
    const m = /^\/q\/([A-Za-z0-9_-]{10,64})\/?$/.exec(u.pathname);
    return m ? m[1] : null;
  } catch { return null; }
}
