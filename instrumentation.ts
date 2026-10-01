import { brand } from '@/lib/brand';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const missing = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].filter(key => !process.env[key]);
    if (missing.length && process.env.NEXT_PHASE !== 'phase-production-build') {
      process.stderr.write(`${brand.name} setup: missing environment values: ${missing.join(', ')}. Add them in .env.local or deployment settings.\n`);
    }
  }
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  if (process.env.NEXT_RUNTIME === 'nodejs') await import('./sentry.server.config');
  if (process.env.NEXT_RUNTIME === 'edge') await import('./sentry.edge.config');
}
