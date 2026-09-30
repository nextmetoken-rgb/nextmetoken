'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, ScanLine } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { IconButton } from '@/components/IconButton';
import Button from '@/components/Button';
import { Card, ListRow } from '@/components/Cards';
import { BottomSheet } from '@/components/BottomSheet';
import { ToggleRow } from '@/components/Toggle';
import { Toast } from '@/components/Toast';
import { ViewfinderOverlay } from '@/components/ViewfinderOverlay';
import { codeFromQr, decodeQr } from '@/lib/decodeQr';
import { t } from '@/lib/i18n';

type Cam = 'prompt' | 'denied' | 'unsupported' | 'scanning' | 'success';
const DEBOUNCE_MS = 1500;
const FREEZE_MS = 200;

export default function ScanView() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastNotOurs = useRef(0);
  const done = useRef(false);
  const [cam, setCam] = useState<Cam>('prompt');
  const [torch, setTorch] = useState(false);
  const [help, setHelp] = useState(false);
  const [tips, setTips] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const stop = useCallback(() => { streamRef.current?.getTracks().forEach(tr => tr.stop()); streamRef.current = null; }, []);

  const handleText = useCallback((text: string) => {
    if (done.current) return;
    const code = codeFromQr(text);
    if (!code) {
      if (Date.now() - lastNotOurs.current > DEBOUNCE_MS) { lastNotOurs.current = Date.now(); setToast(t('scan.notOurs')); }
      return;
    }
    done.current = true; setCam('success');
    setTimeout(() => { stop(); router.push(`/q/${code}`); }, FREEZE_MS);
  }, [router, stop]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) { setCam('unsupported'); return; }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; await videoRef.current.play().catch(() => undefined); }
      setCam('scanning');
    } catch (e) {
      const name = (e as DOMException).name;
      setCam(name === 'NotFoundError' || name === 'OverconstrainedError' ? 'unsupported' : 'denied');
    }
  }, []);

  // Camera sirf is tab par; chhodne par band. Permission pehle se mili ho toh seedha chalu.
  useEffect(() => {
    done.current = false;
    navigator.permissions?.query({ name: 'camera' as PermissionName }).then(p => { if (p.state === 'granted') void start(); }).catch(() => undefined);
    return stop;
  }, [start, stop]);

  useEffect(() => {
    if (cam !== 'scanning') return;
    const id = setInterval(async () => {
      const v = videoRef.current;
      if (!v || v.readyState < 2) return;
      const text = await decodeQr(v);
      if (text) handleText(text);
    }, 250);
    return () => clearInterval(id);
  }, [cam, handleText]);

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try { await track.applyConstraints({ advanced: [{ torch: !torch } as MediaTrackConstraintSet] }); setTorch(!torch); } catch { /* torch nahi hai */ }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = '';
    if (!f) return;
    const img = new Image(); const url = URL.createObjectURL(f);
    img.onload = async () => { const text = await decodeQr(img); URL.revokeObjectURL(url); handleText(text ?? ''); };
    img.onerror = () => { URL.revokeObjectURL(url); handleText(''); };
    img.src = url;
  };

  const gallery = () => fileRef.current?.click();
  const showCard = cam === 'prompt' || cam === 'denied' || cam === 'unsupported';

  return (
    <>
      <AppBar title={t('scan.title')} isRootTab transparent onDark testId="scan.appbar"
        rightActions={<IconButton icon={<HelpCircle size={24} />} variant="on-dark" aria-label={t('scan.help')} onClick={() => setHelp(true)} testId="scan.help" />} />
      <video ref={videoRef} playsInline muted style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', objectFit: 'cover', background: '#000', zIndex: 0 }} data-testid="scan.video" />
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} data-testid="scan.file" />
      {(cam === 'scanning' || cam === 'success') && (
        <ViewfinderOverlay label={t('scan.frame')} isSuccess={cam === 'success'} onTorchToggle={toggleTorch} onGallerySelect={gallery} testId="scan.viewfinder" />
      )}
      {showCard && (
        <main className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 'var(--sp-8)' }} data-testid="scan">
          <Card style={{ textAlign: 'center' }}>
            <ScanLine size={40} color="var(--c-accent)" aria-hidden="true" />
            <h2 className="t-h2" style={{ marginTop: 'var(--sp-2)' }}>{t(cam === 'prompt' ? 'scan.prompt.h' : cam === 'denied' ? 'scan.denied.h' : 'scan.unsupported.h')}</h2>
            <p className="t-body-sm c2" style={{ marginTop: 'var(--sp-1)' }}>{t(cam === 'prompt' ? 'scan.prompt.b' : cam === 'denied' ? 'scan.denied.b' : 'scan.unsupported.b')}</p>
            <div style={{ display: 'grid', gap: 'var(--sp-2)', marginTop: 'var(--sp-4)' }}>
              {cam !== 'unsupported' && <Button variant="primary" size="md" fullWidth onClick={start} testId="scan.enable">{t(cam === 'prompt' ? 'scan.enable' : 'scan.retry')}</Button>}
              <Button variant={cam === 'prompt' ? 'tertiary' : cam === 'denied' ? 'secondary' : 'primary'} size="md" fullWidth onClick={gallery} testId="scan.gallery">{t('scan.gallery')}</Button>
            </div>
          </Card>
        </main>
      )}
      <BottomSheet isOpen={help} onClose={() => setHelp(false)} title={t('scan.help')} dismissible testId="scan.helpsheet">
        <ToggleRow label={t('scan.sheet.tips')} checked={tips} onChange={setTips} testId="scan.tips" />
        <ListRow onClick={() => router.push('/app/guide')} testId="scan.guide">{t('scan.sheet.guide')}</ListRow>
      </BottomSheet>
      {toast && <Toast type="info" message={toast} onDismiss={() => setToast(null)} testId="scan.toast" />}
    </>
  );
}
