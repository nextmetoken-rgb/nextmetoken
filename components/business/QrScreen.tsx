'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Printer } from 'lucide-react';
import { AppBar } from '@/components/AppBar';
import { Banner } from '@/components/Banner';
import { Button } from '@/components/Button';
import { QRFrame } from '@/components/QRFrame';
import { Toast } from '@/components/Toast';
import { downloadQrPng } from '@/lib/qr';
import { t } from '@/lib/i18n';
import { useOnline } from '@/lib/useOnline';
import { PrintSheet } from './PrintSheet';

interface Props { id: string; code: string; title: string; created: boolean }

export default function QrScreen({ id, code, title, created }: Props) {
  const router = useRouter();
  const online = useOnline();
  const [link, setLink] = useState('');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(created ? { msg: t('qr.created'), type: 'success' } : null);

  useEffect(() => {
    setLink(`${window.location.origin}/q/${code}`);
    if (created) window.history.replaceState(null, '', `/app/business/${id}/qr`);
  }, [code, created, id]);

  const save = async () => {
    try { await downloadQrPng(link, `qr-${code}.png`); } catch { setToast({ msg: t('qr.saveError'), type: 'error' }); }
  };

  return (
    <>
      <AppBar title={t('qr.title')} onBack={() => router.push(`/app/business/${id}`)} testId="qr.appbar" />
      {!online && <Banner variant="offline" testId="qr.offline" />}
      <main className="container page tight qr-page" data-testid="qr" style={{ paddingTop: 'var(--sp-6)' }}>
        {link && <QRFrame businessName={title} value={link} testId="qr.frame" />}
        <div className="qr-actions">
          <Button fullWidth icon={<Printer size={20} />} onClick={() => window.print()} disabled={!link} testId="qr.print">{t('qr.print')}</Button>
          <Button fullWidth variant="secondary" icon={<Download size={20} />} onClick={save} disabled={!link} testId="qr.save">{t('qr.save')}</Button>
          <p className="t-caption qr-hint" data-testid="qr.hint" style={{ marginTop: 'var(--sp-1)' }}>{t('qr.hint')}</p>
          <Button fullWidth variant="tertiary" href={`/app/business/${id}`} testId="qr.console">Back</Button>
        </div>
      </main>
      {link && <PrintSheet title={title} value={link} />}
      {toast && <Toast type={toast.type} message={toast.msg} hasBottomNav onDismiss={() => setToast(null)} />}
    </>
  );
}
