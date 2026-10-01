'use client';

import { useEffect } from 'react';
import { Button } from '@/components/Button';

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { if (process.env.NEXT_PUBLIC_SENTRY_DSN) void import('@sentry/nextjs').then(Sentry => Sentry.captureException(error)); }, [error]);
  return <main className="container center-page" role="alert"><h1 className="t-h2">Page khul nahi paya. Kripya refresh karein.</h1><Button onClick={reset}>Refresh karein</Button></main>;
}
