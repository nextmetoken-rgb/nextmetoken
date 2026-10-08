'use client';
import React from 'react';
import { Download } from 'lucide-react';
import { BottomSheet } from '@/components/BottomSheet';

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };
export function InstallButton({ className = '' }: { className?: string }) {
  const [installEvent, setInstallEvent] = React.useState<PromptEvent | null>(null);
  const [open, setOpen] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);
  React.useEffect(() => {
    const capture = (event: Event) => { event.preventDefault(); setInstallEvent(event as PromptEvent); };
    const installedHandler = () => { setInstalled(true); setInstallEvent(null); };
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', installedHandler);
    if ('serviceWorker' in navigator && location.protocol === 'https:') void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    return () => { window.removeEventListener('beforeinstallprompt', capture); window.removeEventListener('appinstalled', installedHandler); };
  }, []);
  const click = async () => {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
      setInstallEvent(null);
      return;
    }
    setOpen(true);
  };
  return <>
    <button type="button" className={`btn btn-secondary install-button ${className}`} onClick={click} disabled={installed}>
      <Download size={20} />{installed ? 'App installed' : 'App install karein'}
    </button>
    <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="App install karein" subtitle="Agar browser seedha install prompt na dikhaye, apne browser ke menu se yeh steps follow karein.">
      <div className="install-steps">
        <p><b>Android:</b> Chrome ya supported browser ke menu (⋮) me “Install app” ya “Add to Home screen” chunein.</p>
        <p><b>iPhone/iPad:</b> Safari me Share (↑) dabayein, “Add to Home Screen” chunein, phir “Add”.</p>
        <p><b>Computer:</b> Chrome/Edge ke address bar ke install icon ya browser menu me “Install app” chunein. Safari par Share &gt; Add to Dock available ho sakta hai.</p>
        <p className="t-caption c2">Install prompt browser aur device support par nirbhar hai; unsupported browser se website khud install nahi kar sakti.</p>
      </div>
    </BottomSheet>
  </>;
}
