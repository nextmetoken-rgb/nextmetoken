import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/safeNext';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get('next'));
  const code = url.searchParams.get('code');
  const providerError = url.searchParams.get('error');
  const to = (path: string) => NextResponse.redirect(new URL(path, url.origin));

  if (providerError === 'access_denied') return to(`/login?next=${encodeURIComponent(next)}`); // cancel: koi error nahi
  if (!code) return to(`/login?error=1&next=${encodeURIComponent(next)}`);

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return to(`/login?error=1&next=${encodeURIComponent(next)}`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return to(`/login?error=1&next=${encodeURIComponent(next)}`);
  const { data: profile } = await supabase.from('users').select('name').eq('id', user.id).maybeSingle();
  return to(profile?.name ? next : `/onboarding/name?next=${encodeURIComponent(next)}`);
}
