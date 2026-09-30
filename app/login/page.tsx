import { redirect } from 'next/navigation';
import LoginView from '@/components/auth/LoginView';
import { safeNext } from '@/lib/safeNext';
import { createClient } from '@/lib/supabase/server';
import { brand } from '@/lib/brand';

export const metadata = { title: `Login | ${brand.name}` };

export default async function LoginPage({ searchParams }: { searchParams: { next?: string; error?: string } }) {
  const next = safeNext(searchParams.next);
  const { data: { user } } = await createClient().auth.getUser();
  if (user && !searchParams.error) redirect(next);
  return <LoginView next={next} hasError={searchParams.error === '1'} />;
}
