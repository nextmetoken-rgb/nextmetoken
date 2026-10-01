import { redirect } from 'next/navigation';
import NameForm from '@/components/auth/NameForm';
import { safeNext } from '@/lib/safeNext';
import { createClient } from '@/lib/supabase/server';
import { NAME_MAX } from '@/lib/validateName';

export const metadata = { title: 'Naam' };

export default async function NamePage({ searchParams }: { searchParams: { next?: string } }) {
  const next = safeNext(searchParams.next);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent('/onboarding/name')}`);
  const { data: profile } = await supabase.from('users').select('name').eq('id', user.id).maybeSingle();
  if (profile?.name) redirect(next);
  const google = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? '') as string;
  return <NameForm defaultName={google.trim().slice(0, NAME_MAX)} next={next} />;
}
