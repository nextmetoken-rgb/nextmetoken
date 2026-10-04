export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Supabase connection missing hai. NEXT_PUBLIC_SUPABASE_URL aur NEXT_PUBLIC_SUPABASE_ANON_KEY ko .env.local ya hosting settings me bharein.');
  return { url, key };
}
