import { redirect } from 'next/navigation';
import AppShell from '@/components/shell/AppShell';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('users').select('name').eq('id', user.id).maybeSingle();
  if (!profile?.name) redirect('/onboarding/name');
  return <AppShell>{children}</AppShell>;
}
