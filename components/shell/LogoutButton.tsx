'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { createClient } from '@/lib/supabase/client';
import { markManualLogout } from '@/lib/authFlag';
import { t } from '@/lib/i18n';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    markManualLogout();
    await createClient().auth.signOut();
    router.replace('/');
    router.refresh();
  };
  return <Button variant="secondary" size="md" fullWidth loading={loading} onClick={logout} testId="profile.logout">{t('profile.logout')}</Button>;
}
