'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav, type NavTab } from '@/components/BottomNav';
import { Dialog } from '@/components/Dialog';
import { createClient } from '@/lib/supabase/client';
import { isManualLogout } from '@/lib/authFlag';
import { t } from '@/lib/i18n';

const TABS: NavTab[] = ['tokens', 'scan', 'profile', 'business'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [expired, setExpired] = useState(false);
  const active = TABS.find(tab => pathname === `/app/${tab}` || pathname.startsWith(`/app/${tab}/`)) ?? 'scan';

  useEffect(() => {
    if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/sw.js').catch(() => undefined);
    const { data } = createClient().auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && !isManualLogout()) setExpired(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const isRoot = TABS.some(tab => pathname === `/app/${tab}`);

  return (
    <div className="tab-body app-shell" data-testid="tabshell">
      {children}
      {isRoot && <BottomNav activeTab={active} onTabChange={(tab) => router.push(`/app/${tab}`)} />}
      <Dialog
        isOpen={expired} title={t('session.title')} body={t('session.body')} primaryLabel={t('session.cta')}
        onPrimary={() => router.push(`/login?next=${encodeURIComponent(pathname)}`)}
        onCancel={() => router.push('/')} testId="session.dialog"
      />
    </div>
  );
}
